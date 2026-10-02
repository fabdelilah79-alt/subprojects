# Simulations interactives du cours de rotation

Chaque simulation est une page HTML autonome, au style du tableau. Elle fonctionne sans internet.

| Fichier | Id dans le manifeste | Partie | Ce que l'élève fait |
|---|---|---|---|
| grande_roue.html | grande_roue | 1 (observation) | Lance la roue, trace la trajectoire d'un point de nacelle et d'un point du bras, marque des positions successives. |
| reperage.html | reperage | 1 (explication) | Déplace G sur le cercle, change R ; lit θ (en ° et en rad) et s = R·θ. |
| coussin_air.html | coussin_air | 2 (observation) | Enregistre (τ = 40 ms), choisit la position i, lit les arcs et l'angle ; calculs de Vi, ωi, R·ωi sur demande. Rotation accélérée possible. |
| rotation_uniforme.html | rotation_uniforme | 3 (observation) | Règle ω et θ0, voit θ(t) se tracer ; équation horaire, s(t), T et f sur demande. |

## Faire appeler une simulation par le professeur

Dans une partition, ajoutez une action « media » au beat voulu :

```json
{
  "type": "media",
  "ancre": "Ouvrez la simulation",
  "ressource": "reperage",
  "plein_ecran": true,
  "consigne": "Déplacez G, puis changez R. Quel lien voyez-vous entre s, R et θ ?",
  "attendre": "clic_termine"
}
```

La simulation s'ouvre dans un cadre sur le tableau. La lecture attend que l'élève clique sur « J'ai terminé ».

## Ajouter une simulation

1. Copier une simulation existante (le .html et le .js), garder `commun/style.css` et `commun/outils.js`.
2. Ajouter sa fiche dans `contenu/manifeste.json` (id, type « simulation », fichier « animations/… »).
3. Vérifier : `python -m outils.valider_partition sorties/valide/partie_1.json`.
