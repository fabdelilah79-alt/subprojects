"""
Rôle : agent architecture : place les écrits dans les zones, choisit quand ouvrir la ressource et poser la prédiction.
Reçoit : le plan, les beats (voix), les écrits (écriture) et les noms des zones du tableau.
Produit : titre du tableau, placements, médias, place de la prédiction (schemas/agents/architecture.schema.json).
Utilisé par : serveur/pipeline/orchestrateur.py. Son prompt : prompts/architecture.md.
"""
from serveur.agents.commun import appeler_agent
from serveur.configuration import lire_config


def produire(plan, voix, ecriture, corrections=()):
    """Demande la mise en place au tableau à l'agent."""
    zones = [nom for nom in lire_config("tableau")["zones"] if nom != "cadre_media"]
    donnees = {"plan": plan, "beats": voix["beats"], "ecrits": ecriture["beats"], "zones": zones}
    return appeler_agent("architecture", donnees, corrections)
