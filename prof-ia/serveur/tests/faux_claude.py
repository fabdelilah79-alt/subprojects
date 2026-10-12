"""
Rôle : faux client Claude pour les tests : il répond comme l'API, sans réseau ni clé, avec des réponses préparées.
Reçoit : les requêtes construites par serveur/agents/appel_ia.py.
Produit : des messages imitant l'API (stop_reason, content, usage, model) ; la liste des agents appelés.
Utilisé par : serveur/tests/test_agents.py et serveur/tests/test_questions.py.
"""
import json
from types import SimpleNamespace as N

PLAN = {
    "titre": "Vitesse angulaire et vitesse linéaire",
    "objectif": "Relier la vitesse d'un point à sa distance à l'axe.",
    "objectifs_officiels": ["O3", "O4"],
    "conceptions_visees": [{"id": "meme_vitesse_tous_points", "comment_la_traiter": "Comparer deux points du disque."}],
    "prediction": {
        "question": "Deux points d'un disque qui tourne : lequel va le plus vite ?",
        "choix": [{"id": "A", "texte": "Ils vont aussi vite.", "conception": "meme_vitesse_tous_points"},
                  {"id": "B", "texte": "Le point le plus loin de l'axe.", "conception": None}],
        "reactions": [{"choix": "A", "idee": "Inviter à observer."}, {"choix": "B", "idee": "Demander de vérifier."}],
    },
    "observation": {"ressource": "coussin_air", "consigne": "Observez les deux points.", "plein_ecran": True},
    "points_explication": ["Même angle, arcs différents.", "V égale R fois oméga."],
    "trace_ecrite": [{"type": "formule", "contenu": "V = R\\omega", "a_retenir": True}],
}

VOIX = {
    "beats": [
        {"id": "p2_b01", "phase": "prediction", "texte_dit": "Parlons maintenant de la vitesse des points.", "ton": "enthousiaste"},
        {"id": "p2_b02", "phase": "prediction", "texte_dit": "Lequel des deux points va le plus vite, à votre avis ?", "ton": "interrogatif"},
        {"id": "p2_b03", "phase": "observation", "texte_dit": "Ouvrez la simulation et observez les deux points.", "ton": "neutre"},
        {"id": "p2_b04", "phase": "explication", "texte_dit": "Les deux points tournent du même angle.", "ton": "lent_et_clair"},
        {"id": "p2_b05", "phase": "synthese", "texte_dit": "Retenez la relation V égale R fois oméga.", "ton": "lent_et_clair"},
    ],
    "branches": [{"choix": "A", "texte_dit": "Regardons cela de près.", "ton": "encourageant"},
                 {"choix": "B", "texte_dit": "Vérifions ensemble.", "ton": "encourageant"}],
}

ECRITURE = {"beats": [
    {"id": "p2_b01", "actions": [{"type": "ecrire", "ancre": "vitesse", "texte": "Vitesse d'un point", "style": "titre"}]},
    {"id": "p2_b04", "actions": [
        {"type": "dessiner", "ancre": "tournent", "element": "disque_points",
         "parametres": [{"nom": "noms", "valeur": "A;B"}, {"nom": "angle_deg", "valeur": "30"}]},
        {"type": "ecrire", "ancre": "même angle", "texte": "Même angle θ", "style": "normal"}]},
    {"id": "p2_b05", "actions": [{"type": "formule", "ancre": "relation", "latex": "V = R\\omega", "style": "a_retenir"}]},
]}

ARCHITECTURE = {
    "titre_tableau": "Vitesses",
    "placements": [{"beat_id": "p2_b04", "action_index": 0, "zone": "droite"},
                   {"beat_id": "p2_b04", "action_index": 1, "zone": "gauche"}],
    "medias": [{"beat_id": "p2_b03", "ancre": "Ouvrez", "ressource": "coussin_air", "consigne": "Observez A et B.",
                "plein_ecran": True, "attendre_clic": True}],
    "prediction": {"beat_id": "p2_b02", "ancre": "Lequel"},
}

REPONDEUR = {"reponse_orale": "Oméga est la vitesse angulaire.", "ecrit_brouillon": "ω en rad/s", "hors_programme": False}


class Flux:
    """Imite le flux de l'API : utilisable avec « with », il donne le message final."""

    def __init__(self, message):
        self.message = message

    def __enter__(self):
        return self

    def __exit__(self, *erreur):
        return False

    def get_final_message(self):
        """Renvoie le message complet."""
        return self.message


def agent_de(requete):
    """Reconnaît l'agent appelé d'après les champs obligatoires du schéma demandé."""
    champs = set(requete["output_config"]["format"]["schema"]["required"])
    for agent, marque in (("pedagogique", "objectif"), ("architecture", "placements"), ("chef", "valide"),
                          ("repondeur", "reponse_orale"), ("voix", "branches")):
        if marque in champs:
            return agent
    return "ecriture"


class FauxClaude:
    """Imite client.beta.messages.stream(...) ; avis_chef = liste des avis successifs du chef."""

    def __init__(self, avis_chef=None, fin="end_turn"):
        self.beta, self.messages = self, self
        self.appels, self.requetes, self.fin = [], [], fin
        self.avis_chef = list(avis_chef or [{"valide": True, "corrections": [], "commentaire": "Bien."}])
        self.reponses = {"pedagogique": PLAN, "voix": VOIX, "ecriture": ECRITURE,
                         "architecture": ARCHITECTURE, "repondeur": REPONDEUR}

    def avis_suivant(self):
        """Donne l'avis suivant du chef (le dernier se répète)."""
        return self.avis_chef.pop(0) if len(self.avis_chef) > 1 else self.avis_chef[0]

    def stream(self, **requete):
        """Enregistre l'appel et renvoie un flux dont le message final contient la réponse préparée."""
        agent = agent_de(requete)
        self.appels.append(agent)
        self.requetes.append(requete)
        reponse = self.reponses.get(agent) or self.avis_suivant()
        usage = N(input_tokens=100, output_tokens=50, cache_read_input_tokens=900, cache_creation_input_tokens=0)
        message = N(stop_reason=self.fin, stop_details=None, model=requete["model"], usage=usage,
                    content=[N(type="text", text=json.dumps(reponse, ensure_ascii=False))])
        return Flux(message)
