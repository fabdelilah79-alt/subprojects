"""
Rôle : vérifier le QCM, le pseudonyme et le profil : de l'accueil jusqu'au profil de l'élève.
Reçoit : l'application, contenu/qcm/qcm.json et son schéma.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import json

from fastapi.testclient import TestClient

from outils.valider_partition import erreurs_schema
from serveur.configuration import chemin_projet
from serveur.donnees import stockage
from serveur.eleve.profil import calculer_profil
from serveur.eleve import pseudonymes
from serveur.main import app

client = TestClient(app)
QCM = chemin_projet("contenu") / "qcm" / "qcm.json"


def test_qcm_conforme_au_schema():
    """Le QCM respecte son schéma, et chaque conception citée est décrite."""
    qcm = json.loads(QCM.read_text(encoding="utf-8"))
    assert erreurs_schema(qcm, chemin_projet("schemas") / "qcm.schema.json") == []
    citees = {c["conception"] for q in qcm["questions"] for c in q["choix"] if "conception" in c}
    assert citees <= set(qcm["conceptions"])


def test_qcm_public_sans_reponses():
    """Le navigateur ne reçoit ni les bonnes réponses ni les conceptions."""
    texte = client.get("/api/qcm").text
    assert '"correct"' not in texte and "conception" not in texte


def test_parcours_accueil_qcm_profil():
    """Accueil -> pseudonyme -> réponses -> profil ; le vrai nom n'apparaît que dans la correspondance."""
    pseudo = client.post("/api/eleve", json={"nom": "Nom Test", "classe": "Classe 1", "cours": "rotation"}).json()["pseudonyme"]
    assert pseudo == "E001"
    reponses = [{"question": "q1", "choix": "A", "certitude": "certain", "justification": "cercle", "temps_s": 9.5},
                {"question": "q4", "choix": "B", "certitude": "devine", "justification": "", "temps_s": 4}]
    assert client.post("/api/qcm/reponses", json={"pseudonyme": pseudo, "reponses": reponses}).json() == {"enregistre": True}
    dossier = stockage.dossier_eleve(pseudo)
    contenu = " ".join(f.read_text(encoding="utf-8") for f in dossier.iterdir())
    assert "Nom Test" not in contenu
    assert "Nom Test" in pseudonymes.fichier_correspondance().read_text(encoding="utf-8")
    profil = json.loads((dossier / "profil.json").read_text(encoding="utf-8"))
    assert profil["conceptions"][0]["id"] == "trajectoire_circulaire_egale_rotation"
    assert profil["conceptions"][0]["solidite"] == "ancree"


def test_pseudonyme_dangereux_refuse():
    """Un pseudonyme qui n'a pas la forme E001 est refusé (rien ne sort du dossier des élèves)."""
    corps = {"pseudonyme": "../config", "reponses": []}
    assert client.post("/api/qcm/reponses", json=corps).status_code == 404


def test_profil_par_partie():
    """Les réussites sont comptées par partie ; une bonne réponse ne crée pas de conception."""
    qcm = json.loads(QCM.read_text(encoding="utf-8"))
    reponses = [{"question": "q1", "choix": "B", "certitude": "certain"},
                {"question": "q9", "choix": "A", "certitude": "assez_sur"}]
    profil = calculer_profil(qcm, reponses)
    assert profil["par_partie"] == {"1": {"reussies": 1, "total": 1}, "3": {"reussies": 0, "total": 1}}
    assert [c["id"] for c in profil["conceptions"]] == ["tours_par_minute_egal_hertz"]
