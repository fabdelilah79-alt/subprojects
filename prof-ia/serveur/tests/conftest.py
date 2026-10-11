"""
Rôle : préparer les tests : les données des élèves de test vont dans un dossier temporaire.
Reçoit : rien.
Produit : une fixture automatique qui redirige sorties/parties, sorties/prive et le journal vers un dossier temporaire,
         et fait travailler la file d'attente des parties sans fil d'arrière-plan.
Utilisé par : pytest, pour tous les tests de serveur/tests/.
"""
import pytest

from serveur import configuration
from serveur.pipeline import file_attente

# Modules qui écrivent des données d'élèves : leurs chemins sont redirigés pendant les tests.
MODULES = ("serveur.donnees.stockage", "serveur.eleve.pseudonymes", "serveur.donnees.journal_recherche",
           "serveur.pipeline.file_attente", "outils.exporter_donnees")


class EquipeImmediate:
    """Remplace l'équipe de fils de la file d'attente : chaque travail est fait tout de suite, pendant le test."""

    def submit(self, travail, *arguments):
        """Fait le travail immédiatement."""
        travail(*arguments)


@pytest.fixture(autouse=True)
def dossiers_temporaires(tmp_path, monkeypatch):
    """Les tests n'écrivent jamais de faux élèves dans les vrais dossiers du projet."""
    vrai_chemin = configuration.chemin_projet

    def chemin_de_test(cle):
        """Renvoie un dossier temporaire pour les données d'élèves, le vrai chemin pour le reste."""
        if cle == "journal":
            return tmp_path / "journal.sqlite"
        return tmp_path / cle if cle in ("eleves", "prive", "exports") else vrai_chemin(cle)

    for module in MODULES:
        monkeypatch.setattr(f"{module}.chemin_projet", chemin_de_test)
    file_attente.oublier()
    monkeypatch.setattr(file_attente, "equipe", EquipeImmediate)
