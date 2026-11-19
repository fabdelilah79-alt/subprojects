"""
Rôle : voix Gemini (Google) : produit l'audio d'un texte avec Gemini 3.8 Flash TTS.
Reçoit : le texte, la consigne de jeu (style + ton), les réglages « gemini » de config/voix.json, le chemin du fichier,
         l'usage (« cours » ou « repondeur », qui choisit le modèle).
Produit : un fichier WAV (24 kHz, 16 bits, mono) et sa durée ; pas de temps des mots (Gemini ne les donne pas).
Utilisé par : serveur/voix/synthese.py, quand « fournisseur » vaut « gemini ».
Vérifié sur un vrai appel (13/11/2026) : le modèle lit à voix haute toute consigne placée avant le texte, et refuse
l'instruction système ; config/voix.json n'envoie donc que le texte (« gabarit_demande » : « {texte} »), et le ton n'est
pas transmis à la voix. Clé gratuite : 10 demandes par jour et par modèle.
"""
import threading
import wave

from serveur.cles import exiger

_client = None
_verrou = threading.Lock()  # les audios sont produits par plusieurs fils à la fois : un seul client


def client():
    """Crée (une seule fois) le client Gemini ; il lit la clé GEMINI_API_KEY."""
    global _client
    with _verrou:  # sans verrou, chaque fil créait son client et les clients remplacés se fermaient en plein envoi
        if _client is None:
            exiger("GEMINI_API_KEY")
            from google import genai
            _client = genai.Client()
    return _client


def definir_client(remplacant):
    """Remplace le client (pour les tests, qui n'appellent jamais la vraie API)."""
    global _client
    _client = remplacant


def configuration(reglages):
    """Prépare la demande d'audio : une seule voix, choisie dans config/voix.json."""
    from google.genai import types
    voix = types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=reglages["voix"]))
    return types.GenerateContentConfig(response_modalities=["AUDIO"], speech_config=types.SpeechConfig(voice_config=voix))


def produire(texte, consigne, reglages, chemin, usage="cours"):
    """Demande l'audio à Gemini, l'écrit en WAV et renvoie (durée, temps des mots = None)."""
    modele = reglages["modele_cours"] if usage == "cours" else reglages["modele_repondeur"]
    demande = reglages["gabarit_demande"].format(consigne=consigne, texte=texte)
    reponse = client().models.generate_content(model=modele, contents=demande, config=configuration(reglages))
    pcm = reponse.candidates[0].content.parts[0].inline_data.data
    frequence = reglages["frequence_hz"]
    with wave.open(str(chemin), "wb") as fichier:
        fichier.setnchannels(1)
        fichier.setsampwidth(2)
        fichier.setframerate(frequence)
        fichier.writeframes(pcm)
    return round(len(pcm) / 2 / frequence, 3), None
