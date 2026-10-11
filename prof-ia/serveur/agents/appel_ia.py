"""
Rôle : seul fichier qui parle à l'API Claude (Anthropic).
Reçoit : le nom de l'agent, le contexte stable (mis en cache), son prompt, sa consigne et le schéma JSON attendu.
Produit : la réponse de l'agent (dictionnaire validé par le schéma) et un compte rendu (durée, jetons, coût).
Utilisé par : serveur/agents/commun.py (donc par tous les agents).
Réglages dans config/modeles.json : modèle, effort, longueur maximale, repli en cas de refus, prix.
"""
import json
import time

from jsonschema import Draft202012Validator

from serveur.cles import CleAbsente, exiger
from serveur.configuration import lire_config

_client = None


class ErreurIA(Exception):
    """Un agent n'a pas pu répondre correctement (clé absente, refus, réponse invalide, réseau)."""


def client():
    """Crée (une seule fois) le client Anthropic ; il lit la clé ANTHROPIC_API_KEY."""
    global _client
    if _client is None:
        exiger("ANTHROPIC_API_KEY")
        import anthropic
        _client = anthropic.Anthropic()
    return _client


def definir_client(remplacant):
    """Remplace le client (pour les tests, qui n'appellent jamais la vraie API)."""
    global _client
    _client = remplacant


def parametres(agent, systeme, consigne, schema):
    """Prépare la requête : contexte stable en cache, prompt de l'agent, sortie structurée, effort, repli."""
    reglages = lire_config("modeles")
    reglage = reglages["agents"][agent]
    envoye = {cle: valeur for cle, valeur in schema.items() if cle not in ("$schema", "title")}
    requete = {
        "model": reglage["modele"],
        "max_tokens": reglage["max_tokens"],
        "system": [{"type": "text", "text": systeme[0], "cache_control": {"type": "ephemeral"}},
                   {"type": "text", "text": systeme[1]}],
        "messages": [{"role": "user", "content": consigne}],
        "output_config": {"format": {"type": "json_schema", "schema": envoye}},
    }
    if "effort" in reglage:
        requete["output_config"]["effort"] = reglage["effort"]
    if reglage.get("repli"):
        requete.update(betas=[reglages["beta_repli"]], fallbacks="default")
    return requete


def lire_reponse(message, schema):
    """Vérifie la fin de la réponse, extrait le JSON et le valide ; lève ErreurIA sinon."""
    if message.stop_reason == "refusal":
        raison = getattr(message.stop_details, "category", None) if message.stop_details else None
        raise ErreurIA(f"Refus du modèle (catégorie : {raison}), même après le repli.")
    if message.stop_reason == "max_tokens":
        raise ErreurIA("Réponse coupée : augmentez max_tokens dans config/modeles.json.")
    texte = next(bloc.text for bloc in message.content if bloc.type == "text")
    donnees = json.loads(texte)
    erreurs = [e.message for e in Draft202012Validator(schema).iter_errors(donnees)]
    if erreurs:
        raise ErreurIA(f"Réponse hors schéma : {erreurs[:3]}")
    return donnees


def compte_rendu(agent, message, debut):
    """Calcule la durée, les jetons et le coût estimé d'un appel."""
    usage, reglages = message.usage, lire_config("modeles")
    prix = reglages["prix_par_million_de_jetons"].get(message.model, reglages["prix_par_million_de_jetons"][reglages["agents"][agent]["modele"]])
    jetons = {"entree": usage.input_tokens, "sortie": usage.output_tokens,
              "cache_lecture": usage.cache_read_input_tokens or 0, "cache_ecriture": usage.cache_creation_input_tokens or 0}
    cout = sum(jetons[cle] * prix[cle] for cle in jetons) / 1_000_000
    return {"agent": agent, "modele": message.model, "duree_s": round(time.monotonic() - debut, 1), "jetons": jetons, "cout": round(cout, 4)}


def un_appel(agent, requete, schema):
    """Fait un appel (en flux, pour les longues réponses) et renvoie (réponse, compte rendu)."""
    debut = time.monotonic()
    with client().beta.messages.stream(**requete) as flux:
        message = flux.get_final_message()
    return lire_reponse(message, schema), compte_rendu(agent, message, debut)


def appeler(agent, systeme, consigne, schema):
    """Appelle l'agent ; en cas d'erreur passagère ou de réponse invalide, réessaie (nombre limité)."""
    import anthropic
    reglages = lire_config("modeles")
    requete = parametres(agent, systeme, consigne, schema)
    derniere = None
    for essai in range(reglages["nouvelles_tentatives_max"] + 1):
        try:
            return un_appel(agent, requete, schema)
        except CleAbsente as erreur:
            raise ErreurIA(str(erreur)) from erreur
        except (anthropic.AuthenticationError, anthropic.PermissionDeniedError) as erreur:
            raise ErreurIA(f"Clé ANTHROPIC_API_KEY refusée : {erreur}") from erreur
        except (anthropic.BadRequestError, anthropic.NotFoundError) as erreur:
            raise ErreurIA(f"Requête refusée par l'API (modèle ou paramètre) : {erreur}") from erreur
        except (ErreurIA, json.JSONDecodeError, anthropic.APIConnectionError, anthropic.APIStatusError) as erreur:
            derniere = erreur
            if isinstance(erreur, ErreurIA) and str(erreur).startswith("Refus"):
                break
            time.sleep(reglages["attente_entre_tentatives_s"] * (essai + 1))
    raise ErreurIA(f"Agent {agent} : échec après plusieurs essais ({derniere}).")
