"""
Rôle : ce que tous les agents partagent : le contexte stable (mis en cache) et la façon d'appeler un agent.
Reçoit : le nom de l'agent, les données à lui transmettre (dictionnaire) et des corrections éventuelles.
Produit : la réponse de l'agent (validée par son schéma) et le compte rendu de l'appel.
Utilisé par : les six fichiers d'agents de serveur/agents/.
Le contexte stable est identique d'un appel à l'autre (même texte, même ordre) : c'est ce qui permet le cache.
"""
import json
from functools import lru_cache

from serveur.agents.appel_ia import appeler
from serveur.configuration import chemin_projet

CHAMPS_GENERES = {"audio", "duree_s", "debut_s"}


def lire_texte(chemin):
    """Lit un fichier texte en UTF-8."""
    return chemin.read_text(encoding="utf-8")


def partition_modele():
    """La partition modèle (partie 1 validée), sans les champs produits par le code (audio, durées, instants)."""
    def nettoyer(valeur):
        if isinstance(valeur, dict):
            return {c: nettoyer(v) for c, v in valeur.items() if c not in CHAMPS_GENERES}
        return [nettoyer(v) for v in valeur] if isinstance(valeur, list) else valeur
    modele = json.loads(lire_texte(chemin_projet("parties_validees") / "partie_1.json"))
    return json.dumps(nettoyer(modele), ensure_ascii=False, sort_keys=True)


@lru_cache(maxsize=1)
def contexte_stable():
    """Assemble le contexte commun : règles, cours, orientations, manifeste, partition modèle."""
    contenu = chemin_projet("contenu")
    orientations = [lire_texte(f) for f in sorted((contenu / "orientations").glob("*")) if f.suffix in (".md", ".txt")]
    morceaux = [
        lire_texte(chemin_projet("prompts") / "commun.md"),
        "# Le cours\n\n" + "\n\n".join(lire_texte(f) for f in sorted((contenu / "cours").glob("*.md"))),
        "# Orientations pédagogiques\n\n" + ("\n\n".join(orientations) or "(aucun extrait fourni)"),
        "# Manifeste des ressources\n\n" + json.dumps(json.loads(lire_texte(contenu / "manifeste.json")), ensure_ascii=False, sort_keys=True),
        "# Partition modèle (exemple validé par l'enseignant)\n\n" + partition_modele(),
    ]
    return "\n\n".join(morceaux)


def lire_schema(nom):
    """Lit le schéma JSON de la réponse attendue d'un agent."""
    dossier = chemin_projet("schemas")
    chemin = dossier / f"{nom}.schema.json" if nom == "plan_pedagogique" else dossier / "agents" / f"{nom}.schema.json"
    return json.loads(lire_texte(chemin))


def appeler_agent(agent, donnees, corrections=(), schema=None):
    """Appelle un agent avec ses données (en JSON) et, s'il y en a, les corrections demandées par le chef."""
    prompt = lire_texte(chemin_projet("prompts") / f"{agent}.md")
    consigne = "Données :\n" + json.dumps(donnees, ensure_ascii=False, indent=1)
    if corrections:
        consigne += "\n\nCorrections demandées par le relecteur (à appliquer en priorité) :\n- " + "\n- ".join(corrections)
    return appeler(agent, (contexte_stable(), prompt), consigne, lire_schema(schema or agent))
