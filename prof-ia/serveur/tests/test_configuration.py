"""
Rôle : vérifier la lecture des fichiers de réglages.
Reçoit : les fonctions de serveur/configuration.py.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import pytest

from serveur.configuration import chemin_projet, lire_config


def test_les_quatre_fichiers_de_config_se_lisent():
    """Chaque fichier de config/ est un JSON valide."""
    for nom in ("application", "modeles", "tableau", "voix"):
        assert isinstance(lire_config(nom), dict)


def test_fichier_absent_donne_un_message_clair():
    """Un fichier de réglages absent donne une erreur qui le nomme."""
    with pytest.raises(FileNotFoundError, match="config/inexistant.json"):
        lire_config("inexistant")


def test_chemin_du_client_existe():
    """Le dossier client/ déclaré dans la config existe bien."""
    assert chemin_projet("client").is_dir()
