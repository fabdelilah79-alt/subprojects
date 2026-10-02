"""
Rôle : préparer les tests : les données des élèves de test vont dans un dossier temporaire.
Reçoit : rien.
Produit : une fixture automatique qui redirige sorties/parties et sorties/prive vers un dossier temporaire.
Utilisé par : pytest, pour tous les tests de serveur/tests/.
"""
import pytest

from serveur import configuration


@pytest.fixture(autouse=True)
def dossiers_temporaires(tmp_path, monkeypatch):
    """Les tests n'écrivent jamais de faux élèves dans les vrais dossiers du projet."""
    vrai_chemin = configuration.chemin_projet

    def chemin_de_test(cle):
        """Renvoie un dossier temporaire pour les données d'élèves, le vrai chemin pour le reste."""
        return tmp_path / cle if cle in ("eleves", "prive") else vrai_chemin(cle)

    for module in ("serveur.donnees.stockage", "serveur.eleve.pseudonymes"):
        monkeypatch.setattr(f"{module}.chemin_projet", chemin_de_test)
