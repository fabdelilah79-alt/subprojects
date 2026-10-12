# Laboratoires virtuels

Une simulation par activité du programme officiel. Chaque simulation est **un seul fichier HTML autonome**
(styles, scripts et police intégrés) : il s'ouvre sans serveur ni internet, d'un double-clic.

Architecture (exigence R4) : scène fixe de **1024 × 640 px**, mise à l'échelle de l'espace disponible.
La mise en page est donc identique sur un téléphone, un portable ou un tableau interactif. Sur écran tactile,
on zoome à deux doigts jusqu'à **5×** ; un double-tap revient à la vue entière.

Pas de panneaux : seulement le laboratoire (ou l'espace, quand les objets étudiés sont des astres).
- **Gestes réalistes** : glisser-déposer, l'objet se soulève et son ombre s'éloigne ; il retombe s'il est lâché dans le vide.
  Un toucher bref tourne un objet (brique, capsule).
- **Tablette** posée sur la paillasse : un toucher la prend en main. Elle contient un tableur (formules
  `=B2/A2`, `=1/A2^2`, recopie vers le bas, écriture scientifique `6,67E-11`) et un graphique (courbe qui se
  dessine, modélisation `y = a·x` ou `y = a·x + b`).
- **Carnet de laboratoire** : les missions, leurs étapes (cochées automatiquement), les questions, le tampon
  « Mission accomplie ». Un **pense-bête** au mur rappelle l'étape en cours.
- Les étapes sont vérifiées à partir de ce que l'élève a **réellement mesuré** : une valeur inventée est refusée.

## Chapitre tronc commun « Exemples d'actions mécaniques » (fiche tronc_commun/meca1_interactions)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_meca1_a1_echelle.html | A1 : documents sur l'Univers, comparer les dimensions | O1 | Convertit 8 longueurs en mètre au tableur, place les étiquettes aimantées sur la frise des puissances de dix, compare (Terre-Soleil / Terre-Lune, ordres de grandeur, durée de la lumière). |
| tc_meca1_a2_gravitation.html | A2 : mouvement de la Terre autour du Soleil, de la Lune autour de la Terre | O2 | Observe une année (phases, nouvelles lunes), pose les vecteurs-forces F_S/T, F_T/S, F_T/L (actions réciproques). Puis **découvre la loi** avec trois sondes : F proportionnelle à m, à M (Terre / Lune), à 1/d². Constate que F·d²/(m·M) vaut toujours la constante G = 6,67 × 10⁻¹¹ (donnée, jamais modifiée), puis calcule F Terre-Lune. |
| tc_meca1_a3_force_pressante.html | A3 : expériences mettant en évidence la force pressante | O4, O5, O6 | Brique sur la mousse (3 faces, puis 2 briques), mesure de l'enfoncement au réglet, P = F/S au tableur ; classement des actions sur le tableau magnétique ; capsule manométrique dans l'eau (Δh = f(h), orientation) ; baromètre en hPa, bar et cmHg. |
| tc_meca1_o3_poids.html | (aucune activité dans la fiche : complément) | O3 | Masses marquées au dynamomètre, P = f(m), g ≈ 9,8 N/kg, masse d'un caillou. |
| tc_meca1_o3_altitude.html | (aucune activité dans la fiche : complément) | O3 | Sonde de 1000 kg de 0 à 36 000 km d'altitude : F = f(h), puis F = f(1/(R+h)²), **découvre** g = g0·R²/(R+h)², ISS. |

Les deux simulations « o3 » sont des propositions : l'objectif O3 de la fiche n'a pas d'activité associée.

## Modifier ou ajouter une simulation

Les sources sont dans `sources/<nom>/` : `page.html` (liste des scripts), un fichier par appareil, et
`simulation.js` (les missions : consignes, vérifications, questions). Les outils communs sont dans `commun/`.

Après une modification, refaites les fichiers autonomes :

```
python -m outils.assembler_laboratoire            (toutes les simulations)
python -m outils.assembler_laboratoire tc_meca1_a3_force_pressante
```

Pour essayer pendant l'écriture, ouvrez directement `sources/<nom>/page.html` dans le navigateur.

## Ce que la simulation envoie à la page du professeur

Quand elle est ouverte dans le cadre des médias, la simulation envoie (postMessage) :
`laboratoire_ouvert`, `etape_reussie`, `reponse` (avec juste / faux), `mission_terminee` (avec la durée),
`laboratoire_termine`. Ces messages ne sont pas encore enregistrés par le journal de recherche.
