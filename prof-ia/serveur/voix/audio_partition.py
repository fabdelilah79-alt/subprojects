"""
Rôle : donner sa voix à toute une partition : audio de chaque beat et de chaque réaction, puis instants debut_s.
Reçoit : une partition (dictionnaire) et le nombre d'audios à produire en même temps (config/application.json).
Produit : la partition complétée (audio, duree_s, debut_s) et un bilan (caractères, débits anormaux).
Utilisé par : outils/generer_audio.py et serveur/pipeline/orchestrateur.py.
"""
from concurrent.futures import ThreadPoolExecutor

from serveur.configuration import lire_config
from serveur.voix.ancrage import calculer_debuts
from serveur.voix.synthese import synthetiser


def textes_a_dire(partition):
    """Liste tout ce qui est dit : chaque beat et chaque réaction de prédiction."""
    elements = []
    for beat in partition["beats"]:
        elements.append(beat)
        for action in beat["actions"]:
            elements.extend(action.get("branches", []))
    return elements


def completer(partition):
    """Produit tous les audios (plusieurs à la fois), puis calcule les instants des actions."""
    elements = textes_a_dire(partition)
    nombre = lire_config("application")["generation"]["audios_en_parallele"]
    with ThreadPoolExecutor(max_workers=nombre) as equipe:
        resultats = list(equipe.map(lambda e: synthetiser(e["texte_dit"], e["ton"]), elements))
    bilan = {"caracteres": 0, "anomalies": []}
    for element, resultat in zip(elements, resultats):
        element["audio"], element["duree_s"] = resultat["audio"], resultat["duree_s"]
        element["_temps_mots"] = resultat["temps_mots"]
        bilan["caracteres"] += len(element["texte_dit"])
        if not resultat["debit_normal"]:
            bilan["anomalies"].append(element.get("id", "réaction"))
    for beat in partition["beats"]:
        calculer_debuts(beat, beat.pop("_temps_mots"))
        for action in beat["actions"]:
            for branche in action.get("branches", []):
                branche.pop("_temps_mots", None)
    partition["generation"]["fournisseur_voix"] = lire_config("voix")["fournisseur"]
    return bilan
