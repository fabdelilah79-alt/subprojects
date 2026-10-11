"""
Rôle : vérifier les agents, l'assemblage et l'orchestrateur avec un faux client Claude (jamais la vraie API).
Reçoit : serveur/agents/, serveur/pipeline/ et les réponses préparées de faux_claude.py.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import copy

import pytest

from outils import generer_partie
from outils.valider_partition import valider_document
from serveur.agents import appel_ia
from serveur.agents.appel_ia import ErreurIA, parametres
from serveur.pipeline.assemblage import assembler
from serveur.pipeline.donnees_eleve import preparer
from serveur.pipeline.orchestrateur import generer
from serveur.tests import faux_claude as faux


@pytest.fixture
def claude():
    """Installe un faux client Claude pendant le test, puis le retire."""
    def installer(**options):
        client = faux.FauxClaude(**options)
        appel_ia.definir_client(client)
        return client
    yield installer
    appel_ia.definir_client(None)


def test_parametres_cache_effort_repli():
    """Le contexte stable est mis en cache ; effort et repli suivent config/modeles.json."""
    schema = {"$schema": "x", "title": "t", "type": "object"}
    requete = parametres("chef", ("stable", "prompt"), "consigne", schema)
    assert requete["system"][0]["cache_control"] == {"type": "ephemeral"}
    assert "cache_control" not in requete["system"][1]
    assert requete["output_config"]["effort"] == "high" and requete["fallbacks"] == "default"
    assert "title" not in requete["output_config"]["format"]["schema"]
    repondeur = parametres("repondeur", ("stable", "prompt"), "consigne", schema)
    assert "effort" not in repondeur["output_config"] and "betas" not in repondeur


def test_assemblage_valide():
    """Les réponses des agents donnent une partition valide, actions rangées dans l'ordre des ancres."""
    partition, remarques = assembler(2, faux.PLAN, faux.VOIX, faux.ECRITURE, faux.ARCHITECTURE)
    assert remarques == [] and valider_document(partition)[0] == []
    premier, quatrieme = partition["beats"][0], partition["beats"][3]
    assert premier["actions"][0] == {"type": "nouveau_tableau", "titre": "Vitesses"}
    assert quatrieme["actions"][0]["parametres"] == {"noms": ["A", "B"], "angle_deg": 30}
    assert partition["beats"][1]["actions"][0]["type"] == "prediction"
    assert partition["beats"][2]["actions"][0]["attendre"] == "clic_termine"


def test_assemblage_signale_beat_inconnu():
    """Un écrit pour un beat qui n'existe pas est signalé (et n'est pas perdu en silence)."""
    ecriture = copy.deepcopy(faux.ECRITURE)
    ecriture["beats"][0]["id"] = "p2_b99"
    _, remarques = assembler(2, faux.PLAN, faux.VOIX, ecriture, faux.ARCHITECTURE)
    assert "p2_b99" in remarques[0]


def test_orchestrateur_avec_correction(claude):
    """Le chef demande une correction : l'écriture et l'architecture sont relancées, puis tout est validé."""
    refus = {"valide": False, "corrections": [{"agent": "ecriture", "consigne": "Plus court."}], "commentaire": "À revoir."}
    client = claude(avis_chef=[refus, {"valide": True, "corrections": [], "commentaire": "Bien."}])
    partition, bilan = generer(2, preparer(2), signaler=lambda message: None)
    assert client.appels == ["pedagogique", "voix", "ecriture", "architecture", "chef", "ecriture", "architecture", "chef"]
    assert "Plus court." in client.requetes[5]["messages"][0]["content"]
    assert bilan["tours_de_correction"] == 1 and bilan["commentaire_chef"] == "Bien."
    assert all(beat["audio"] and beat["duree_s"] > 0 for beat in partition["beats"])
    assert bilan["cout_total"] > 0 and bilan["jetons_cache_lecture"] == 900 * 8


def test_refus_du_modele(claude):
    """Un refus du modèle donne une ErreurIA claire, sans nouvel essai."""
    client = claude(fin="refusal")
    with pytest.raises(ErreurIA, match="Refus"):
        generer(2, preparer(2), signaler=lambda message: None)
    assert client.appels == ["pedagogique"]


def test_cle_anthropic_absente(monkeypatch, capsys):
    """Sans clé : message clair en français, aucun appel."""
    monkeypatch.setattr("outils.generer_partie.cle_presente", lambda nom: False)
    assert generer_partie.principal(["2"]) == 1
    assert "ANTHROPIC_API_KEY" in capsys.readouterr().out
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.setattr("serveur.cles.cle_presente", lambda nom: False)
    with pytest.raises(ErreurIA, match="ANTHROPIC_API_KEY"):
        appel_ia.appeler("voix", ("a", "b"), "c", {"type": "object"})
