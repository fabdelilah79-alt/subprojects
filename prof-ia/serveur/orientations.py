"""
Rôle : lire les orientations pédagogiques nationales (fiches JSON par niveau et par chapitre) et préparer
       ce que les agents doivent respecter, pour le cours et la filière choisis.
Reçoit : contenu/orientations/ (index.json, general.json, <niveau>/<chapitre>.json) et le cours de config/application.json.
Produit : la fiche d'un chapitre adaptée à une filière ; le texte compact donné aux agents ;
          les objectifs officiels de chaque partie du cours.
Utilisé par : serveur/agents/commun.py, serveur/pipeline/donnees_eleve.py, outils/valider_partition.py,
             outils/couverture_orientations.py.
"""
import json
from functools import lru_cache

from serveur.configuration import chemin_projet, lire_config

CHAMPS_LISTES = ("contenus", "objectifs", "activites", "orientations", "hors_programme")
CHAMPS_POUR_AGENTS = ("id", "titre", "prerequis", "contenus", "objectifs", "activites", "orientations", "hors_programme")


def dossier():
    """Dossier des orientations pédagogiques."""
    return chemin_projet("contenu") / "orientations"


def lire_json(nom):
    """Lit un fichier JSON du dossier des orientations (chemin relatif, sans .json pour une fiche)."""
    chemin = dossier() / (nom if nom.endswith(".json") else f"{nom}.json")
    return json.loads(chemin.read_text(encoding="utf-8"))


def lire_index():
    """Lit l'index : source, niveaux, filières, chapitres."""
    return lire_json("index.json")


def fiche(chapitre, filiere):
    """Fiche d'un chapitre pour une filière : la base, plus les ajouts propres à cette filière."""
    brute = lire_json(chapitre)
    if filiere not in brute["filieres"]:
        raise ValueError(f"Le chapitre {chapitre} n'est pas au programme de la filière {filiere}.")
    resultat = {cle: valeur for cle, valeur in brute.items() if cle != "specifique"}
    for ajout in brute.get("specifique", []):
        if filiere in ajout["filieres"]:
            for cle in CHAMPS_LISTES:
                resultat[cle] = resultat.get(cle, []) + ajout.get(cle, [])
    resultat["duree_h"] = [d for d in brute["duree_h"] if filiere in d["filieres"]]
    resultat["filiere"] = filiere
    return resultat


def cours():
    """Réglages du cours en cours (config/application.json)."""
    return lire_config("application")["cours"][0]


@lru_cache(maxsize=1)
def fiche_du_cours():
    """Fiche du chapitre du cours, pour la filière de la classe."""
    reglage = cours()
    return fiche(reglage["orientations"], reglage["filiere"])


def objectifs_de_la_partie(numero):
    """Objectifs officiels (id et texte) attribués à une partie du cours dans config/application.json."""
    ids = cours()["objectifs_par_partie"].get(str(numero), [])
    textes = {o["id"]: o["texte"] for o in fiche_du_cours()["objectifs"]}
    return [{"id": i, "texte": textes.get(i, "objectif inconnu")} for i in ids]


def texte_pour_agents():
    """Texte compact (JSON sans espaces) : règles générales et fiche du chapitre, pour le contexte des agents."""
    contenu = {
        "regles_generales": {cle: v for cle, v in lire_json("general.json").items() if cle != "source"},
        "chapitre": {cle: fiche_du_cours()[cle] for cle in CHAMPS_POUR_AGENTS if cle in fiche_du_cours()},
    }
    return json.dumps(contenu, ensure_ascii=False, separators=(",", ":"))
