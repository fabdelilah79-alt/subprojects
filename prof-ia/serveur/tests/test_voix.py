"""
Rôle : vérifier la chaîne de la voix : voix d'essai, cache, contrôle du débit et ancrage.
Reçoit : les modules de serveur/voix/.
Produit : des tests pytest (réussis ou échoués).
Utilisé par : la commande « python -m pytest ».
"""
import wave

from serveur.voix import cache_audio
from serveur.voix.ancrage import calculer_debuts
from serveur.voix.synthese import synthetiser


def test_voix_essai_et_cache():
    """La voix d'essai produit un WAV de la bonne durée ; le second appel vient du cache."""
    premier = synthetiser("Un solide est en rotation autour d'un axe fixe.", "neutre")
    chemin = cache_audio.dossier() / premier["audio"]
    with wave.open(str(chemin)) as fichier:
        duree = fichier.getnframes() / fichier.getframerate()
    assert abs(duree - premier["duree_s"]) < 0.01
    assert premier["debit_normal"]
    assert synthetiser("Un solide est en rotation autour d'un axe fixe.", "neutre") == premier


def test_ancrage_proportionnel():
    """Sans temps des mots, une ancre au milieu du texte démarre au milieu de la durée."""
    beat = {"texte_dit": "abcdefghij", "duree_s": 10.0, "actions": [
        {"type": "ecrire", "ancre": "a"}, {"type": "ecrire", "ancre": "f"}, {"type": "nouveau_tableau"}]}
    calculer_debuts(beat)
    assert [a.get("debut_s") for a in beat["actions"]] == [0.0, 5.0, None]


def test_ancrage_avec_temps_des_mots():
    """Avec les temps des mots, l'ancre prend l'instant réel du mot."""
    beat = {"texte_dit": "un deux trois", "duree_s": 3.0, "actions": [{"type": "ecrire", "ancre": "trois"}]}
    calculer_debuts(beat, [(0, 0.0), (3, 0.8), (8, 2.1)])
    assert beat["actions"][0]["debut_s"] == 2.1
