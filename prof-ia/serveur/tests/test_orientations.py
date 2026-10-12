"""
Rôle : vérifier les fiches des orientations pédagogiques nationales et leur usage par l'application.
Reçoit : contenu/orientations/, schemas/orientations_chapitre.schema.json, config/application.json.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import copy
import json

import pytest

from outils import couverture_orientations
from outils.valider_partition import erreurs_schema, valider_document
from serveur import orientations
from serveur.agents.commun import contexte_stable
from serveur.configuration import chemin_projet

SCHEMA = chemin_projet("schemas") / "orientations_chapitre.schema.json"


def toutes_les_fiches():
    """Toutes les fiches présentes sur le disque, avec le niveau de l'index qui les contient."""
    index = orientations.lire_index()
    for niveau in index["niveaux"]:
        for chemin in sorted((orientations.dossier() / niveau["id"]).glob("*.json")):
            yield niveau, chemin, json.loads(chemin.read_text(encoding="utf-8"))


def test_fiches_conformes_et_coherentes():
    """Chaque fiche respecte son schéma, porte le bon id, des filières connues et des prérequis existants."""
    fiches = list(toutes_les_fiches())
    assert len(fiches) >= 60
    for niveau, chemin, fiche in fiches:
        assert erreurs_schema(fiche, SCHEMA) == [], chemin.name
        assert fiche["id"] == f"{niveau['id']}/{chemin.stem}" and fiche["niveau"] == niveau["id"]
        assert set(fiche["filieres"]) <= set(niveau["filieres"]), fiche["id"]
        for bloc in fiche.get("specifique", []) + fiche["duree_h"]:
            assert set(bloc["filieres"]) <= set(fiche["filieres"]), fiche["id"]
        for prerequis in fiche.get("prerequis", []):
            assert (orientations.dossier() / f"{prerequis}.json").exists(), prerequis


def test_index_complet_et_objectifs_uniques():
    """L'index liste exactement les fiches du disque ; les objectifs ont des id uniques pour chaque filière."""
    index = orientations.lire_index()
    listes = {c["id"] for n in index["niveaux"] for c in n["chapitres"]}
    assert listes == {f["id"] for _, _, f in toutes_les_fiches()}
    for _, _, brute in toutes_les_fiches():
        for filiere in brute["filieres"]:
            ids = [o["id"] for o in orientations.fiche(brute["id"], filiere)["objectifs"]]
            assert len(ids) == len(set(ids)), (brute["id"], filiere)


def test_fiche_adaptee_a_la_filiere():
    """Les ajouts propres à une filière n'apparaissent que pour elle ; un chapitre hors filière est refusé."""
    pc, svt = orientations.fiche("2bac/meca4_oscillants", "PC"), orientations.fiche("2bac/meca4_oscillants", "SVT")
    assert len(pc["objectifs"]) == len(svt["objectifs"]) + 1
    cle = "Pendule pesant : équation différentielle"
    assert any(cle in c for c in pc["contenus"]) and not any(cle in c for c in svt["contenus"])
    with pytest.raises(ValueError):
        orientations.fiche("2bac/ondes4_reseau", "SVT")


def test_cours_relie_au_programme():
    """Le cours pointe vers une fiche existante ; ses objectifs par partie existent ; le contexte des agents les contient."""
    ids = {o["id"] for o in orientations.fiche_du_cours()["objectifs"]}
    for objectifs in orientations.cours()["objectifs_par_partie"].values():
        assert set(objectifs) <= ids
    assert orientations.objectifs_de_la_partie(2)[0]["id"] == "O3"
    texte = orientations.texte_pour_agents()
    assert '"hors_programme"' in texte and ", " not in texte[:50]
    assert "Programme officiel" in contexte_stable()


def test_objectif_inconnu_refuse_et_couverture():
    """Une partition qui déclare un objectif absent de la fiche est refusée ; les parties validées couvrent tout."""
    partition = json.loads((chemin_projet("parties_validees") / "partie_1.json").read_text(encoding="utf-8"))
    fausse = copy.deepcopy(partition)
    fausse["generation"]["objectifs_officiels"] = ["O1", "O99"]
    assert any("O99" in e for e in valider_document(fausse)[0])
    assert valider_document(partition)[0] == []
    assert couverture_orientations.principal() == 0
