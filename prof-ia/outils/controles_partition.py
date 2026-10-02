"""
Rôle : contrôles d'une partition que le schéma JSON ne peut pas faire seul.
Reçoit : une partition déjà lue, les réglages (zones, palette, tons) et le manifeste.
Produit : deux listes de messages en français : erreurs (bloquantes) et avertissements.
Utilisé par : outils/valider_partition.py.
"""
import re

# Dans texte_dit, tout doit être écrit en lettres : pas de chiffre ni de symbole.
CARACTERES_INTERDITS = re.compile(r"[0-9=+×÷/%°<>^_\\]")


def erreurs_ancres(beat):
    """Vérifie que chaque ancre est dans texte_dit, dans l'ordre des actions."""
    erreurs, position, texte = [], 0, beat["texte_dit"]
    for numero, action in enumerate(beat["actions"]):
        ancre = action.get("ancre")
        if ancre is None:
            continue
        trouve = texte.find(ancre, position)
        if trouve >= 0:
            position = trouve
        elif ancre in texte:
            erreurs.append(f"{beat['id']}, action {numero + 1} : l'ancre « {ancre} » arrive avant l'ancre précédente")
        else:
            erreurs.append(f"{beat['id']}, action {numero + 1} : l'ancre « {ancre} » n'est pas dans texte_dit")
    return erreurs


def erreurs_prediction(beat, action):
    """Vérifie qu'une prédiction a une réaction pour chaque choix, et un ton connu."""
    ids_choix = {choix["id"] for choix in action["choix"]}
    ids_branches = {branche["choix"] for branche in action["branches"]}
    erreurs = [f"{beat['id']} : aucune réaction prévue pour le choix {c}" for c in sorted(ids_choix - ids_branches)]
    erreurs += [f"{beat['id']} : réaction pour un choix inexistant ({c})" for c in sorted(ids_branches - ids_choix)]
    return erreurs


def erreurs_action(beat, numero, action, references):
    """Vérifie qu'une action utilise une zone, une couleur et une ressource qui existent."""
    lieu, erreurs = f"{beat['id']}, action {numero + 1}", []
    if "zone" in action and action["zone"] not in references["zones"]:
        erreurs.append(f"{lieu} : zone « {action['zone']} » inconnue (voir config/tableau.json)")
    if "couleur" in action and action["couleur"] not in references["palette"]:
        erreurs.append(f"{lieu} : couleur « {action['couleur']} » absente de la palette")
    if action["type"] == "media" and action["ressource"] not in references["ressources"]:
        erreurs.append(f"{lieu} : ressource « {action['ressource']} » absente de contenu/manifeste.json")
    if action["type"] == "prediction":
        erreurs += erreurs_prediction(beat, action)
        erreurs += [f"{beat['id']} : ton « {b['ton']} » inconnu" for b in action["branches"] if b["ton"] not in references["tons"]]
    return erreurs


def erreurs_beat(beat, references):
    """Rassemble les erreurs d'un beat : ton, ancres et actions."""
    erreurs = []
    if beat["ton"] not in references["tons"]:
        erreurs.append(f"{beat['id']} : ton « {beat['ton']} » inconnu (voir config/voix.json)")
    erreurs += erreurs_ancres(beat)
    for numero, action in enumerate(beat["actions"]):
        erreurs += erreurs_action(beat, numero, action, references)
    return erreurs


def erreurs_partition(partition, references):
    """Renvoie toutes les erreurs bloquantes de la partition (après le schéma)."""
    erreurs, vus = [], set()
    for beat in partition["beats"]:
        if beat["id"] in vus:
            erreurs.append(f"{beat['id']} : identifiant de beat en double")
        vus.add(beat["id"])
        erreurs += erreurs_beat(beat, references)
    return erreurs


def textes_dits(partition):
    """Renvoie (lieu, texte) pour chaque texte prononcé : beats et réactions aux prédictions."""
    for beat in partition["beats"]:
        yield beat["id"], beat["texte_dit"]
        for action in beat["actions"]:
            for branche in action.get("branches", []):
                yield f"{beat['id']}, réaction {branche['choix']}", branche["texte_dit"]


def avertissements_partition(partition, ressources_absentes):
    """Signale ce qui n'empêche pas de jouer : chiffres dits, ressources pas encore fournies."""
    avertissements = []
    for lieu, texte in textes_dits(partition):
        trouves = sorted(set(CARACTERES_INTERDITS.findall(texte)))
        if trouves:
            avertissements.append(f"{lieu} : texte_dit contient {' '.join(trouves)} ; à écrire en lettres")
    for beat in partition["beats"]:
        for action in beat["actions"]:
            if action["type"] == "media" and action["ressource"] in ressources_absentes:
                avertissements.append(f"{beat['id']} : le fichier de « {action['ressource']} » n'est pas encore dans contenu/ressources/")
    return avertissements
