"""
Rôle : assembler la partition d'une partie à partir des réponses des quatre agents (plan, voix, écriture, architecture).
Reçoit : le numéro de la partie, le plan pédagogique, les beats (voix), les écrits (écriture), la mise en place (architecture).
Produit : une partition au format de schemas/partition.schema.json (sans audio : il est ajouté ensuite)
         et la liste des écrits qui visent un beat inexistant.
Utilisé par : serveur/pipeline/orchestrateur.py.
Les agents ne produisent jamais la partition eux-mêmes : c'est le code qui la construit, toujours de la même façon.
"""
import hashlib
from datetime import date

from serveur.configuration import chemin_projet, lire_config

ZONE_PAR_STYLE = {"titre": "titre", "a_retenir": "a_retenir"}


def valeur_parametre(texte):
    """Convertit la valeur d'un paramètre de schéma : liste si « ; », nombre si c'est un nombre, texte sinon."""
    if ";" in texte:
        return [valeur_parametre(morceau.strip()) for morceau in texte.split(";")]
    try:
        nombre = float(texte)
    except ValueError:
        return texte
    return int(nombre) if nombre.is_integer() else nombre


def action_ecrit(ecrit, zone):
    """Transforme un écrit de l'agent écriture en action de partition, placée dans sa zone."""
    action = {cle: valeur for cle, valeur in ecrit.items() if cle != "parametres"}
    action["zone"] = zone
    if ecrit["type"] == "dessiner":
        action["parametres"] = {p["nom"]: valeur_parametre(p["valeur"]) for p in ecrit["parametres"]}
    return action


def action_media(media):
    """Transforme un média choisi par l'agent architecture en action de partition."""
    action = {"type": "media", "ancre": media["ancre"], "ressource": media["ressource"],
              "consigne": media["consigne"], "plein_ecran": media["plein_ecran"]}
    if media["attendre_clic"]:
        action["attendre"] = "clic_termine"
    return action


def action_prediction(plan, voix, ancre):
    """Construit la prédiction : question et choix du plan, réactions orales de l'agent voix."""
    question = plan["prediction"]
    branches = [{"choix": b["choix"], "texte_dit": b["texte_dit"], "ton": b["ton"]} for b in voix["branches"]]
    return {"type": "prediction", "ancre": ancre, "question": question["question"],
            "choix": [dict(c) for c in question["choix"]], "justifier": True, "branches": branches}


def ranger(beat):
    """Range les actions d'un beat dans l'ordre où leurs ancres sont prononcées (sans ancre : en premier)."""
    def position(action):
        if "ancre" not in action:
            return -1
        trouve = beat["texte_dit"].find(action["ancre"])
        return trouve if trouve >= 0 else len(beat["texte_dit"])
    beat["actions"].sort(key=position)


def actions_par_beat(plan, voix, ecriture, architecture):
    """Rassemble, pour chaque beat, ses écrits placés, ses médias et la prédiction ; signale les beats inconnus."""
    zones = {(p["beat_id"], p["action_index"]): p["zone"] for p in architecture["placements"]}
    actions, remarques = {beat["id"]: [] for beat in voix["beats"]}, []

    def ajouter(beat_id, action, origine):
        if beat_id in actions:
            actions[beat_id].append(action)
        else:
            remarques.append(f"{origine} : le beat « {beat_id} » n'existe pas dans le texte de l'agent voix")
    for beat in ecriture["beats"]:
        for index, ecrit in enumerate(beat["actions"]):
            zone = zones.get((beat["id"], index), ZONE_PAR_STYLE.get(ecrit.get("style"), "gauche"))
            ajouter(beat["id"], action_ecrit(ecrit, zone), "écriture")
    for media in architecture["medias"]:
        ajouter(media["beat_id"], action_media(media), "architecture (média)")
    place = architecture["prediction"]
    ajouter(place["beat_id"], action_prediction(plan, voix, place["ancre"]), "architecture (prédiction)")
    return actions, remarques


def empreinte_prompts():
    """Calcule une empreinte courte des fichiers de prompts/, pour savoir quelle version a servi."""
    somme = hashlib.sha256()
    for fichier in sorted(chemin_projet("prompts").glob("*.md")):
        somme.update(fichier.read_bytes())
    return somme.hexdigest()[:12]


def generation(plan):
    """Renseigne la traçabilité : source, date, modèles, empreinte des prompts, objectifs officiels traités."""
    agents = lire_config("modeles")["agents"]
    modeles = {nom: agents[nom]["modele"] for nom in ("pedagogique", "voix", "ecriture", "architecture", "chef")}
    return {"source": "agents", "date": date.today().isoformat(), "modeles": modeles,
            "empreinte_prompts": empreinte_prompts(), "relu_par_enseignant": False,
            "objectifs_officiels": plan["objectifs_officiels"]}


def assembler(numero, plan, voix, ecriture, architecture):
    """Construit la partition d'une partie (un onglet par partie) ; renvoie (partition, remarques)."""
    actions, remarques = actions_par_beat(plan, voix, ecriture, architecture)
    beats = []
    for beat in voix["beats"]:
        nouveau = {cle: beat[cle] for cle in ("id", "phase", "texte_dit", "ton")}
        nouveau["actions"] = actions.get(beat["id"], [])
        ranger(nouveau)
        beats.append(nouveau)
    beats[0]["actions"].insert(0, {"type": "nouveau_tableau", "titre": architecture["titre_tableau"]})
    partition = {"numero": numero, "tableau": numero, "titre": plan["titre"], "generation": generation(plan), "beats": beats}
    return partition, remarques
