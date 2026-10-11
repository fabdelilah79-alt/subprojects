"""
Rôle : file d'attente des parties : prépare la partie N d'un élève, puis enchaîne sur N+1 pendant qu'il suit le cours.
Reçoit : des demandes (pseudonyme, numéro de partie) ; le mode de config/application.json (fige ou adaptatif).
Produit : sorties/parties/<pseudonyme>/partie_<n>.json et l'état de chaque partie :
          en_attente, en_cours (avec un message d'avancement), prete ou erreur.
          Mode figé, ou clé absente, ou échec des agents : la partie validée par l'enseignant est servie (repli).
Utilisé par : serveur/routes/qcm.py (lancement) et serveur/routes/classe.py (états, parties).
"""
import json
import shutil
import threading
from concurrent.futures import ThreadPoolExecutor

from serveur.cles import cle_presente
from serveur.configuration import chemin_projet, lire_config
from serveur.donnees import journal_recherche
from serveur.donnees.stockage import dossier_eleve

_verrou = threading.Lock()
_etats = {}
_equipe = None


def equipe():
    """Crée (une seule fois) l'équipe de fils qui fait travailler les agents en arrière-plan."""
    global _equipe
    if _equipe is None:
        nombre = lire_config("application")["generation"]["agents_en_parallele"]
        _equipe = ThreadPoolExecutor(max_workers=nombre, thread_name_prefix="agents")
    return _equipe


def nombre_de_parties():
    """Nombre de parties du cours (config/application.json)."""
    return lire_config("application")["cours"][0]["parties"]


def noter(pseudonyme, numero, etat, message=""):
    """Met à jour l'état d'une partie d'un élève."""
    with _verrou:
        _etats[(pseudonyme, numero)] = {"partie": numero, "etat": etat, "message": message}


def etat(pseudonyme, numero):
    """Renvoie l'état d'une partie ; « prete » si son fichier existe déjà (après un redémarrage du serveur)."""
    with _verrou:
        connu = _etats.get((pseudonyme, numero))
    if connu:
        return dict(connu)
    if (dossier_eleve(pseudonyme) / f"partie_{numero}.json").exists():
        return {"partie": numero, "etat": "prete", "message": ""}
    return {"partie": numero, "etat": "en_attente", "message": ""}


def servir_validee(pseudonyme, numero, raison):
    """Repli : copie la partie validée par l'enseignant dans le dossier de l'élève."""
    source = chemin_projet("parties_validees") / f"partie_{numero}.json"
    if not source.exists():
        noter(pseudonyme, numero, "erreur", f"Partie {numero} introuvable dans sorties/valide/.")
        return
    shutil.copyfile(source, dossier_eleve(pseudonyme) / f"partie_{numero}.json")
    noter(pseudonyme, numero, "prete", raison)


def produire_avec_agents(pseudonyme, numero):
    """Fait produire la partie par les agents ; en cas d'échec, sert la partie validée."""
    from serveur.pipeline.donnees_eleve import preparer
    from serveur.pipeline.orchestrateur import generer
    try:
        partition, bilan = generer(numero, preparer(numero, pseudonyme),
                                   signaler=lambda message: noter(pseudonyme, numero, "en_cours", message))
    except Exception as erreur:  # noqa: BLE001 : l'élève doit toujours recevoir une partie.
        journal_recherche.ajouter(pseudonyme, "generation_erreur", {"partie": numero, "erreur": str(erreur)})
        servir_validee(pseudonyme, numero, "Partie de l'enseignant (les agents n'ont pas pu préparer la partie).")
        return
    dossier = dossier_eleve(pseudonyme)
    texte = lambda donnees: json.dumps(donnees, ensure_ascii=False, indent=2)
    (dossier / f"partie_{numero}_bilan.json").write_text(texte(bilan), encoding="utf-8")
    (dossier / f"partie_{numero}.json").write_text(texte(partition), encoding="utf-8")
    journal_recherche.ajouter(pseudonyme, "generation", {"partie": numero, "cout": bilan["cout_total"],
                                                          "duree_s": bilan["duree_agents_s"]})
    noter(pseudonyme, numero, "prete")


def preparer_partie(pseudonyme, numero):
    """Prépare une partie (selon le mode), puis lance la suivante : l'élève n'attend qu'au début."""
    adaptatif = lire_config("application")["mode"] == "adaptatif"
    if adaptatif and cle_presente("ANTHROPIC_API_KEY"):
        produire_avec_agents(pseudonyme, numero)
    else:
        raison = "Clé ANTHROPIC_API_KEY absente : partie de l'enseignant." if adaptatif else ""
        servir_validee(pseudonyme, numero, raison)
    if numero < nombre_de_parties():
        demander(pseudonyme, numero + 1)


def demander(pseudonyme, numero):
    """Demande une partie ; ne fait rien si elle est déjà demandée ou prête (on peut appeler plusieurs fois)."""
    dossier_eleve(pseudonyme)
    with _verrou:
        if (pseudonyme, numero) in _etats:
            return
        _etats[(pseudonyme, numero)] = {"partie": numero, "etat": "en_cours", "message": "Préparation…"}
    equipe().submit(preparer_partie, pseudonyme, numero)


def oublier():
    """Vide les états en mémoire (pour les tests)."""
    with _verrou:
        _etats.clear()
