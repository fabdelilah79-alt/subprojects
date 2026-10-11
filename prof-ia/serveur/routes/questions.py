"""
Rôle : route de la main levée : l'élève pose une question, le professeur répond à voix haute et au brouillon.
Reçoit : le pseudonyme, la question, le numéro de la partie et ce qui a déjà été dit au tableau.
Produit : la réponse orale (texte et audio), l'écrit du brouillon, et deux lignes dans le journal de recherche
          (question_posee, reponse_donnee). Sans clé ANTHROPIC_API_KEY : un message d'attente, toujours dit à voix haute.
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js (interaction/main_levee.js).
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from serveur.agents import repondeur
from serveur.agents.appel_ia import ErreurIA
from serveur.cles import cle_presente
from serveur.configuration import lire_config
from serveur.donnees import journal_recherche
from serveur.donnees.stockage import PseudonymeInconnu, dossier_eleve
from serveur.voix.synthese import ErreurVoix, synthetiser

routeur = APIRouter(prefix="/api")


class Question(BaseModel):
    """Une question de la main levée et son contexte (pas le nom de l'élève)."""

    pseudonyme: str
    question: str
    partie: int
    deja_au_tableau: list[str] = []


def reponse_du_professeur(corps, reglages):
    """Demande la réponse à l'agent répondeur ; sans clé ou en cas d'échec, renvoie le message prévu."""
    if not cle_presente("ANTHROPIC_API_KEY"):
        return {"reponse_orale": reglages["message_sans_cle"], "ecrit_brouillon": "", "hors_programme": False}, "sans_cle", 0
    deja = corps.deja_au_tableau[-reglages["beats_deja_dits_max"]:]
    try:
        reponse, compte = repondeur.repondre(corps.question, corps.partie, deja)
    except ErreurIA as erreur:
        journal_recherche.ajouter(corps.pseudonyme, "repondeur_erreur", {"partie": corps.partie, "erreur": str(erreur)})
        return {"reponse_orale": reglages["message_erreur"], "ecrit_brouillon": "", "hors_programme": False}, "erreur", 0
    return reponse, "agent", compte["cout"]


@routeur.post("/questions")
def poser_question(corps: Question):
    """Note la question, obtient la réponse, la fait dire par la voix du professeur et la renvoie."""
    reglages = lire_config("application")["main_levee"]
    try:
        dossier_eleve(corps.pseudonyme)
    except PseudonymeInconnu as erreur:
        raise HTTPException(status_code=404, detail=str(erreur)) from erreur
    question = corps.question.strip()[:reglages["longueur_max_question"]]
    if not question:
        raise HTTPException(status_code=422, detail="Question vide")
    corps.question = question
    journal_recherche.ajouter(corps.pseudonyme, "question_posee", {"partie": corps.partie, "question": question})
    reponse, source, cout = reponse_du_professeur(corps, reglages)
    try:
        son = synthetiser(reponse["reponse_orale"], reglages["ton_reponse"], usage="repondeur")
    except ErreurVoix:
        son = {"audio": None, "duree_s": None}
    journal_recherche.ajouter(corps.pseudonyme, "reponse_donnee", {
        "partie": corps.partie, "question": question, **reponse, "source": source, "cout": cout})
    return {**reponse, "audio": son["audio"], "duree_s": son["duree_s"]}
