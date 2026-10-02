"""
Rôle : routes qui donnent au navigateur de quoi jouer une partie au tableau.
Reçoit : les demandes sur /api/tableau et /api/parties/<numéro>.
Produit : les réglages du tableau (config/tableau.json) et la partition demandée.
Utilisé par : serveur/main.py ; appelé depuis client/js/api.js.
"""
import json

from fastapi import APIRouter, HTTPException

from serveur.configuration import chemin_projet, lire_config

routeur = APIRouter(prefix="/api")


@routeur.get("/tableau")
def reglages_tableau():
    """Renvoie les réglages du tableau : dimensions, zones, couleurs, police, vitesse d'écriture."""
    return lire_config("tableau")


@routeur.get("/parties/{numero}")
def partie_validee(numero: int):
    """Renvoie la partition validée d'une partie, ou une erreur 404 si elle n'existe pas."""
    chemin = chemin_projet("parties_validees") / f"partie_{numero}.json"
    if not chemin.exists():
        raise HTTPException(status_code=404, detail=f"Partie {numero} introuvable dans sorties/valide/")
    return json.loads(chemin.read_text(encoding="utf-8"))
