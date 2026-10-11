"""
Rôle : agent répondeur : répond à une question de la main levée, en restant dans le programme.
Reçoit : la question, la partie en cours et ce qui a été dit et écrit au tableau jusqu'ici.
Produit : la réponse orale, une ligne pour la zone brouillon, et si la question est hors programme.
Utilisé par : serveur/routes/questions.py. Son prompt : prompts/repondeur.md.
"""
from serveur.agents.commun import appeler_agent


def repondre(question, partie, deja_au_tableau):
    """Demande la réponse à l'agent répondeur."""
    donnees = {"question": question, "partie": partie, "deja_dit_et_ecrit": deja_au_tableau}
    return appeler_agent("repondeur", donnees)
