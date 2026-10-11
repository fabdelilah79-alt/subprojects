"""
Rôle : lire les clés d'API dans le fichier .env (jamais dans le code) et dire si une clé est présente.
Reçoit : le fichier .env à la racine du projet (lignes NOM=valeur ; les lignes commençant par # sont ignorées).
Produit : les clés placées dans l'environnement du programme ; cle_presente(nom) ; l'erreur CleAbsente.
Utilisé par : serveur/agents/appel_ia.py, serveur/voix/gemini_tts.py, serveur/routes/eleve.py (état des clés).
"""
import os

from serveur.configuration import RACINE


class CleAbsente(Exception):
    """Une clé d'API nécessaire n'est pas dans le fichier .env."""


def charger_env():
    """Copie les clés du fichier .env dans l'environnement, sans écraser celles déjà définies."""
    fichier = RACINE / ".env"
    if not fichier.exists():
        return
    for ligne in fichier.read_text(encoding="utf-8").splitlines():
        ligne = ligne.strip()
        if not ligne or ligne.startswith("#") or "=" not in ligne:
            continue
        nom, valeur = (morceau.strip() for morceau in ligne.split("=", 1))
        if valeur and not os.environ.get(nom):
            os.environ[nom] = valeur.strip('"').strip("'")


def cle_presente(nom):
    """Vrai si la clé est disponible (dans .env ou dans l'environnement)."""
    charger_env()
    return bool(os.environ.get(nom))


def exiger(nom):
    """Lève CleAbsente, avec un message clair, si la clé manque."""
    if not cle_presente(nom):
        raise CleAbsente(f"Clé {nom} absente : ajoutez-la dans le fichier .env (voir .env.exemple).")
