"""
Rôle : calculer l'instant debut_s de chaque action d'un beat, à partir de son ancre dans texte_dit.
Reçoit : un beat (texte_dit, duree_s, actions) et, si le fournisseur les donne, les temps des mots.
Produit : le beat avec debut_s rempli pour chaque action ancrée.
Utilisé par : outils/generer_audio.py.
Sans temps des mots : estimation proportionnelle au nombre de caractères qui précèdent l'ancre.
"""


def positions_des_ancres(beat):
    """Renvoie la position (en caractères) de chaque ancre, en cherchant après l'ancre précédente."""
    positions, depart = [], 0
    for action in beat["actions"]:
        if "ancre" not in action:
            positions.append(None)
            continue
        trouve = beat["texte_dit"].find(action["ancre"], depart)
        positions.append(trouve if trouve >= 0 else None)
        if trouve >= 0:
            depart = trouve
    return positions


def instant(position, beat, temps_mots):
    """Instant où la position est prononcée : temps réel si connu, sinon estimation proportionnelle."""
    if temps_mots:
        avant = [t for (indice, t) in temps_mots if indice <= position]
        return avant[-1] if avant else 0.0
    return beat["duree_s"] * position / len(beat["texte_dit"])


def calculer_debuts(beat, temps_mots=None):
    """Remplit debut_s pour chaque action ancrée du beat (arrondi au centième de seconde)."""
    for action, position in zip(beat["actions"], positions_des_ancres(beat)):
        if position is not None:
            action["debut_s"] = round(instant(position, beat, temps_mots), 2)
    return beat
