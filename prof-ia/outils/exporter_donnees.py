"""
Rôle : exporter les données de recherche en fichiers CSV (lisibles par un tableur, R, SPSS, Python…).
Reçoit : le journal de recherche (SQLite) et les dossiers des élèves (sorties/parties/), sous pseudonyme.
Produit : dans sorties/journaux/exports/ : eleves.csv, qcm.csv (une ligne par réponse, pré et post-test),
          profils.csv (réussites par partie), conceptions.csv, et un fichier evenements_<type>.csv par type d'événement.
Utilisé par : l'enseignant-chercheur : python -m outils.exporter_donnees
Ne lit JAMAIS la correspondance nom <-> pseudonyme (sorties/prive/) : les exports ne contiennent aucun nom.
"""
import csv
import json
import sys

from serveur.configuration import RACINE, chemin_projet
from serveur.donnees import journal_recherche

COLONNES_QCM = ("pseudonyme", "test", "question", "choix", "correct", "conception", "certitude", "justification",
                "temps_s", "heure_serveur")


def ecrire_csv(nom, colonnes, lignes):
    """Écrit un fichier CSV (séparateur point-virgule, UTF-8 avec BOM pour les tableurs) ; renvoie son chemin."""
    dossier = chemin_projet("exports")
    dossier.mkdir(parents=True, exist_ok=True)
    chemin = dossier / f"{nom}.csv"
    with chemin.open("w", encoding="utf-8-sig", newline="") as fichier:
        ecrivain = csv.DictWriter(fichier, fieldnames=list(colonnes), delimiter=";", extrasaction="ignore")
        ecrivain.writeheader()
        ecrivain.writerows(lignes)
    return chemin


def a_plat(valeur):
    """Rend une valeur lisible dans une case : les listes et dictionnaires sont écrits en JSON."""
    return json.dumps(valeur, ensure_ascii=False) if isinstance(valeur, (dict, list)) else valeur


def fiches_eleves():
    """Lit, pour chaque élève, son fichier eleve.json et ses profils (pré et post), sans nom."""
    for dossier in sorted(chemin_projet("eleves").glob("*/")):
        fiche = dossier / "eleve.json"
        if fiche.exists():
            profils = {test: dossier / f"profil{suffixe}.json" for test, suffixe in (("pre", ""), ("post", "_post"))}
            yield json.loads(fiche.read_text(encoding="utf-8")), {
                test: json.loads(chemin.read_text(encoding="utf-8")) for test, chemin in profils.items() if chemin.exists()}


def exporter_eleves_et_profils():
    """Écrit eleves.csv, profils.csv et conceptions.csv ; renvoie les chemins écrits."""
    eleves, profils, conceptions = [], [], []
    for fiche, par_test in fiches_eleves():
        eleves.append(fiche)
        for test, profil in par_test.items():
            for partie, bilan in profil["par_partie"].items():
                profils.append({"pseudonyme": fiche["pseudonyme"], "test": test, "partie": partie, **bilan})
            for conception in profil["conceptions"]:
                conceptions.append({"pseudonyme": fiche["pseudonyme"], "test": test, **conception,
                                    "questions": a_plat(conception["questions"]), "parties": a_plat(conception["parties"])})
    return [
        ecrire_csv("eleves", ("pseudonyme", "classe", "cours", "debut"), eleves),
        ecrire_csv("profils", ("pseudonyme", "test", "partie", "reussies", "total"), profils),
        ecrire_csv("conceptions", ("pseudonyme", "test", "id", "solidite", "niveau_certitude", "parties", "questions"),
                   conceptions),
    ]


def exporter_qcm(evenements):
    """Écrit qcm.csv : une ligne par réponse au questionnaire de départ (pre) ou de fin (post)."""
    lignes = [{"pseudonyme": e["pseudonyme"], "test": e["type"].removeprefix("qcm_"), "heure_serveur": e["heure_serveur"],
               **e["donnees"]} for e in evenements if e["type"] in ("qcm_pre", "qcm_post")]
    return ecrire_csv("qcm", COLONNES_QCM, lignes)


def exporter_evenements(evenements):
    """Écrit un fichier par type d'événement, avec une colonne par donnée ; renvoie les chemins écrits."""
    par_type = {}
    for evenement in evenements:
        par_type.setdefault(evenement["type"], []).append(evenement)
    chemins = []
    for type_evenement, liste in sorted(par_type.items()):
        cles = sorted({cle for e in liste for cle in e["donnees"]})
        lignes = [{**{c: e[c] for c in ("numero", "pseudonyme", "heure_navigateur", "heure_serveur")},
                   **{cle: a_plat(valeur) for cle, valeur in e["donnees"].items()}} for e in liste]
        colonnes = ("numero", "pseudonyme", "heure_navigateur", "heure_serveur", *cles)
        chemins.append(ecrire_csv(f"evenements_{type_evenement}", colonnes, lignes))
    return chemins


def principal():
    """Exporte tout et affiche la liste des fichiers écrits."""
    evenements = journal_recherche.lire()
    chemins = exporter_eleves_et_profils() + [exporter_qcm(evenements)] + exporter_evenements(evenements)
    print(f"{len(evenements)} événements exportés. Fichiers écrits :")
    for chemin in chemins:
        print(f"- {chemin.relative_to(RACINE) if chemin.is_relative_to(RACINE) else chemin}")
    return 0


if __name__ == "__main__":
    sys.exit(principal())
