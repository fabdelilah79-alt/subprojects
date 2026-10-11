"""
Rôle : routes de l'accueil de l'élève.
Reçoit : les demandes sur /api/accueil, l'inscription (/api/eleve) et les événements (/api/evenements).
Produit : les cours et les classes ; un pseudonyme pour chaque élève (le nom ne quitte pas le serveur) ;
          les événements, enregistrés dans le journal de recherche (sorties/journaux/journal.sqlite).
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from serveur.configuration import lire_config
from serveur.donnees import journal_recherche
from serveur.donnees.stockage import ecrire, forme_valide
from serveur.eleve.pseudonymes import attribuer

routeur = APIRouter(prefix="/api")


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
    """Renvoie les cours, les classes et l'intervalle de suivi de la préparation (pages d'attente et de classe)."""
    reglages = lire_config("application")
    return {"cours": reglages["cours"], "classes": reglages["classes"],
            "intervalle_suivi_s": reglages["generation"]["intervalle_suivi_s"]}


@routeur.post("/evenements")
def recevoir_evenement(evenement: Evenement):
    """Reçoit un événement et l'enregistre dans le journal de recherche (sous le pseudonyme seulement)."""
    pseudonyme = evenement.pseudonyme if forme_valide(evenement.pseudonyme) else None
    journal_recherche.ajouter(pseudonyme, evenement.type, evenement.donnees, evenement.horodatage)
    return {"recu": True}


@routeur.post("/eleve")
def inscrire(inscription: Inscription):
    """Remplace le nom par un pseudonyme et ouvre le dossier de l'élève (sans son nom)."""
    pseudonyme = attribuer(inscription.nom, inscription.classe)
    fiche = {"pseudonyme": pseudonyme, "classe": inscription.classe, "cours": inscription.cours,
             "debut": datetime.now().isoformat(timespec="seconds")}
    ecrire(pseudonyme, "eleve", fiche, creer=True)
    journal_recherche.ajouter(pseudonyme, "inscription", {"classe": inscription.classe, "cours": inscription.cours})
    return {"pseudonyme": pseudonyme}
