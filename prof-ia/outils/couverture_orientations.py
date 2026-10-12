"""
Rôle : montrer à l'enseignant quels objectifs du programme officiel sont couverts par quelles parties du cours.
Reçoit : la fiche du chapitre du cours (contenu/orientations/), la répartition prévue (config/application.json)
         et les parties validées (sorties/valide/partie_<n>.json).
Produit : un tableau objectif -> parties prévues / parties qui le traitent ; code de sortie 1 si un objectif n'est traité nulle part.
Utilisé par : l'enseignant : python -m outils.couverture_orientations
"""
import json
import re
import sys

from serveur import orientations
from serveur.configuration import chemin_projet

PARTIE_VALIDEE = re.compile(r"partie_([0-9]+)\.json")


def parties_traitantes():
    """Pour chaque objectif, les numéros des parties validées qui déclarent le traiter."""
    traitantes = {}
    for chemin in sorted(chemin_projet("parties_validees").glob("partie_*.json")):
        trouve = PARTIE_VALIDEE.fullmatch(chemin.name)
        if not trouve:
            continue
        partition = json.loads(chemin.read_text(encoding="utf-8"))
        for objectif in partition["generation"].get("objectifs_officiels", []):
            traitantes.setdefault(objectif, []).append(int(trouve.group(1)))
    return traitantes


def parties_prevues():
    """Pour chaque objectif, les parties auxquelles config/application.json l'attribue."""
    prevues = {}
    for numero, ids in orientations.cours()["objectifs_par_partie"].items():
        for objectif in ids:
            prevues.setdefault(objectif, []).append(int(numero))
    return prevues


def principal():
    """Affiche le tableau de couverture et signale les objectifs oubliés."""
    fiche = orientations.fiche_du_cours()
    traitantes, prevues = parties_traitantes(), parties_prevues()
    print(f"Chapitre : {fiche['titre']} ({fiche['id']}, filière {fiche['filiere']})")
    oublies = []
    for objectif in fiche["objectifs"]:
        faites = traitantes.get(objectif["id"], [])
        if not faites:
            oublies.append(objectif["id"])
        print(f"- {objectif['id']} : {objectif['texte']}")
        print(f"    prévu : parties {prevues.get(objectif['id'], []) or 'aucune'} ; traité : parties {faites or 'aucune'}")
    print("Tous les objectifs sont traités." if not oublies else f"Objectifs non traités : {', '.join(oublies)}")
    return 1 if oublies else 0


if __name__ == "__main__":
    sys.exit(principal())
