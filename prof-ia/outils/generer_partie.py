"""
Rôle : faire produire une partie par les agents IA, depuis le terminal (il faut la clé ANTHROPIC_API_KEY dans .env).
Reçoit : le numéro de la partie et, si on veut l'adapter à un élève, son pseudonyme (--eleve E001).
Produit : la partition proposée (sorties/valide/partie_<n>_proposee.json, à relire par l'enseignant),
          ou celle de l'élève (sorties/parties/<pseudonyme>/partie_<n>.json), et le bilan des appels (coût, durée).
Utilisé par : l'enseignant : python -m outils.generer_partie 2   ou   python -m outils.generer_partie 2 --eleve E001
"""
import json
import sys

from serveur.agents.appel_ia import ErreurIA
from serveur.cles import cle_presente
from serveur.configuration import RACINE, chemin_projet
from serveur.donnees.stockage import PseudonymeInconnu, dossier_eleve
from serveur.pipeline.donnees_eleve import preparer
from serveur.pipeline.orchestrateur import ErreurGeneration, generer
from serveur.voix.synthese import ErreurVoix


def lire_arguments(arguments):
    """Lit « <numéro> [--eleve <pseudonyme>] » ; renvoie (numéro, pseudonyme) ou None si c'est mal écrit."""
    if len(arguments) not in (1, 3) or not arguments[0].isdigit():
        return None
    if len(arguments) == 3 and arguments[1] != "--eleve":
        return None
    return int(arguments[0]), (arguments[2] if len(arguments) == 3 else None)


def enregistrer(numero, pseudonyme, partition, bilan):
    """Écrit la partition et son bilan ; renvoie le chemin de la partition."""
    if pseudonyme:
        dossier, nom = dossier_eleve(pseudonyme), f"partie_{numero}"
    else:
        dossier, nom = chemin_projet("parties_validees"), f"partie_{numero}_proposee"
    texte = lambda donnees: json.dumps(donnees, ensure_ascii=False, indent=2) + "\n"
    (dossier / f"{nom}.json").write_text(texte(partition), encoding="utf-8")
    (dossier / f"{nom}_bilan.json").write_text(texte(bilan), encoding="utf-8")
    return dossier / f"{nom}.json"


def afficher_bilan(bilan, chemin):
    """Affiche en français : où est la partition, combien d'appels, de jetons, de temps et d'argent."""
    print(f"Partition écrite : {chemin.relative_to(RACINE)}")
    print(f"Appels aux agents : {len(bilan['appels'])} (tours de correction : {bilan['tours_de_correction']}).")
    print(f"Jetons : {bilan['jetons_entree']} en entrée, {bilan['jetons_sortie']} en sortie, "
          f"{bilan['jetons_cache_lecture']} lus dans le cache.")
    print(f"Durée des agents : {bilan['duree_agents_s']} s ; coût estimé : {bilan['cout_total']} $.")
    print(f"Avis du chef : {bilan['commentaire_chef']}")
    for avertissement in bilan["avertissements"]:
        print(f"- {avertissement}")


def principal(arguments):
    """Vérifie la clé, prépare les données de l'élève, lance les agents, enregistre et affiche le bilan."""
    lus = lire_arguments(arguments)
    if lus is None:
        print("Utilisation : python -m outils.generer_partie 2   (ou : python -m outils.generer_partie 2 --eleve E001)")
        return 2
    if not cle_presente("ANTHROPIC_API_KEY"):
        print("Clé ANTHROPIC_API_KEY absente : ajoutez-la dans le fichier .env (voir .env.exemple).")
        return 1
    numero, pseudonyme = lus
    try:
        partition, bilan = generer(numero, preparer(numero, pseudonyme))
        afficher_bilan(bilan, enregistrer(numero, pseudonyme, partition, bilan))
    except (ErreurIA, ErreurGeneration, ErreurVoix, PseudonymeInconnu) as erreur:
        print(f"Échec : {erreur}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(principal(sys.argv[1:]))
