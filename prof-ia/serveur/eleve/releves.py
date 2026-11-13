"""
Rôle : ranger et relire les relevés des laboratoires d'un élève (mesures, tableau, courbe, figure), sous son pseudonyme.
Reçoit : les données de l'événement « laboratoire_releve » envoyé par le laboratoire (mode cours) via le cadre média.
Produit : sorties/parties/<pseudonyme>/releves/<ressource>.json (le dernier envoi d'une ressource remplace le précédent)
          et <ressource>.svg (la figure de l'élève, nettoyée : seulement des formes, des textes et des styles simples) ;
          la liste des relevés et une version courte pour les agents.
Utilisé par : serveur/routes/eleve.py (réception), serveur/routes/releves.py (lecture), plus tard les agents.
Réglages dans config/application.json (bloc « releves ») : tailles maximales, balises et attributs permis dans la figure.
"""
import json
import re
from xml.etree import ElementTree

from serveur.configuration import lire_config
from serveur.donnees.stockage import dossier_eleve

NOM_PERMIS = re.compile(r"[a-z0-9_]{1,120}")
SVG = "http://www.w3.org/2000/svg"
VALEUR_STYLE = re.compile(r"[#a-zA-Z0-9 .,%()\-\"']*")


class ReleveInvalide(Exception):
    """Le relevé ne peut pas être rangé (ressource inconnue, données trop grandes)."""


def reglages():
    """Les réglages des relevés (config/application.json)."""
    return lire_config("application")["releves"]


def dossier(pseudonyme, creer=False):
    """Le dossier des relevés de l'élève (l'élève doit exister)."""
    chemin = dossier_eleve(pseudonyme) / reglages()["sous_dossier"]
    if creer:
        chemin.mkdir(exist_ok=True)
    return chemin


def style_propre(style, permises):
    """Garde du style seulement les propriétés permises, sans url() ni expression."""
    gardees = []
    for morceau in style.split(";"):
        nom, _, valeur = morceau.partition(":")
        nom, valeur = nom.strip(), valeur.strip()
        if nom in permises and "url" not in valeur.lower() and VALEUR_STYLE.fullmatch(valeur):
            gardees.append(f"{nom}:{valeur}")
    return ";".join(gardees)


def nettoyer_element(element, regles):
    """Retire d'un élément SVG les enfants non permis et les attributs non permis (événements, liens, scripts)."""
    for enfant in list(element):
        if enfant.tag.replace(f"{{{SVG}}}", "") not in regles["balises_figure"]:
            element.remove(enfant)
        else:
            nettoyer_element(enfant, regles)
    for nom in list(element.attrib):
        if nom not in regles["attributs_figure"]:
            del element.attrib[nom]
    if "style" in element.attrib:
        element.set("style", style_propre(element.get("style"), regles["proprietes_style_figure"]))


def nettoyer_svg(texte):
    """Renvoie la figure SVG nettoyée, ou None si elle est absente, trop grande ou illisible."""
    regles = reglages()
    if not isinstance(texte, str) or not texte or len(texte) > regles["taille_max_figure"] or "<!" in texte:
        return None
    try:
        racine = ElementTree.fromstring(texte)
    except ElementTree.ParseError:
        return None
    if racine.tag != f"{{{SVG}}}svg":
        return None
    nettoyer_element(racine, regles)
    ElementTree.register_namespace("", SVG)
    return ElementTree.tostring(racine, encoding="unicode")


def ranger(pseudonyme, donnees):
    """Range le relevé et sa figure ; renvoie le relevé rangé (sans la figure), avec « figure » vrai ou faux."""
    ressource = donnees.get("ressource")
    if not isinstance(ressource, str) or not NOM_PERMIS.fullmatch(ressource):
        raise ReleveInvalide(f"Ressource invalide : {ressource!r}")
    figure = nettoyer_svg(donnees.get("figure"))
    releve = {cle: valeur for cle, valeur in donnees.items() if cle not in ("figure", "source")}
    releve["figure"] = figure is not None
    texte = json.dumps(releve, ensure_ascii=False, indent=1)
    if len(texte) > reglages()["taille_max_releve"]:
        raise ReleveInvalide("Relevé trop grand.")
    rangement = dossier(pseudonyme, creer=True)
    (rangement / f"{ressource}.json").write_text(texte, encoding="utf-8")
    if figure:
        (rangement / f"{ressource}.svg").write_text(figure, encoding="utf-8")
    return releve


def lire(pseudonyme, ressource):
    """Le relevé d'une ressource (sans la figure), ou None."""
    if not NOM_PERMIS.fullmatch(ressource or ""):
        return None
    chemin = dossier(pseudonyme) / f"{ressource}.json"
    return json.loads(chemin.read_text(encoding="utf-8")) if chemin.exists() else None


def figure(pseudonyme, ressource):
    """La figure SVG nettoyée d'une ressource, ou None."""
    if not NOM_PERMIS.fullmatch(ressource or ""):
        return None
    chemin = dossier(pseudonyme) / f"{ressource}.svg"
    return chemin.read_text(encoding="utf-8") if chemin.exists() else None


def tous(pseudonyme):
    """Tous les relevés de l'élève, du plus ancien au plus récent."""
    rangement = dossier(pseudonyme)
    if not rangement.is_dir():
        return []
    fichiers = sorted(rangement.glob("*.json"), key=lambda f: f.stat().st_mtime)
    return [json.loads(f.read_text(encoding="utf-8")) for f in fichiers]


def pour_agents(pseudonyme):
    """Version courte pour les agents : mesures, tableau (lignes limitées), courbe ; ni figure ni détails techniques."""
    lignes_max = reglages()["lignes_max_pour_agents"]
    courts = []
    for r in tous(pseudonyme):
        tableau = r.get("tableau") or {}
        courts.append({"ressource": r.get("ressource"), "mission": r.get("titre"), "faits": r.get("faits"),
                       "tableau": {**tableau, "lignes": (tableau.get("lignes") or [])[:lignes_max]},
                       "courbe": r.get("courbe"), "figure": r.get("figure", False)})
    return courts
