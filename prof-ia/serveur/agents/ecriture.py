"""
Rôle : agent écriture : décide ce qui s'écrit ou se dessine au tableau pendant chaque beat, avec son ancre.
Reçoit : le plan pédagogique et les beats de l'agent voix.
Produit : pour chaque beat, ses actions ecrire, formule ou dessiner (schemas/agents/ecriture.schema.json).
Utilisé par : serveur/pipeline/orchestrateur.py. Son prompt : prompts/ecriture.md.
"""
from serveur.agents.commun import appeler_agent


def produire(plan, voix, corrections=()):
    """Demande les écrits et schémas de la partie à l'agent."""
    return appeler_agent("ecriture", {"plan": plan, "beats": voix["beats"]}, corrections)
