"""
Rôle : ne générer qu'une fois un même audio (même texte, même voix, même ton, même fournisseur).
Reçoit : la description d'un audio à produire.
Produit : son nom de fichier dans sorties/cache_audio/ (une empreinte) et, s'il existe déjà, ses informations.
Utilisé par : serveur/voix/synthese.py.
"""
import hashlib
import json

from serveur.configuration import chemin_projet


def dossier():
    """Renvoie le dossier du cache audio, en le créant si besoin."""
    chemin = chemin_projet("cache_audio")
    chemin.mkdir(parents=True, exist_ok=True)
    return chemin


def empreinte(description):
    """Calcule un nom court et unique à partir de tout ce qui change le son produit."""
    texte = json.dumps(description, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(texte.encode("utf-8")).hexdigest()[:20]


def chercher(cle):
    """Renvoie les informations d'un audio déjà produit, ou None s'il n'existe pas encore."""
    fiche = dossier() / f"{cle}.json"
    if not fiche.exists() or not (dossier() / f"{cle}.wav").exists():
        return None
    return json.loads(fiche.read_text(encoding="utf-8"))


def enregistrer(cle, informations):
    """Enregistre la fiche d'un audio produit (durée, temps des mots)."""
    fiche = dossier() / f"{cle}.json"
    fiche.write_text(json.dumps(informations, ensure_ascii=False), encoding="utf-8")
