"""
Rôle : signaler les fichiers de code trop longs et les fonctions trop longues.
Reçoit : les limites et les dossiers à ignorer (config/application.json, rubrique « structure »).
Produit : la liste des dépassements, en français, dans le terminal.
          Code de sortie 0 si tout est conforme, 1 sinon.
Utilisé par : l'enseignant (python -m outils.verifier_structure) et serveur/tests/.
"""
import ast
import os
import re
import sys
from pathlib import Path

from serveur.configuration import RACINE, lire_config

# Début d'une fonction JavaScript : « function nom(...) { », « nom = (...) => { » ou « nom(...) { ».
FONCTION_JS = re.compile(
    r"function\s*(?P<a>\w*)\s*\(.*?\)\s*\{"
    r"|(?:(?P<b>\w+)\s*=\s*)?(?:async\s*)?\(.*?\)\s*=>\s*\{"
    r"|^\s*(?:async\s+)?(?P<c>\w+)\s*\(.*?\)\s*\{"
)
MOTS_CLES_JS = {"if", "for", "while", "switch", "catch", "with"}
TEXTE_ENTRE_GUILLEMETS = re.compile(r"""(['"`])(?:\\.|(?!\1).)*\1""")


def lister_fichiers(racine, regles):
    """Parcourt le projet et renvoie ses fichiers de code, sans les dossiers ignorés."""
    fichiers = []
    for dossier, sous_dossiers, noms in os.walk(racine):
        sous_dossiers[:] = [d for d in sous_dossiers if d not in regles["dossiers_ignores"]]
        for nom in noms:
            if Path(nom).suffix in regles["extensions_code"]:
                fichiers.append(Path(dossier) / nom)
    return sorted(fichiers)


def fonctions_python(texte):
    """Renvoie (nom, ligne, longueur) pour chaque fonction d'un fichier Python."""
    arbre = ast.parse(texte)
    return [
        (noeud.name, noeud.lineno, noeud.end_lineno - noeud.lineno + 1)
        for noeud in ast.walk(arbre)
        if isinstance(noeud, (ast.FunctionDef, ast.AsyncFunctionDef))
    ]


def nettoyer_ligne_js(ligne):
    """Retire d'une ligne JavaScript les textes entre guillemets et le commentaire de fin."""
    return TEXTE_ENTRE_GUILLEMETS.sub("", ligne).split("//")[0]


def fin_de_bloc(lignes, debut, colonne):
    """Renvoie l'indice de la ligne qui ferme l'accolade ouverte en (debut, colonne)."""
    profondeur = 0
    for indice in range(debut, len(lignes)):
        ligne = nettoyer_ligne_js(lignes[indice])
        if indice == debut:
            ligne = ligne[colonne:]
        profondeur += ligne.count("{") - ligne.count("}")
        if profondeur <= 0:
            return indice
    return len(lignes) - 1


def fonctions_js(texte):
    """Renvoie (nom, ligne, longueur) pour chaque fonction d'un fichier JavaScript."""
    lignes = texte.splitlines()
    resultats = []
    for indice, ligne in enumerate(lignes):
        trouve = FONCTION_JS.search(nettoyer_ligne_js(ligne))
        if not trouve or trouve.group("c") in MOTS_CLES_JS:
            continue
        nom = next((groupe for groupe in trouve.groups() if groupe), "anonyme")
        fin = fin_de_bloc(lignes, indice, trouve.start())
        resultats.append((nom, indice + 1, fin - indice + 1))
    return resultats


def fonctions_du_fichier(extension, texte):
    """Choisit la façon de trouver les fonctions selon le langage du fichier."""
    if extension == ".py":
        return fonctions_python(texte)
    if extension == ".js":
        return fonctions_js(texte)
    return []


def verifier_fichier(chemin, racine, regles):
    """Renvoie les dépassements d'un fichier : trop de lignes, ou fonctions trop longues."""
    texte = chemin.read_text(encoding="utf-8")
    relatif = chemin.relative_to(racine).as_posix()
    problemes = []
    nb_lignes = len(texte.splitlines())
    if nb_lignes > regles["lignes_max_fichier"]:
        problemes.append(f"{relatif} : {nb_lignes} lignes (maximum {regles['lignes_max_fichier']})")
    try:
        fonctions = fonctions_du_fichier(chemin.suffix, texte)
    except SyntaxError as erreur:
        return problemes + [f"{relatif} : erreur de syntaxe ligne {erreur.lineno}, fichier non analysé"]
    for nom, ligne, longueur in fonctions:
        if longueur > regles["lignes_max_fonction"]:
            limite = regles["lignes_max_fonction"]
            problemes.append(f"{relatif}, ligne {ligne} : fonction {nom}, {longueur} lignes (maximum {limite})")
    return problemes


def verifier(racine, regles):
    """Vérifie tous les fichiers de code du projet et renvoie la liste des dépassements."""
    problemes = []
    for chemin in lister_fichiers(racine, regles):
        problemes += verifier_fichier(chemin, racine, regles)
    return problemes


def principal():
    """Lance la vérification sur le projet et affiche le résultat en français."""
    problemes = verifier(RACINE, lire_config("application")["structure"])
    if not problemes:
        print("Structure conforme : aucun fichier ni aucune fonction trop longs.")
        return 0
    print(f"{len(problemes)} dépassement(s) à corriger :")
    for probleme in problemes:
        print(f"- {probleme}")
    return 1


if __name__ == "__main__":
    sys.exit(principal())
