"""
Rôle : ranger les fichiers de chaque élève dans son dossier, sous son pseudonyme (jamais son nom).
Reçoit : un pseudonyme, un nom de fichier et des données.
Produit : sorties/parties/<pseudonyme>/<fichier>.json ; une erreur claire si le pseudonyme n'est pas valide.
Utilisé par : serveur/routes/eleve.py, serveur/routes/qcm.py.
"""
import json
import re

from serveur.configuration import chemin_projet, lire_config


class PseudonymeInconnu(Exception):
    """Le pseudonyme n'a pas le bon format ou ne correspond à aucun élève."""


def forme_valide(pseudonyme):
    """Vérifie que le pseudonyme a la forme attendue (par exemple E001) : rien d'autre n'entre dans un chemin."""
    reglage = lire_config("application")["pseudonymes"]
    motif = rf"{re.escape(reglage['prefixe'])}[0-9]{{{reglage['chiffres']},}}"
    return isinstance(pseudonyme, str) and re.fullmatch(motif, pseudonyme) is not None


def dossier_eleve(pseudonyme, creer=False):
    """Renvoie le dossier de l'élève ; le crée si demandé, sinon vérifie qu'il existe."""
    if not forme_valide(pseudonyme):
        raise PseudonymeInconnu(f"Pseudonyme invalide : {pseudonyme!r}")
    dossier = chemin_projet("eleves") / pseudonyme
    if creer:
        dossier.mkdir(parents=True, exist_ok=True)
    elif not dossier.is_dir():
        raise PseudonymeInconnu(f"Aucun élève {pseudonyme}")
    return dossier


def ecrire(pseudonyme, nom_fichier, donnees, creer=False):
    """Enregistre des données JSON dans le dossier de l'élève."""
    chemin = dossier_eleve(pseudonyme, creer) / f"{nom_fichier}.json"
    chemin.write_text(json.dumps(donnees, ensure_ascii=False, indent=2), encoding="utf-8")
    return chemin
