"""
Rôle : rassembler ce que l'agent pédagogique doit savoir d'un élève pour préparer une partie, sans son nom.
Reçoit : le pseudonyme de l'élève (ou rien, pour une partie générique) et le numéro de la partie.
Produit : un dictionnaire : questions du QCM de la partie avec ses réponses, profil, résumé de la partie
          précédente, prédictions et questions déjà posées (historique).
Utilisé par : serveur/pipeline/file_attente.py et outils/generer_partie.py.
"""
import json

from serveur.configuration import chemin_projet
from serveur.donnees import journal_recherche
from serveur.donnees.stockage import dossier_eleve

TYPES_HISTORIQUE = ("prediction", "question_posee")


def lire_json(chemin, defaut=None):
    """Lit un fichier JSON, ou renvoie la valeur par défaut s'il n'existe pas."""
    return json.loads(chemin.read_text(encoding="utf-8")) if chemin.exists() else defaut


def lire_qcm():
    """Lit le QCM diagnostique, avec les bonnes réponses et les conceptions."""
    return lire_json(chemin_projet("contenu") / "qcm" / "qcm.json")


def qcm_de_la_partie(numero, reponses):
    """Questions du QCM qui portent sur la partie, avec la réponse de l'élève à chacune (s'il y en a)."""
    qcm, par_question = lire_qcm(), {r["question"]: r for r in reponses}
    questions = []
    for question in (q for q in qcm["questions"] if q["partie"] == numero):
        reponse = par_question.get(question["id"])
        questions.append({
            "enonce": question["enonce"], "choix": question["choix"],
            "reponse_eleve": None if reponse is None else {
                "choix": reponse.get("choix"), "justification": reponse.get("justification", ""),
                "certitude": reponse.get("certitude")},
        })
    return questions


def ecrits_a_retenir(partition):
    """Ce que la partie a laissé dans la zone « à retenir » : textes et formules, dans l'ordre."""
    ecrits = []
    for beat in partition["beats"]:
        for action in beat["actions"]:
            if action.get("zone") == "a_retenir":
                ecrits.append(action.get("texte") or action.get("latex"))
    return ecrits


def resume_precedent(dossier, numero):
    """Résumé de la partie précédente telle que l'élève l'a vue (ou la version validée), ou None pour la première."""
    if numero <= 1:
        return None
    nom = f"partie_{numero - 1}.json"
    partition = lire_json(dossier / nom) if dossier else None
    partition = partition or lire_json(chemin_projet("parties_validees") / nom)
    if partition is None:
        return None
    return {"titre": partition["titre"], "a_retenir": ecrits_a_retenir(partition)}


def historique(pseudonyme):
    """Prédictions et questions de l'élève depuis le début de la séance, en version courte."""
    evenements = journal_recherche.lire(pseudonyme, TYPES_HISTORIQUE)
    return [{"type": e["type"], **e["donnees"]} for e in evenements]


def preparer(numero, pseudonyme=None):
    """Prépare les données de l'élève pour une partie ; sans pseudonyme : partie générique (profil vide)."""
    if pseudonyme is None:
        return {"partie": numero, "qcm_de_la_partie": qcm_de_la_partie(numero, []), "profil": None,
                "resume_precedent": resume_precedent(None, numero), "historique": []}
    dossier = dossier_eleve(pseudonyme)
    profil = lire_json(dossier / "profil.json")
    if profil:
        profil = {cle: valeur for cle, valeur in profil.items() if cle != "pseudonyme"}
    return {
        "partie": numero,
        "qcm_de_la_partie": qcm_de_la_partie(numero, lire_json(dossier / "reponses_qcm.json", [])),
        "profil": profil,
        "resume_precedent": resume_precedent(dossier, numero),
        "historique": historique(pseudonyme),
    }
