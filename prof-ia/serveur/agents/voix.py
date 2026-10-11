"""
Rôle : agent voix : écrit ce que dit le professeur, découpé en beats, et ses réactions aux choix de prédiction.
Reçoit : le numéro de la partie et le plan pédagogique.
Produit : les beats (id, phase, texte_dit tout en lettres, ton) et les branches (schemas/agents/voix.schema.json).
Utilisé par : serveur/pipeline/orchestrateur.py. Son prompt : prompts/voix.md.
"""
from serveur.agents.commun import appeler_agent


def produire(numero, plan, corrections=()):
    """Demande le texte oral de la partie à l'agent."""
    return appeler_agent("voix", {"partie": numero, "plan": plan}, corrections)
