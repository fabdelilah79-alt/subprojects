"""
Rôle : routes du QCM diagnostique.
Reçoit : la demande du questionnaire (/api/qcm) et les réponses d'un élève (/api/qcm/reponses).
Produit : le QCM SANS les bonnes réponses ni les conceptions (elles restent sur le serveur) ;
          à la réception des réponses : reponses_qcm.json et profil.json dans le dossier de l'élève.
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from serveur.configuration import chemin_projet
from serveur.donnees.stockage import PseudonymeInconnu, ecrire
from serveur.eleve.profil import calculer_profil

routeur = APIRouter(prefix="/api")


class ReponsesQcm(BaseModel):
    """Les réponses d'un élève : son pseudonyme et, pour chaque question, choix, justification, certitude, temps."""

    pseudonyme: str
    reponses: list[dict]


def lire_qcm():
    """Lit contenu/qcm/qcm.json, avec les bonnes réponses."""
    chemin = chemin_projet("contenu") / "qcm" / "qcm.json"
    return json.loads(chemin.read_text(encoding="utf-8"))


@routeur.get("/qcm")
def qcm_public():
    """Renvoie le QCM à afficher : énoncés et choix, sans « correct » ni « conception »."""
    qcm = lire_qcm()
    questions = [
        {**question, "choix": [{"id": c["id"], "texte": c["texte"]} for c in question["choix"]]}
        for question in qcm["questions"]
    ]
    certitudes = [{"id": c["id"], "texte": c["texte"]} for c in qcm["certitudes"]]
    return {"titre": qcm["titre"], "consigne": qcm["consigne"], "certitudes": certitudes, "questions": questions}


@routeur.post("/qcm/reponses")
def recevoir_reponses(corps: ReponsesQcm):
    """Enregistre les réponses, calcule le profil (sans IA) et l'enregistre dans le dossier de l'élève."""
    try:
        ecrire(corps.pseudonyme, "reponses_qcm", corps.reponses)
        profil = calculer_profil(lire_qcm(), corps.reponses)
        ecrire(corps.pseudonyme, "profil", {"pseudonyme": corps.pseudonyme, **profil})
    except PseudonymeInconnu as erreur:
        raise HTTPException(status_code=404, detail=str(erreur)) from erreur
    except (KeyError, StopIteration) as erreur:
        raise HTTPException(status_code=422, detail=f"Réponse incomplète ou inconnue : {erreur}") from erreur
    return {"enregistre": True}
