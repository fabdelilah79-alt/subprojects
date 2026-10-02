"""
Rôle : remplacer le nom de l'élève par un pseudonyme (E001, E002…) dès l'accueil.
Reçoit : le nom et la classe saisis à l'accueil.
Produit : un nouveau pseudonyme ; la correspondance nom <-> pseudonyme est gardée à part,
          dans sorties/prive/correspondance.json (jamais envoyé à une API, jamais dans git).
Utilisé par : serveur/routes/eleve.py.
"""
import json
import threading

from serveur.configuration import chemin_projet, lire_config

VERROU = threading.Lock()


def fichier_correspondance():
    """Renvoie le chemin du fichier de correspondance, dans un dossier à part."""
    dossier = chemin_projet("prive")
    dossier.mkdir(parents=True, exist_ok=True)
    return dossier / "correspondance.json"


def lire_correspondance():
    """Lit la table nom <-> pseudonyme (vide au début)."""
    fichier = fichier_correspondance()
    return json.loads(fichier.read_text(encoding="utf-8")) if fichier.exists() else []


def attribuer(nom, classe):
    """Crée le pseudonyme suivant pour cet élève et enregistre la correspondance."""
    reglage = lire_config("application")["pseudonymes"]
    with VERROU:
        table = lire_correspondance()
        pseudonyme = f"{reglage['prefixe']}{len(table) + 1:0{reglage['chiffres']}d}"
        table.append({"pseudonyme": pseudonyme, "nom": nom.strip(), "classe": classe})
        fichier_correspondance().write_text(json.dumps(table, ensure_ascii=False, indent=2), encoding="utf-8")
    return pseudonyme
