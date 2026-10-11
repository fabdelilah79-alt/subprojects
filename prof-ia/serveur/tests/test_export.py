"""
Rôle : vérifier l'export des données de recherche : fichiers CSV complets, et jamais de nom d'élève.
Reçoit : l'application (pour créer un élève de test) et outils/exporter_donnees.py.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from fastapi.testclient import TestClient

from outils import exporter_donnees
from serveur.main import app

client = TestClient(app)


def test_export_sans_nom():
    """Un parcours pré/post donne eleves, qcm, profils et événements en CSV ; le nom n'apparaît nulle part."""
    pseudo = client.post("/api/eleve", json={"nom": "Nom Secret", "classe": "Classe 1", "cours": "rotation"}).json()["pseudonyme"]
    reponse = {"question": "q9", "choix": "A", "certitude": "certain", "justification": "300", "temps_s": 3}
    for test in ("pre", "post"):
        client.post("/api/qcm/reponses", json={"pseudonyme": pseudo, "reponses": [reponse], "test": test})
    client.post("/api/evenements", json={"pseudonyme": pseudo, "type": "retour_onglet", "donnees": {"onglet": 1},
                                         "horodatage": "2026-10-11T10:00:00Z"})
    assert exporter_donnees.principal() == 0
    dossier = exporter_donnees.chemin_projet("exports")
    noms = {f.name for f in dossier.iterdir()}
    assert {"eleves.csv", "qcm.csv", "profils.csv", "conceptions.csv", "evenements_retour_onglet.csv"} <= noms
    qcm = (dossier / "qcm.csv").read_text(encoding="utf-8-sig").splitlines()
    assert len(qcm) == 3 and qcm[1].startswith(f"{pseudo};pre;q9;A;False;tours_par_minute_egal_hertz")
    assert all("Nom Secret" not in f.read_text(encoding="utf-8-sig") for f in dossier.iterdir())
