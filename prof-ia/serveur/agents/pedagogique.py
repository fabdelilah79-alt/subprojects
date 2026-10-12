"""
Rôle : agent pédagogique : prépare le plan POE d'une partie (objectif, conceptions visées, prédiction, observation…).
Reçoit : le numéro de la partie, ses objectifs officiels, les questions du QCM de cette partie avec les réponses de l'élève, son profil,
         le résumé de la partie précédente et ses prédictions et questions passées.
Produit : le plan pédagogique (schemas/plan_pedagogique.schema.json) et le compte rendu de l'appel.
Utilisé par : serveur/pipeline/orchestrateur.py. Son prompt : prompts/pedagogique.md.
"""
from serveur.agents.commun import appeler_agent


def produire(eleve, corrections=()):
    """Demande le plan pédagogique de la partie à l'agent."""
    donnees = {
        "partie": eleve["partie"],
        "objectifs_officiels_de_la_partie": eleve["objectifs_officiels"],
        "qcm_de_la_partie": eleve["qcm_de_la_partie"],
        "profil": eleve["profil"],
        "resume_partie_precedente": eleve["resume_precedent"],
        "historique": eleve["historique"],
    }
    return appeler_agent("pedagogique", donnees, corrections, schema="plan_pedagogique")
