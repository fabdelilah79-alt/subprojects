"""
Rôle : routes de la classe : état de préparation des parties d'un élève et partition à jouer.
Reçoit : le pseudonyme de l'élève et le numéro de la partie.
Produit : l'état de chaque partie (en_attente, en_cours, prete, erreur) ; la partition de l'élève quand elle est prête,
          avec un événement « partie_servie » (empreinte du fichier) dans le journal de recherche.
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js (pages d'attente et de classe).
"""
import hashlib
import json

from fastapi import APIRouter, HTTPException

from serveur.donnees import journal_recherche
from serveur.donnees.stockage import PseudonymeInconnu, dossier_eleve
from serveur.pipeline import file_attente

routeur = APIRouter(prefix="/api/eleve")


def verifier_eleve(pseudonyme):
    """Renvoie le dossier de l'élève, ou une erreur 404 si le pseudonyme est inconnu."""
    try:
        return dossier_eleve(pseudonyme)
    except PseudonymeInconnu as erreur:
        raise HTTPException(status_code=404, detail=str(erreur)) from erreur


@routeur.get("/{pseudonyme}/etat")
def etat_des_parties(pseudonyme: str):
    """Renvoie l'état de préparation de chaque partie du cours pour cet élève."""
    verifier_eleve(pseudonyme)
    nombre = file_attente.nombre_de_parties()
    return {"nombre": nombre, "parties": [file_attente.etat(pseudonyme, n) for n in range(1, nombre + 1)]}


@routeur.post("/{pseudonyme}/parties/{numero}/demander")
def demander_partie(pseudonyme: str, numero: int):
    """Demande la préparation d'une partie (sans effet si elle est déjà demandée)."""
    verifier_eleve(pseudonyme)
    if not 1 <= numero <= file_attente.nombre_de_parties():
        raise HTTPException(status_code=404, detail=f"Partie {numero} inexistante")
    file_attente.demander(pseudonyme, numero)
    return file_attente.etat(pseudonyme, numero)


@routeur.get("/{pseudonyme}/parties/{numero}")
def partie_de_l_eleve(pseudonyme: str, numero: int):
    """Renvoie la partition préparée pour l'élève et note dans le journal laquelle a été servie."""
    chemin = verifier_eleve(pseudonyme) / f"partie_{numero}.json"
    if not chemin.exists():
        raise HTTPException(status_code=409, detail=f"Partie {numero} pas encore prête")
    contenu = chemin.read_bytes()
    partition = json.loads(contenu)
    journal_recherche.ajouter(pseudonyme, "partie_servie", {
        "partie": numero, "source": partition["generation"]["source"],
        "empreinte": hashlib.sha256(contenu).hexdigest()[:16]})
    return partition
