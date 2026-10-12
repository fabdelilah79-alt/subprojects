"""
Rôle : faire de chaque simulation de laboratoire un seul fichier HTML autonome (styles, scripts et polices
       intégrés), qui s'ouvre sans serveur ni internet, sur téléphone, ordinateur ou tableau interactif.
Reçoit : le nom d'une ou plusieurs simulations (dossiers de laboratoires/sources/) ; sans nom, toutes.
Produit : laboratoires/<nom>.html pour chaque simulation, et la liste des fichiers écrits dans le terminal.
Utilisé par : l'enseignant (python -m outils.assembler_laboratoire [nom ...]) et serveur/tests/.
"""
import base64
import re
import sys
from pathlib import Path

from serveur.configuration import chemin_projet

FEUILLE = re.compile(r'<link rel="stylesheet" href="([^"]+)">')
SCRIPT = re.compile(r'<script src="([^"]+)"></script>')
URL_CSS = re.compile(r'url\("([^"]+)"\)')
TYPES = {".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg"}


def en_donnees(chemin):
    """Transforme un fichier (police, image) en adresse « data: » à mettre directement dans le CSS."""
    contenu = base64.b64encode(chemin.read_bytes()).decode("ascii")
    return f"data:{TYPES[chemin.suffix]};base64,{contenu}"


def style_integre(chemin_css):
    """Renvoie le CSS d'un fichier, ses polices et images incluses ; balise <style> prête à insérer."""
    texte = chemin_css.read_text(encoding="utf-8")
    texte = URL_CSS.sub(lambda m: f'url("{en_donnees(chemin_css.parent / m.group(1))}")', texte)
    return f"<style>\n{texte}</style>"


def script_integre(chemin_js):
    """Renvoie le code d'un fichier JavaScript dans une balise <script> (sans fermeture prématurée)."""
    texte = chemin_js.read_text(encoding="utf-8").replace("</script", "<\\/script")
    return f"<script>\n{texte}</script>"


def assembler(dossier_source):
    """Lit page.html d'une simulation et renvoie le HTML autonome correspondant."""
    page = (dossier_source / "page.html").read_text(encoding="utf-8")
    page = FEUILLE.sub(lambda m: style_integre((dossier_source / m.group(1)).resolve()), page)
    page = SCRIPT.sub(lambda m: script_integre((dossier_source / m.group(1)).resolve()), page)
    restes = FEUILLE.findall(page) + SCRIPT.findall(page)
    if restes:
        raise ValueError(f"Fichiers non intégrés dans {dossier_source.name} : {restes}")
    return page


def simulations(racine, noms):
    """Liste les dossiers de simulations demandés (tous si aucun nom n'est donné)."""
    sources = racine / "sources"
    dossiers = [sources / nom for nom in noms] if noms else sorted(p for p in sources.iterdir() if (p / "page.html").exists())
    for dossier in dossiers:
        if not (dossier / "page.html").exists():
            raise FileNotFoundError(f"Simulation introuvable : {dossier.name} (pas de page.html)")
    return dossiers


def ecrire_tout(racine, noms):
    """Assemble chaque simulation demandée et renvoie la liste (fichier, taille en ko)."""
    resultats = []
    for dossier in simulations(racine, noms):
        sortie = racine / f"{dossier.name}.html"
        sortie.write_text(assembler(dossier), encoding="utf-8")
        resultats.append((sortie, round(sortie.stat().st_size / 1024)))
    return resultats


def main():
    """Point d'entrée en ligne de commande."""
    racine = chemin_projet("laboratoires")
    for sortie, taille in ecrire_tout(racine, sys.argv[1:]):
        print(f"Écrit : {sortie.relative_to(racine.parent.parent.parent)} ({taille} ko)")


if __name__ == "__main__":
    main()
