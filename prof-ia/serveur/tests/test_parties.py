"""
Rôle : vérifier les routes /api/tableau, /api/manifeste, /api/parties/<numéro> et /ressources.
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


def test_manifeste_et_simulation_servis():
    """Le manifeste est servi, et la simulation de la grande roue est accessible."""
    ressources = client.get("/api/manifeste").json()["ressources"]
    roue = next(r for r in ressources if r["id"] == "grande_roue")
    reponse = client.get(f"/ressources/{roue['fichier']}")
    assert reponse.status_code == 200
    assert "Grande roue" in reponse.text
