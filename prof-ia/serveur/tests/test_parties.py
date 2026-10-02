"""
Rôle : vérifier les routes /api/tableau et /api/parties/<numéro>.
Reçoit : l'application de serveur/main.py.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from fastapi.testclient import TestClient

from serveur.main import app

client = TestClient(app)


def test_reglages_du_tableau():
    """Les réglages du tableau arrivent avec leurs zones et leur palette."""
    reponse = client.get("/api/tableau")
    assert reponse.status_code == 200
    assert {"zones", "palette", "police"} <= set(reponse.json())


def test_partie_1_servie():
    """La partition validée de la partie 1 est servie."""
    reponse = client.get("/api/parties/1")
    assert reponse.status_code == 200
    assert reponse.json()["numero"] == 1


def test_partie_absente():
    """Une partie qui n'existe pas donne une erreur 404 claire."""
    reponse = client.get("/api/parties/99")
    assert reponse.status_code == 404
    assert "Partie 99 introuvable" in reponse.json()["detail"]
