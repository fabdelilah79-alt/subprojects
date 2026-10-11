"""
Rôle : journal de recherche : enregistre chaque événement de chaque élève (sous son pseudonyme) dans une base SQLite.
Reçoit : un pseudonyme (ou rien), un type d'événement, ses données (dictionnaire) et l'heure du navigateur.
Produit : sorties/journaux/journal.sqlite (une ligne par événement, avec l'heure du serveur) ; la relecture des événements.
Utilisé par : serveur/routes/eleve.py, serveur/routes/qcm.py, serveur/routes/questions.py,
             serveur/pipeline/donnees_eleve.py et outils/exporter_donnees.py.
Le nom de l'élève n'entre jamais dans ce journal : seul le pseudonyme y figure.
"""
import json
import sqlite3
import threading
from datetime import datetime

from serveur.configuration import chemin_projet

_verrou = threading.Lock()

CREATION = """
CREATE TABLE IF NOT EXISTS evenements (
    numero INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudonyme TEXT,
    type TEXT NOT NULL,
    donnees TEXT NOT NULL,
    heure_navigateur TEXT,
    heure_serveur TEXT NOT NULL
)
"""


def ouvrir():
    """Ouvre la base (et la crée si besoin, avec sa table)."""
    chemin = chemin_projet("journal")
    chemin.parent.mkdir(parents=True, exist_ok=True)
    connexion = sqlite3.connect(chemin)
    connexion.execute(CREATION)
    return connexion


def ajouter(pseudonyme, type_evenement, donnees, heure_navigateur=None):
    """Ajoute un événement au journal, avec l'heure du serveur."""
    ligne = (pseudonyme, type_evenement, json.dumps(donnees, ensure_ascii=False), heure_navigateur,
             datetime.now().isoformat(timespec="milliseconds"))
    with _verrou:
        connexion = ouvrir()
        with connexion:
            connexion.execute(
                "INSERT INTO evenements (pseudonyme, type, donnees, heure_navigateur, heure_serveur) VALUES (?, ?, ?, ?, ?)",
                ligne)
        connexion.close()


def lire(pseudonyme=None, types=None):
    """Relit les événements, dans l'ordre, d'un élève et/ou de certains types (tous si rien n'est précisé)."""
    requete, valeurs = "SELECT numero, pseudonyme, type, donnees, heure_navigateur, heure_serveur FROM evenements", []
    conditions = []
    if pseudonyme is not None:
        conditions.append("pseudonyme = ?")
        valeurs.append(pseudonyme)
    if types:
        conditions.append(f"type IN ({', '.join('?' for _ in types)})")
        valeurs.extend(types)
    if conditions:
        requete += " WHERE " + " AND ".join(conditions)
    with _verrou:
        connexion = ouvrir()
        lignes = connexion.execute(requete + " ORDER BY numero", valeurs).fetchall()
        connexion.close()
    cles = ("numero", "pseudonyme", "type", "donnees", "heure_navigateur", "heure_serveur")
    evenements = [dict(zip(cles, ligne)) for ligne in lignes]
    for evenement in evenements:
        evenement["donnees"] = json.loads(evenement["donnees"])
    return evenements
