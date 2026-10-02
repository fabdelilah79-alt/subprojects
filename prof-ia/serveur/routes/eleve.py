"""
Rôle : routes de l'accueil de l'élève.
Reçoit : les demandes sur /api/accueil, l'inscription (/api/eleve) et les événements (/api/evenements).
Produit : les cours et les classes ; un pseudonyme pour chaque élève (le nom ne quitte pas le serveur) ;
          les événements, affichés dans le terminal
          (ils seront enregistrés dans le journal de recherche à l'étape 11).
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
import logging
from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from serveur.configuration import lire_config
from serveur.donnees.stockage import ecrire
from serveur.eleve.pseudonymes import attribuer

routeur = APIRouter(prefix="/api")
journal = logging.getLogger("uvicorn.error")


class Inscription(BaseModel):
    """Ce que l'élève saisit à l'accueil."""

    nom: str
    classe: str
    cours: str


class Evenement(BaseModel):
    """Un événement de l'élève : son pseudonyme (s'il est connu), son type, ses données, l'heure du navigateur."""

    pseudonyme: str | None = None
    type: str
    donnees: dict
    horodatage: str


@routeur.get("/accueil")
def options_accueil():
    """Renvoie la liste des cours et la liste des classes de la page d'accueil."""
    reglages = lire_config("application")
    return {"cours": reglages["cours"], "classes": reglages["classes"], "attente_simulee_s": reglages["attente_simulee_s"]}


@routeur.post("/evenements")
def recevoir_evenement(evenement: Evenement):
    """Reçoit un événement et l'affiche dans le terminal du serveur."""
    journal.info("Événement %s (%s) : %s", evenement.type, evenement.pseudonyme, evenement.donnees)
    return {"recu": True}


@routeur.post("/eleve")
def inscrire(inscription: Inscription):
    """Remplace le nom par un pseudonyme et ouvre le dossier de l'élève (sans son nom)."""
    pseudonyme = attribuer(inscription.nom, inscription.classe)
    fiche = {"pseudonyme": pseudonyme, "classe": inscription.classe, "cours": inscription.cours,
             "debut": datetime.now().isoformat(timespec="seconds")}
    ecrire(pseudonyme, "eleve", fiche, creer=True)
    return {"pseudonyme": pseudonyme}
