"""
Rôle : vérifier une partition avant qu'elle soit jouée, et dire en français ce qui ne va pas.
Reçoit : le chemin d'une partition (par exemple sorties/valide/partie_1.json).
Produit : la liste des erreurs et des avertissements. Code de sortie 0 si la partition est valide, 1 sinon.
Utilisé par : l'enseignant (python -m outils.valider_partition <fichier>) ; plus tard, l'orchestrateur.
"""
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

from outils.controles_partition import avertissements_partition, erreurs_partition
from serveur.configuration import RACINE, chemin_projet, lire_config


def lire_json(chemin):
    """Lit un fichier JSON et renvoie son contenu."""
    with Path(chemin).open(encoding="utf-8") as fichier:
        return json.load(fichier)


def lieu_erreur(erreur):
    """Traduit le chemin d'une erreur en texte lisible, par exemple beats[2].actions[0]."""
    lieu = ""
    for morceau in erreur.absolute_path:
        lieu += f"[{morceau + 1}]" if isinstance(morceau, int) else f".{morceau}"
    return lieu.lstrip(".") or "partition"


def message_erreur(erreur):
    """Traduit une erreur du schéma en une phrase française."""
    regle, valeur = erreur.validator, erreur.instance
    if regle == "required":
        manquants = [c for c in erreur.validator_value if c not in valeur]
        return f"champ obligatoire manquant : {', '.join(manquants)}"
    if regle == "additionalProperties":
        return f"champ inconnu : {erreur.message.split(chr(39))[1]}"
    if regle in ("enum", "const"):
        return f"valeur « {valeur} » non autorisée ; valeurs possibles : {', '.join(map(str, erreur.validator_value))}"
    if regle == "type":
        return f"type incorrect (attendu : {erreur.validator_value})"
    if regle in ("minLength", "minItems"):
        return "ne doit pas être vide"
    if regle == "pattern":
        return f"« {valeur} » n'a pas le bon format"
    return erreur.message


def erreurs_schema(document, chemin_schema):
    """Vérifie un document avec un schéma JSON et renvoie les erreurs en français."""
    schema = lire_json(chemin_schema)
    validateur = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)
    erreurs = sorted(validateur.iter_errors(document), key=lambda e: list(map(str, e.absolute_path)))
    return [f"{lieu_erreur(e)} : {message_erreur(e)}" for e in erreurs]


def references_projet(manifeste):
    """Rassemble les noms autorisés : zones, palette, tons et ressources."""
    tableau, voix = lire_config("tableau"), lire_config("voix")
    return {
        "zones": set(tableau["zones"]),
        "palette": set(tableau["palette"]),
        "tons": set(voix["tons"]),
        "ressources": {r["id"] for r in manifeste["ressources"]},
    }


def ressources_absentes(manifeste):
    """Renvoie les ressources du manifeste dont le fichier n'est pas encore fourni."""
    dossier = chemin_projet("contenu") / "ressources"
    return {r["id"] for r in manifeste["ressources"] if not (dossier / r["fichier"]).exists()}


def valider(chemin_partition):
    """Vérifie une partition et renvoie (erreurs, avertissements)."""
    schemas, contenu = chemin_projet("schemas"), chemin_projet("contenu")
    manifeste = lire_json(contenu / "manifeste.json")
    erreurs = erreurs_schema(manifeste, schemas / "manifeste.schema.json")
    erreurs = [f"manifeste, {e}" for e in erreurs]
    partition = lire_json(chemin_partition)
    erreurs += erreurs_schema(partition, schemas / "partition.schema.json")
    if erreurs:
        return erreurs, []
    erreurs += erreurs_partition(partition, references_projet(manifeste))
    return erreurs, avertissements_partition(partition, ressources_absentes(manifeste))


def afficher(titre, messages):
    """Affiche une liste de messages sous un titre."""
    if messages:
        print(f"{titre} ({len(messages)}) :")
        for message in messages:
            print(f"- {message}")


def principal(arguments):
    """Lit le chemin donné en ligne de commande, vérifie la partition, affiche le résultat."""
    if len(arguments) != 1:
        print("Utilisation : python -m outils.valider_partition sorties/valide/partie_1.json")
        return 2
    chemin = Path(arguments[0])
    chemin = chemin if chemin.is_absolute() else Path.cwd() / chemin
    try:
        erreurs, avertissements = valider(chemin)
    except (OSError, json.JSONDecodeError) as erreur:
        print(f"Lecture impossible : {erreur}")
        return 1
    afficher("Erreurs", erreurs)
    afficher("Avertissements", avertissements)
    nom = chemin.relative_to(RACINE) if chemin.is_relative_to(RACINE) else chemin
    print(f"{nom} : {'NON VALIDE' if erreurs else 'valide'}.")
    return 1 if erreurs else 0


if __name__ == "__main__":
    sys.exit(principal(sys.argv[1:]))
