"""
Rôle : vérifier que le serveur sert la page d'accueil et la route /api/accueil.
Reçoit : l'application de serveur/main.py.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from fastapi.testclient import TestClient

from serveur.configuration import lire_config
from serveur.main import app

client = TestClient(app)


def test_page_accueil_servie():
    """La page d'accueil s'affiche, avec son titre et son bouton."""
    reponse = client.get("/")
    assert reponse.status_code == 200
    assert "Avant de commencer" in reponse.text
    assert "Commencer" in reponse.text


def test_options_accueil_lues_dans_la_config():
    """La route /api/accueil renvoie les cours et les classes de config/application.json."""
    reglages = lire_config("application")
    reponse = client.get("/api/accueil")
    assert reponse.status_code == 200
    assert reponse.json()["cours"] == reglages["cours"]
    assert reponse.json()["classes"] == reglages["classes"]


def test_evenement_recu():
    """Un événement envoyé par le navigateur est accepté ; un événement incomplet est refusé."""
    corps = {"type": "prediction", "donnees": {"choix": "B"}, "horodatage": "2026-10-02T10:00:00Z"}
    assert client.post("/api/evenements", json=corps).json() == {"recu": True}
    assert client.post("/api/evenements", json={"type": "prediction"}).status_code == 422
