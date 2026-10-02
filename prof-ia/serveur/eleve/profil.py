"""
Rôle : calculer le profil de l'élève à partir de ses réponses au QCM, sans IA.
Reçoit : le QCM (avec les bonnes réponses et les conceptions) et les réponses de l'élève.
Produit : les réussites par partie et les conceptions détectées, avec leur solidité
          (une erreur faite avec certitude révèle une conception plus ancrée qu'une erreur au hasard).
Utilisé par : serveur/routes/qcm.py ; plus tard, l'agent pédagogique.
"""


def choix_de(question, identifiant):
    """Renvoie le choix de la question qui porte cet identifiant."""
    return next(choix for choix in question["choix"] if choix["id"] == identifiant)


def ajouter_conception(conceptions, qcm, question, reponse, certitude):
    """Ajoute (ou complète) une conception détectée par une mauvaise réponse."""
    identifiant = choix_de(question, reponse["choix"]).get("conception")
    if not identifiant:
        return
    fiche = conceptions.setdefault(identifiant, {
        "id": identifiant, "description": qcm["conceptions"].get(identifiant, ""),
        "parties": [], "questions": [], "niveau_certitude": -1,
    })
    fiche["questions"].append(question["id"])
    if question["partie"] not in fiche["parties"]:
        fiche["parties"].append(question["partie"])
    if certitude["niveau"] > fiche["niveau_certitude"]:
        fiche["niveau_certitude"] = certitude["niveau"]
        fiche["solidite"] = certitude["si_erreur"]


def calculer_profil(qcm, reponses):
    """Calcule les réussites par partie et la liste des conceptions détectées."""
    questions = {question["id"]: question for question in qcm["questions"]}
    certitudes = {certitude["id"]: certitude for certitude in qcm["certitudes"]}
    par_partie, conceptions = {}, {}
    for reponse in reponses:
        question = questions[reponse["question"]]
        bilan = par_partie.setdefault(str(question["partie"]), {"reussies": 0, "total": 0})
        bilan["total"] += 1
        if choix_de(question, reponse["choix"])["correct"]:
            bilan["reussies"] += 1
        else:
            ajouter_conception(conceptions, qcm, question, reponse, certitudes[reponse["certitude"]])
    ordre = sorted(conceptions.values(), key=lambda fiche: -fiche["niveau_certitude"])
    return {"par_partie": par_partie, "conceptions": ordre}
