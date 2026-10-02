"""
Rôle : routes de l'accueil de l'élève.
Reçoit : les demandes du navigateur sur /api/accueil.
Produit : les cours et les classes à proposer, lus dans config/application.json.
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
from fastapi import APIRouter

from serveur.configuration import lire_config

routeur = APIRouter(prefix="/api")


@routeur.get("/accueil")
def options_accueil():
    """Renvoie la liste des cours et la liste des classes de la page d'accueil."""
    reglages = lire_config("application")
    return {"cours": reglages["cours"], "classes": reglages["classes"]}
