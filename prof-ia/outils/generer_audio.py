"""
Rôle : produire l'audio de chaque beat et de chaque réaction de prédiction d'une partition, puis calculer debut_s.
Reçoit : le chemin d'une partition (par exemple sorties/valide/partie_1.json).
Produit : la partition complétée (audio, duree_s, debut_s), vérifiée puis réécrite ; un résumé avec le coût estimé.
Utilisé par : l'enseignant (python -m outils.generer_audio <fichier>) ; plus tard, l'orchestrateur.
"""
import json
import sys
from pathlib import Path

from outils.valider_partition import valider
from serveur.configuration import lire_config
from serveur.voix.audio_partition import completer
from serveur.voix.synthese import ErreurVoix


def cout_estime(caracteres):
    """Coût estimé, d'après le prix par million de caractères du fournisseur (config/voix.json)."""
    reglages = lire_config("voix")
    prix = reglages[reglages["fournisseur"]].get("cout_par_million_caracteres", 0)
    return caracteres * prix / 1_000_000


def generer(chemin):
    """Complète toute la partition, la vérifie, puis l'enregistre ; renvoie le bilan."""
    partition = json.loads(chemin.read_text(encoding="utf-8"))
    bilan = completer(partition)
    chemin.write_text(json.dumps(partition, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    bilan["erreurs"], _ = valider(chemin)
    bilan["duree_totale"] = sum(beat["duree_s"] for beat in partition["beats"])
    return bilan


def principal(arguments):
    """Lit le chemin donné, génère l'audio et affiche le résumé en français."""
    if len(arguments) != 1:
        print("Utilisation : python -m outils.generer_audio sorties/valide/partie_1.json")
        return 2
    try:
        bilan = generer(Path(arguments[0]))
    except ErreurVoix as erreur:
        print(f"Voix : {erreur}")
        return 1
    print(f"Audio prêt : {bilan['caracteres']} caractères, {bilan['duree_totale']:.0f} s de parole.")
    print(f"Coût estimé : {cout_estime(bilan['caracteres']):.4f} $ (fournisseur : {lire_config('voix')['fournisseur']}).")
    if bilan["anomalies"]:
        print(f"Débit anormal, à écouter : {', '.join(bilan['anomalies'])}")
    for erreur in bilan["erreurs"]:
        print(f"- {erreur}")
    return 1 if bilan["erreurs"] else 0


if __name__ == "__main__":
    sys.exit(principal(sys.argv[1:]))
