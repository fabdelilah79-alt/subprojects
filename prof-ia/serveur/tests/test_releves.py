"""
Rôle : vérifier le rangement des relevés de laboratoire (mode cours) : réception par /api/evenements, figure nettoyée,
       lecture par les routes, version courte pour les agents, refus des données dangereuses ou trop grandes.
Reçoit : l'application et un relevé d'essai (comme celui qu'envoie commun/releve.js).
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
from fastapi.testclient import TestClient

from serveur.donnees import journal_recherche
from serveur.eleve import releves
from serveur.main import app

client = TestClient(app)
FIGURE = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 290" onload="alert(1)">'
          '<script>alert(2)</script><path d="M1 1h12" style="stroke:rgb(179, 38, 30);fill:url(#x);stroke-width:2px"/>'
          '<a href="javascript:alert(3)"><text x="5" y="9">piège</text></a><text x="10" y="20">t (s)</text></svg>')


def releve(**autres):
    """Un relevé d'essai : mission de rotation, deux lignes de tableau, une courbe et sa figure."""
    return {"ressource": "b1_meca1_a2_enregistrement", "laboratoire": "b1_meca1_a2_enregistrement", "type": "releve",
            "mission": "rotation", "titre": "Enregistrer et exploiter une rotation", "faits": {"enregistrement": {"tau_s": 0.04}},
            "tableau": {"entetes": {"A": "t (s)", "B": "θ (rad)"}, "lignes": [{"ligne": 2, "A": 0, "B": 0}, {"ligne": 3, "A": 0.08, "B": 0.3}],
                        "formules": {"C2": "=60*B2"}},
            "courbe": {"abscisse": "t (s)", "ordonnee": "θ (rad)", "points": [[0, 0], [0.08, 0.3]], "modele": "aucun"},
            "figure": FIGURE, **autres}


def inscrire():
    """Inscrit un élève d'essai ; renvoie son pseudonyme."""
    return client.post("/api/eleve", json={"nom": "Élève Test", "classe": "Classe 1", "cours": "rotation"}).json()["pseudonyme"]


def envoyer(pseudo, donnees):
    """Envoie le relevé comme le fait la page de classe."""
    corps = {"pseudonyme": pseudo, "type": "laboratoire_releve", "donnees": donnees, "horodatage": "2026-11-13T10:00:00Z"}
    return client.post("/api/evenements", json=corps)


def test_releve_range_et_relu():
    """Le relevé est rangé dans le dossier de l'élève, relu par la route ; le journal en garde une copie sans la figure."""
    pseudo = inscrire()
    assert envoyer(pseudo, releve()).json() == {"recu": True}
    liste = client.get(f"/api/eleve/{pseudo}/releves").json()["releves"]
    assert liste[0]["tableau"]["formules"] == {"C2": "=60*B2"} and liste[0]["figure"] is True
    copie = journal_recherche.lire(pseudo, ["laboratoire_releve"])[0]["donnees"]
    assert copie["figure"] is True and "<svg" not in str(copie)


def test_figure_nettoyee():
    """La figure ne garde que formes, textes et styles simples : ni script, ni événement, ni lien, ni url()."""
    pseudo = inscrire()
    envoyer(pseudo, releve())
    reponse = client.get(f"/api/eleve/{pseudo}/releves/b1_meca1_a2_enregistrement/figure.svg")
    svg = reponse.text
    assert reponse.headers["content-type"].startswith("image/svg+xml")
    assert "script" not in svg and "onload" not in svg and "javascript" not in svg and "url(" not in svg
    assert "t (s)" in svg and "stroke:rgb(179, 38, 30)" in svg and "piège" not in svg


def test_refus():
    """Ressource au nom dangereux, figure avec entités, élève inconnu : rien n'est rangé, rien ne casse."""
    pseudo = inscrire()
    envoyer(pseudo, releve(ressource="../../profil"))
    assert client.get(f"/api/eleve/{pseudo}/releves").json()["releves"] == []
    assert releves.nettoyer_svg('<!DOCTYPE svg [<!ENTITY a "b">]><svg xmlns="http://www.w3.org/2000/svg"/>') is None
    assert client.get(f"/api/eleve/{pseudo}/releves/autre/figure.svg").status_code == 404
    assert client.get("/api/eleve/E999/releves").status_code == 404


def test_pour_agents():
    """La version pour les agents garde mesures, tableau et courbe, sans la figure elle-même."""
    pseudo = inscrire()
    envoyer(pseudo, releve())
    court = releves.pour_agents(pseudo)[0]
    assert court["mission"] == "Enregistrer et exploiter une rotation" and len(court["tableau"]["lignes"]) == 2
    assert court["figure"] is True and "svg" not in str(court)
