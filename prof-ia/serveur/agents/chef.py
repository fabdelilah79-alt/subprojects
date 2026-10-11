"""
Rôle : agent chef : relit la partition complète et valide, ou renvoie des corrections précises à un agent.
Reçoit : la partition assemblée, le plan, le profil de l'élève et les erreurs détectées automatiquement.
Produit : valide (oui/non), corrections par agent, commentaire (schemas/agents/chef.schema.json).
Utilisé par : serveur/pipeline/orchestrateur.py. Son prompt : prompts/chef.md.
"""
from serveur.agents.commun import appeler_agent


def verifier(partition, plan, profil, erreurs):
    """Demande au chef de relire la partition."""
    donnees = {"partition": partition, "plan": plan, "profil": profil, "erreurs_automatiques": erreurs}
    return appeler_agent("chef", donnees)
