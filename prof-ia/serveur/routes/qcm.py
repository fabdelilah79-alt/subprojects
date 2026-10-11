"""
Rôle : routes du QCM diagnostique (avant le cours) et du post-test (après le cours).
Reçoit : la demande d'un questionnaire (/api/qcm?test=pre ou post) et les réponses d'un élève (/api/qcm/reponses).
Produit : le questionnaire SANS les bonnes réponses ni les conceptions (elles restent sur le serveur) ;
          à la réception : réponses et profil dans le dossier de l'élève (profil_post pour le post-test),
          une ligne par réponse dans le journal de recherche, et le lancement de la préparation de la partie 1.
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from serveur.configuration import chemin_projet
from serveur.donnees import journal_recherche
from serveur.donnees.stockage import PseudonymeInconnu, ecrire
from serveur.eleve.profil import calculer_profil
from serveur.pipeline import file_attente

routeur = APIRouter(prefix="/api")
FICHIERS = {"pre": "qcm", "post": "qcm_post"}


class ReponsesQcm(BaseModel):
    """Réponses d'un élève : pseudonyme, test (pre ou post), partiel (seulement les premières questions), réponses."""

    pseudonyme: str
    reponses: list[dict]
    test: str = "pre"
    partiel: bool = False


def lire_qcm(test="pre"):
    """Lit le questionnaire demandé (contenu/qcm/qcm.json ou qcm_post.json), avec les bonnes réponses."""
    if test not in FICHIERS:
        raise HTTPException(status_code=404, detail=f"Test inconnu : {test}")
    chemin = chemin_projet("contenu") / "qcm" / f"{FICHIERS[test]}.json"
    return json.loads(chemin.read_text(encoding="utf-8"))


@routeur.get("/qcm")
def qcm_public(test: str = "pre"):
    """Renvoie le questionnaire à afficher : énoncés et choix, sans « correct » ni « conception »."""
    qcm = lire_qcm(test)
    questions = [
        {**question, "choix": [{"id": c["id"], "texte": c["texte"]} for c in question["choix"]]}
        for question in qcm["questions"]
    ]
    certitudes = [{"id": c["id"], "texte": c["texte"]} for c in qcm["certitudes"]]
    return {"titre": qcm["titre"], "consigne": qcm["consigne"], "certitudes": certitudes, "questions": questions}


def journaliser(corps, qcm):
    """Écrit chaque réponse dans le journal de recherche (une ligne par question, avec sa justesse)."""
    questions = {q["id"]: q for q in qcm["questions"]}
    for reponse in corps.reponses:
        choix = next(c for c in questions[reponse["question"]]["choix"] if c["id"] == reponse["choix"])
        journal_recherche.ajouter(corps.pseudonyme, f"qcm_{corps.test}", {
            **reponse, "correct": choix.get("correct", False), "conception": choix.get("conception")})


@routeur.post("/qcm/reponses")
def recevoir_reponses(corps: ReponsesQcm):
    """Enregistre les réponses et le profil (sans IA) ; au pré-test, lance la préparation de la partie 1."""
    suffixe = "" if corps.test == "pre" else f"_{corps.test}"
    try:
        qcm = lire_qcm(corps.test)
        profil = calculer_profil(qcm, corps.reponses)
        ecrire(corps.pseudonyme, f"reponses_qcm{suffixe}", corps.reponses)
        ecrire(corps.pseudonyme, f"profil{suffixe}", {"pseudonyme": corps.pseudonyme, "partiel": corps.partiel, **profil})
        if not corps.partiel:
            journaliser(corps, qcm)
        if corps.test == "pre":
            file_attente.demander(corps.pseudonyme, 1)
    except PseudonymeInconnu as erreur:
        raise HTTPException(status_code=404, detail=str(erreur)) from erreur
    except (KeyError, StopIteration) as erreur:
        raise HTTPException(status_code=422, detail=f"Réponse incomplète ou inconnue : {erreur}") from erreur
    return {"enregistre": True}
