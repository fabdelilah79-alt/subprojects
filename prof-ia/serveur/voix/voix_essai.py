"""
Rôle : voix d'essai, sans clé d'API : produit un fichier audio silencieux de la durée qu'aurait la parole.
Reçoit : le texte à dire, les réglages « essai » de config/voix.json et le chemin du fichier à écrire.
Produit : un fichier WAV muet et sa durée en secondes (pas de temps des mots).
Utilisé par : serveur/voix/synthese.py, tant que le fournisseur choisi est « essai ».
Sert à tester toute la chaîne (cache, ancrage, lecture synchronisée) avant d'avoir la clé Gemini.
"""
import wave


def produire(texte, reglages, chemin):
    """Écrit un WAV silencieux d'une durée proportionnelle au texte ; renvoie (durée, temps des mots)."""
    duree = len(texte) / reglages["debit_caracteres_par_s"] + reglages["marge_s"]
    frequence = reglages["frequence_hz"]
    with wave.open(str(chemin), "wb") as fichier:
        fichier.setnchannels(1)
        fichier.setsampwidth(2)
        fichier.setframerate(frequence)
        fichier.writeframes(b"\x00\x00" * int(duree * frequence))
    return round(duree, 3), None
