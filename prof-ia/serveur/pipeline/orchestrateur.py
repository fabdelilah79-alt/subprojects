"""
Rôle : produire la partition d'une partie avec les agents : pédagogique -> voix -> écriture -> architecture -> chef,
       corrections (deux tours au plus), validation, voix (audio), validation finale.
Reçoit : le numéro de la partie, les données de l'élève (QCM de la partie, profil, résumé, historique)
         et une fonction qui reçoit les messages d'avancement.
Produit : la partition validée (dictionnaire) et un bilan (appels, jetons, coût, commentaire du chef).
Utilisé par : serveur/pipeline/file_attente.py et outils/generer_partie.py.
"""
from outils.valider_partition import valider_document
from serveur.agents import architecture, chef, ecriture, pedagogique, voix
from serveur.configuration import lire_config
from serveur.pipeline.assemblage import assembler
from serveur.voix.audio_partition import completer

ORDRE = ("pedagogique", "voix", "ecriture", "architecture")


class ErreurGeneration(Exception):
    """La partition n'a pas pu être produite ou reste invalide après les corrections."""


def lancer(agent, numero, eleve, travaux, corrections, bilan):
    """Appelle un des quatre agents de production et range sa réponse dans travaux."""
    if agent == "pedagogique":
        reponse, compte = pedagogique.produire(eleve, corrections)
    elif agent == "voix":
        reponse, compte = voix.produire(numero, travaux["pedagogique"], corrections)
    elif agent == "ecriture":
        reponse, compte = ecriture.produire(travaux["pedagogique"], travaux["voix"], corrections)
    else:
        reponse, compte = architecture.produire(travaux["pedagogique"], travaux["voix"], travaux["ecriture"], corrections)
    travaux[agent] = reponse
    bilan["appels"].append(compte)


def produire_depuis(premier, numero, eleve, travaux, corrections, bilan, signaler):
    """Relance les agents à partir de « premier » (ceux d'après dépendent de son travail)."""
    for agent in ORDRE[ORDRE.index(premier):]:
        signaler(f"Agent {agent}…")
        lancer(agent, numero, eleve, travaux, corrections.get(agent, ()), bilan)


def corrections_du_tour(avis, erreurs):
    """Regroupe les corrections par agent ; les erreurs automatiques vont à l'écriture et à l'architecture."""
    corrections = {}
    for correction in avis["corrections"]:
        corrections.setdefault(correction["agent"], []).append(correction["consigne"])
    if erreurs and not corrections:
        corrections = {"ecriture": list(erreurs), "architecture": list(erreurs)}
    return corrections


def relire(numero, eleve, travaux, bilan, signaler):
    """Assemble, valide et fait relire par le chef, avec deux tours de corrections au plus."""
    tours = lire_config("modeles")["tours_de_correction_max"]
    for tour in range(tours + 1):
        partition, remarques = assembler(numero, *(travaux[a] for a in ORDRE))
        erreurs = remarques + valider_document(partition)[0]
        signaler(f"Relecture par le chef (tour {tour + 1})…")
        avis, compte = chef.verifier(partition, travaux["pedagogique"], eleve["profil"], erreurs)
        bilan["appels"].append(compte)
        bilan["commentaire_chef"] = avis["commentaire"]
        corrections = corrections_du_tour(avis, erreurs)
        if (avis["valide"] and not erreurs) or tour == tours:
            return partition, erreurs
        bilan["tours_de_correction"] = tour + 1
        premier = min(corrections, key=ORDRE.index)
        produire_depuis(premier, numero, eleve, travaux, corrections, bilan, signaler)
    return partition, erreurs


def resumer(bilan):
    """Ajoute au bilan les totaux : coût, jetons et durée des appels."""
    bilan["cout_total"] = round(sum(c["cout"] for c in bilan["appels"]), 4)
    bilan["duree_agents_s"] = round(sum(c["duree_s"] for c in bilan["appels"]), 1)
    for cle in ("entree", "sortie", "cache_lecture", "cache_ecriture"):
        bilan[f"jetons_{cle}"] = sum(c["jetons"][cle] for c in bilan["appels"])
    return bilan


def generer(numero, eleve, signaler=print):
    """Produit la partition complète d'une partie pour un élève ; lève ErreurGeneration si elle reste invalide."""
    travaux, bilan = {}, {"partie": numero, "appels": [], "tours_de_correction": 0}
    produire_depuis("pedagogique", numero, eleve, travaux, {}, bilan, signaler)
    partition, erreurs = relire(numero, eleve, travaux, bilan, signaler)
    if erreurs:
        raise ErreurGeneration("Partition encore invalide après les corrections : " + " ; ".join(erreurs[:5]))
    signaler("Voix du professeur…")
    bilan["voix"] = completer(partition)
    erreurs, avertissements = valider_document(partition)
    if erreurs:
        raise ErreurGeneration("Partition invalide après la voix : " + " ; ".join(erreurs[:5]))
    bilan["avertissements"] = avertissements
    bilan["plan"] = travaux["pedagogique"]
    return partition, resumer(bilan)
