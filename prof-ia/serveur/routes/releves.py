"""
Rôle : routes des relevés de laboratoire d'un élève : la liste de ses relevés et la figure d'un relevé.
Reçoit : le pseudonyme de l'élève et l'identifiant de la ressource (mission de laboratoire du manifeste).
Produit : /api/eleve/<pseudonyme>/releves (relevés sans figure) et
          /api/eleve/<pseudonyme>/releves/<ressource>/figure.svg (la figure nettoyée, à montrer au tableau).
Utilisé par : serveur/main.py ; appelé plus tard par la page de classe (figure de l'élève au tableau).
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from serveur.eleve import releves
from serveur.routes.classe import verifier_eleve

routeur = APIRouter(prefix="/api/eleve")


@routeur.get("/{pseudonyme}/releves")
def liste_des_releves(pseudonyme: str):
    """Renvoie les relevés de l'élève, du plus ancien au plus récent (sans les figures)."""
    verifier_eleve(pseudonyme)
    return {"releves": releves.tous(pseudonyme)}


@routeur.get("/{pseudonyme}/releves/{ressource}/figure.svg")
def figure_du_releve(pseudonyme: str, ressource: str):
    """Renvoie la figure de l'élève pour cette ressource, ou 404."""
    verifier_eleve(pseudonyme)
    figure = releves.figure(pseudonyme, ressource)
    if figure is None:
        raise HTTPException(status_code=404, detail="Pas de figure pour cette ressource.")
    return Response(figure, media_type="image/svg+xml", headers={"Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'"})
