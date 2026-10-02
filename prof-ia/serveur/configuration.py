"""
Rôle : lire les fichiers de réglages du dossier config/.
Reçoit : le nom d'un fichier de réglages (par exemple « application »).
Produit : le contenu de ce fichier, sous forme de dictionnaire Python.
Utilisé par : serveur/main.py, serveur/routes/eleve.py, outils/verifier_structure.py.
"""
import json
from pathlib import Path

# Seul chemin écrit dans le code : la racine du projet, d'où l'on trouve config/.
RACINE = Path(__file__).resolve().parent.parent
DOSSIER_CONFIG = RACINE / "config"


def lire_config(nom):
    """Lit le fichier config/<nom>.json et renvoie son contenu."""
    chemin = DOSSIER_CONFIG / f"{nom}.json"
    if not chemin.exists():
        raise FileNotFoundError(f"Fichier de réglages introuvable : config/{nom}.json")
    with chemin.open(encoding="utf-8") as fichier:
        return json.load(fichier)


def chemin_projet(cle):
    """Renvoie le chemin complet d'un dossier déclaré dans config/application.json."""
    relatif = lire_config("application")["chemins"][cle]
    return RACINE / relatif
