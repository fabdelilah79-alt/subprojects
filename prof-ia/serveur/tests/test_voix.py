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


class FauxGemini:
    """Faux client Gemini : renvoie 1 seconde de silence au format PCM 24 kHz, sans appel réseau."""

    def __init__(self):
        self.models = self
        self.demandes = []

    def generate_content(self, model, contents, config):
        """Imite la réponse de l'API : candidates[0].content.parts[0].inline_data.data."""
        from types import SimpleNamespace as N
        self.demandes.append((model, contents))
        partie = N(inline_data=N(data=b"\x00\x00" * 24000))
        return N(candidates=[N(content=N(parts=[partie]))])


def test_gemini_avec_faux_client(tmp_path):
    """Le fournisseur Gemini écrit un WAV de la bonne durée et utilise le modèle demandé."""
    from serveur.configuration import lire_config
    from serveur.voix import gemini_tts
    faux = FauxGemini()
    gemini_tts.definir_client(faux)
    reglages = lire_config("voix")["gemini"]
    duree, temps = gemini_tts.produire("Bonjour.", "Voix posée.", reglages, tmp_path / "a.wav", "repondeur")
    gemini_tts.definir_client(None)
    assert (duree, temps) == (1.0, None)
    assert faux.demandes[0][0] == reglages["modele_repondeur"]
    assert "Bonjour." in faux.demandes[0][1]


def test_cle_gemini_absente(monkeypatch):
    """Sans clé Gemini, la synthèse s'arrête avec un message clair."""
    import pytest
    from serveur.voix import gemini_tts, synthese
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setattr("serveur.cles.charger_env", lambda: None)
    monkeypatch.setattr(synthese, "lire_config", lambda nom: {**__import__("serveur.configuration").configuration.lire_config(nom), "fournisseur": "gemini"})
    gemini_tts.definir_client(None)
    with pytest.raises(synthese.ErreurVoix, match="GEMINI_API_KEY"):
        synthese.synthetiser("Texte jamais dit auparavant pour ce test.", "neutre")
