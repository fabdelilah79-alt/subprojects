"""
Rôle : vérifier la main levée : question notée, réponse de l'agent répondeur (faux client) ou message sans clé.
Reçoit : l'application et le faux client Claude.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from fastapi.testclient import TestClient

from serveur.agents import appel_ia
from serveur.donnees import journal_recherche
from serveur.main import app
from serveur.tests.faux_claude import REPONDEUR, FauxClaude

client = TestClient(app)


def question(pseudo, texte="C'est quoi oméga ?"):
    """Pose une question de la main levée et renvoie la réponse du serveur."""
    corps = {"pseudonyme": pseudo, "question": texte, "partie": 2, "deja_au_tableau": ["Bonjour."]}
    return client.post("/api/questions", json=corps)


def nouvel_eleve():
    """Inscrit un élève de test et renvoie son pseudonyme."""
    return client.post("/api/eleve", json={"nom": "Test", "classe": "Classe 1", "cours": "rotation"}).json()["pseudonyme"]


def test_sans_cle_message_et_journal(monkeypatch):
    """Sans clé : le message prévu est dit (avec un audio), la question et la réponse sont journalisées."""
    monkeypatch.setattr("serveur.routes.questions.cle_presente", lambda nom: False)
    pseudo = nouvel_eleve()
    reponse = question(pseudo).json()
    assert "Je note votre question" in reponse["reponse_orale"] and reponse["audio"].endswith(".wav")
    types = [e["type"] for e in journal_recherche.lire(pseudo)]
    assert types[-2:] == ["question_posee", "reponse_donnee"]


def test_avec_agent_repondeur(monkeypatch):
    """Avec clé (faux client) : la réponse de l'agent répondeur est renvoyée telle quelle."""
    monkeypatch.setattr("serveur.routes.questions.cle_presente", lambda nom: True)
    faux = FauxClaude()
    appel_ia.definir_client(faux)
    try:
        reponse = question(nouvel_eleve()).json()
    finally:
        appel_ia.definir_client(None)
    assert reponse["reponse_orale"] == REPONDEUR["reponse_orale"] and faux.appels == ["repondeur"]
    assert "C'est quoi oméga ?" in faux.requetes[0]["messages"][0]["content"]


def test_question_vide_ou_eleve_inconnu():
    """Une question vide est refusée ; un pseudonyme inconnu aussi."""
    assert question(nouvel_eleve(), "   ").status_code == 422
    assert question("E999").status_code == 404
