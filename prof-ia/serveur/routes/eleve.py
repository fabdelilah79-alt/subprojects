"""
Rôle : routes de l'accueil de l'élève.
Reçoit : les demandes du navigateur sur /api/accueil et les événements envoyés à /api/evenements.
Produit : les cours et les classes à proposer ; les événements sont affichés dans le terminal
          (ils seront enregistrés dans le journal de recherche à l'étape 11).
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
import logging

from fastapi import APIRouter
from pydantic import BaseModel

from serveur.configuration import lire_config

routeur = APIRouter(prefix="/api")
journal = logging.getLogger("uvicorn.error")


class Evenement(BaseModel):
    """Un événement de l'élève : son type, ses données et l'heure du navigateur."""

    type: str
    donnees: dict
    horodatage: str


@routeur.get("/accueil")
def options_accueil():
    """Renvoie la liste des cours et la liste des classes de la page d'accueil."""
    reglages = lire_config("application")
    return {"cours": reglages["cours"], "classes": reglages["classes"]}


@routeur.post("/evenements")
def recevoir_evenement(evenement: Evenement):
    """Reçoit un événement et l'affiche dans le terminal du serveur."""
    journal.info("Événement %s : %s", evenement.type, evenement.donnees)
    return {"recu": True}
