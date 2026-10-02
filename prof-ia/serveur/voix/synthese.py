"""
Rôle : interface unique de la voix : texte + ton -> fichier audio + durée + temps des mots (si disponibles).
Reçoit : le texte à dire et son ton ; le fournisseur et ses réglages sont lus dans config/voix.json.
Produit : {"audio": nom du fichier dans sorties/cache_audio/, "duree_s": ..., "temps_mots": ... ou None}.
Utilisé par : outils/generer_audio.py (et plus tard l'orchestrateur et le répondeur).
Changer de fournisseur = changer « fournisseur » dans config/voix.json ; le reste du projet ne bouge pas.
"""
from serveur.configuration import lire_config
from serveur.voix import cache_audio, voix_essai

FOURNISSEURS = {"essai": voix_essai}


class ErreurVoix(Exception):
    """Erreur de synthèse vocale, avec un message en français."""


def debit_normal(texte, duree, reglages):
    """Vérifie que le débit (caractères par seconde) est dans la plage de config/voix.json."""
    debit = len(texte) / duree if duree else 0
    return reglages["debit_caracteres_par_s"]["min"] <= debit <= reglages["debit_caracteres_par_s"]["max"]


def produire_controle(fournisseur, texte, reglages, chemin):
    """Produit l'audio ; le régénère si le débit est anormal (nombre d'essais limité), puis le signale."""
    for _ in range(reglages["nouvelles_tentatives_max"] + 1):
        duree, temps_mots = fournisseur.produire(texte, reglages[reglages["fournisseur"]], chemin)
        if debit_normal(texte, duree, reglages):
            return duree, temps_mots, True
    return duree, temps_mots, False


def synthetiser(texte, ton):
    """Renvoie l'audio d'un texte dit sur un ton donné, depuis le cache ou en le produisant."""
    reglages = lire_config("voix")
    nom = reglages["fournisseur"]
    if nom not in FOURNISSEURS:
        raise ErreurVoix(f"Fournisseur de voix « {nom} » pas encore branché (ajoutez la clé d'API, puis l'étape 5 avec la clé).")
    description = {"fournisseur": nom, "reglages": reglages.get(nom), "style": reglages["consigne_style"],
                   "ton": reglages["tons"].get(ton), "texte": texte}
    cle = cache_audio.empreinte(description)
    deja = cache_audio.chercher(cle)
    if deja:
        return deja
    chemin = cache_audio.dossier() / f"{cle}.wav"
    duree, temps_mots, normal = produire_controle(FOURNISSEURS[nom], texte, reglages, chemin)
    informations = {"audio": chemin.name, "duree_s": duree, "temps_mots": temps_mots, "debit_normal": normal}
    cache_audio.enregistrer(cle, informations)
    return informations
