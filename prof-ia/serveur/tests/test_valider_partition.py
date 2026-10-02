"""
Rôle : vérifier que outils/valider_partition.py accepte la partition modèle et repère les erreurs.
Reçoit : sorties/valide/partie_1.json et des copies volontairement abîmées.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import copy
import json

import pytest

from outils.valider_partition import valider
from serveur.configuration import chemin_projet

MODELE = chemin_projet("sorties") / "valide" / "partie_1.json"


@pytest.fixture
def partition():
    """Fournit une copie de la partition modèle, que chaque test peut abîmer."""
    return copy.deepcopy(json.loads(MODELE.read_text(encoding="utf-8")))


def verifier(partition, dossier):
    """Écrit la partition dans un fichier temporaire et renvoie (erreurs, avertissements)."""
    chemin = dossier / "partie.json"
    chemin.write_text(json.dumps(partition, ensure_ascii=False), encoding="utf-8")
    return valider(chemin)


def test_partition_modele_valide():
    """La partition modèle ne contient aucune erreur."""
    erreurs, _ = valider(MODELE)
    assert erreurs == []


def test_champ_manquant(partition, tmp_path):
    """Un beat sans texte_dit est refusé, avec un message en français."""
    del partition["beats"][0]["texte_dit"]
    erreurs, _ = verifier(partition, tmp_path)
    assert erreurs == ["beats[1] : champ obligatoire manquant : texte_dit"]


def test_ancre_absente(partition, tmp_path):
    """Une ancre qui n'est pas dans texte_dit est signalée."""
    partition["beats"][3]["actions"][0]["ancre"] = "mot inexistant"
    erreurs, _ = verifier(partition, tmp_path)
    assert erreurs == ["p1_b04, action 1 : l'ancre « mot inexistant » n'est pas dans texte_dit"]


def test_ancres_dans_le_desordre(partition, tmp_path):
    """Deux ancres inversées sont signalées."""
    actions = partition["beats"][9]["actions"]
    actions[0], actions[1] = actions[1], actions[0]
    erreurs, _ = verifier(partition, tmp_path)
    assert erreurs == ["p1_b10, action 2 : l'ancre « s égale R fois thêta » arrive avant l'ancre précédente"]


def test_zone_et_ton_inconnus(partition, tmp_path):
    """Une zone et un ton qui n'existent pas dans config/ sont signalés."""
    partition["beats"][3]["actions"][0]["zone"] = "plafond"
    partition["beats"][3]["ton"] = "furieux"
    erreurs, _ = verifier(partition, tmp_path)
    assert len(erreurs) == 2
    assert "zone « plafond » inconnue" in " ".join(erreurs)


def test_chiffres_dans_texte_dit(partition, tmp_path):
    """Un chiffre dans texte_dit donne un avertissement, pas une erreur."""
    partition["beats"][10]["texte_dit"] = partition["beats"][10]["texte_dit"].replace("quarante-cinq", "45")
    erreurs, avertissements = verifier(partition, tmp_path)
    assert erreurs == []
    assert any("contient 4 5" in a for a in avertissements)
