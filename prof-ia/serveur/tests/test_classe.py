"""
Rôle : vérifier la file d'attente des parties, les routes de la classe et le journal de recherche.
Reçoit : l'application, les parties validées de sorties/valide/ et le faux client Claude.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from fastapi.testclient import TestClient

from serveur.agents import appel_ia
from serveur.donnees import journal_recherche
from serveur.main import app
from serveur.pipeline import donnees_eleve, file_attente
from serveur.tests.faux_claude import FauxClaude

client = TestClient(app)
REPONSE = {"question": "q4", "choix": "A", "certitude": "certain", "justification": "plus loin", "temps_s": 5}


def inscrire_et_repondre():
    """Inscrit un élève et envoie une réponse au QCM ; renvoie son pseudonyme."""
    pseudo = client.post("/api/eleve", json={"nom": "Élève Test", "classe": "Classe 1", "cours": "rotation"}).json()["pseudonyme"]
    client.post("/api/qcm/reponses", json={"pseudonyme": pseudo, "reponses": [REPONSE]})
    return pseudo


def test_mode_fige_toutes_les_parties_pretes():
    """En mode figé, les trois parties validées sont prêtes dès la fin du QCM, et chaque envoi est journalisé."""
    pseudo = inscrire_et_repondre()
    etats = client.get(f"/api/eleve/{pseudo}/etat").json()
    assert [p["etat"] for p in etats["parties"]] == ["prete", "prete", "prete"]
    partition = client.get(f"/api/eleve/{pseudo}/parties/2").json()
    assert partition["numero"] == 2 and partition["generation"]["source"] == "brouillon"
    servies = journal_recherche.lire(pseudo, ["partie_servie"])
    assert servies[0]["donnees"]["partie"] == 2 and len(servies[0]["donnees"]["empreinte"]) == 16
    assert journal_recherche.lire(pseudo, ["qcm_pre"])[0]["donnees"]["conception"] == "omega_depend_de_la_distance_a_l_axe"


def test_partie_pas_prete_et_eleve_inconnu():
    """Une partie non préparée répond 409 ; un pseudonyme inconnu répond 404."""
    pseudo = client.post("/api/eleve", json={"nom": "X", "classe": "Classe 1", "cours": "rotation"}).json()["pseudonyme"]
    assert client.get(f"/api/eleve/{pseudo}/parties/1").status_code == 409
    assert client.get("/api/eleve/E999/etat").status_code == 404


def test_adaptatif_sans_cle_repli(monkeypatch):
    """Mode adaptatif sans clé : l'élève reçoit la partie de l'enseignant, avec un message clair."""
    monkeypatch.setattr(file_attente, "lire_config", lambda nom: {"mode": "adaptatif", "cours": [{"parties": 3}]})
    monkeypatch.setattr(file_attente, "cle_presente", lambda nom: False)
    pseudo = inscrire_et_repondre()
    etat = client.get(f"/api/eleve/{pseudo}/etat").json()["parties"][0]
    assert etat["etat"] == "prete" and "ANTHROPIC_API_KEY" in etat["message"]


def test_adaptatif_avec_agents(monkeypatch):
    """Mode adaptatif avec clé (faux client) : les parties sont produites par les agents, bilan à côté."""
    monkeypatch.setattr(file_attente, "lire_config", lambda nom: {"mode": "adaptatif", "cours": [{"parties": 2}]})
    monkeypatch.setattr(file_attente, "cle_presente", lambda nom: True)
    appel_ia.definir_client(FauxClaude())
    try:
        pseudo = inscrire_et_repondre()
    finally:
        appel_ia.definir_client(None)
    partition = client.get(f"/api/eleve/{pseudo}/parties/1").json()
    assert partition["generation"]["source"] == "agents"
    assert len(journal_recherche.lire(pseudo, ["generation"])) == 2


def test_evenements_et_historique():
    """Les événements vont dans le journal ; l'agent pédagogique retrouve les prédictions de l'élève, sans son nom."""
    pseudo = inscrire_et_repondre()
    corps = {"pseudonyme": pseudo, "type": "prediction", "donnees": {"choix": "B"}, "horodatage": "2026-10-11T10:00:00Z"}
    assert client.post("/api/evenements", json=corps).json() == {"recu": True}
    donnees = donnees_eleve.preparer(2, pseudo)
    assert donnees["historique"] == [{"type": "prediction", "choix": "B"}]
    assert donnees["qcm_de_la_partie"][0]["reponse_eleve"]["choix"] == "A"
    assert donnees["resume_precedent"]["titre"].startswith("Rotation ou translation")
    assert "Élève Test" not in str(donnees)
