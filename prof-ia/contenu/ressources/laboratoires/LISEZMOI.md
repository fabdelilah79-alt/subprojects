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
| tc_meca1_a2_gravitation.html | A2 : mouvement de la Terre autour du Soleil, de la Lune autour de la Terre | O2 | Observe une année (phases, nouvelles lunes), arrête le temps avec le bouton « Pause » et pose les vecteurs-forces F_S/T, F_T/S, F_T/L (actions réciproques). Puis **découvre la loi** avec trois sondes : F proportionnelle à m, à M (Terre / Lune), à 1/d². Constate que F·d²/(m·M) vaut toujours la constante G = 6,67 × 10⁻¹¹ (donnée, jamais modifiée), puis calcule F Terre-Lune. |
| tc_meca1_a3_force_pressante.html | A3 : expériences mettant en évidence la force pressante | O4, O5, O6 | Brique sur la mousse (3 faces, puis 2 briques), mesure de l'enfoncement au réglet, P = F/S au tableur ; classement des actions sur le tableau magnétique ; capsule manométrique dans l'eau (Δh = f(h), orientation) ; baromètre en hPa, bar et cmHg. |
| tc_meca1_o3_poids.html | (aucune activité dans la fiche : complément) | O3 | Masses marquées au dynamomètre, P = f(m), g ≈ 9,8 N/kg, masse d'un caillou. |
| tc_meca1_o3_altitude.html | (aucune activité dans la fiche : complément) | O3 | Sonde de 1000 kg de 0 à 36 000 km d'altitude : F = f(h), puis F = f(1/(R+h)²), **découvre** g = g0·R²/(R+h)², ISS. |

Les deux simulations « o3 » sont des propositions : l'objectif O3 de la fiche n'a pas d'activité associée.

## Chapitre tronc commun « Le mouvement » (fiche tronc_commun/meca2_mouvement)

Matériel commun aux activités 2, 3 et 4 : **table à coussin d'air** vue en perspective, mobile autoporteur
lancé d'un geste du doigt, **éclateur** (τ = 20, 40 ou 60 ms) qui marque un point toutes les τ sur la feuille,
feuille d'enregistrement que l'on prend en main (points numérotés M0, M1...), **transparent millimétré**,
**règle** qui pivote, **flèches-vecteurs** dont on tire la pointe (échelle imprimée sur la feuille).

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_meca2_a1_relativite.html | A1 : exemples de la vie courante sur la relativité du mouvement | O1 | Dans une rue, un cycliste passe. Avec la caméra fixe (référentiel terrestre), le stroboscope montre la valve qui décrit des arches (cycloïde) ; en touchant la caméra du porte-bagages (référentiel du vélo), la même valve décrit un cercle et le casque reste immobile. Bouton « Pause ». Choix du référentiel terrestre ou géocentrique. |
| tc_meca2_a2_repere.html | A2 : décrire le mouvement d'un point par rapport à un référentiel (repère d'espace et de temps) | O1, O4 | Enregistre un lancer, pose l'origine du transparent millimétré sur M0, relève t, x, y de M0 à M6 au tableur, trace la trajectoire, répond sur le choix du repère et de l'origine des dates. |
| tc_meca2_a3_vitesse.html | A3 : déterminer expérimentalement une vitesse instantanée | O2, O3, O4 | Table inclinée : mesure M2M4 à la règle, vitesse moyenne ; tableau vi = Mi-1Mi+1 / 2τ pour i = 1 à 8, courbe v = f(t) ; trace les vecteurs v3 et v7 ; conversions km/h ↔ m/s. |
| tc_meca2_a4_mru_mcu.html | A4 : mettre en évidence les caractéristiques du MRU et du MCU | O4, O5, O6 | Mission MRU : lancer libre, x = M0Mi au tableur, droite x = v·t, utilisation de l'équation horaire (distance, durée). Mission MCU : accroche le fil au clou, enregistre, vérifie que Mi-1Mi+1 est constant, trace v2, v6 et v10 tangents au cercle ; la Lune et les satellites. |

Les vérifications lisent l'enregistrement **réellement obtenu** par l'élève : chaque lancer donne d'autres
valeurs attendues. Si l'élève reprend le mobile en main pendant l'enregistrement, la feuille repart de zéro.

## Chapitre tronc commun « Principe d'inertie » (fiche tronc_commun/meca3_inertie)

Objectif principal de la fiche : dépasser la conception « une force est nécessaire pour entretenir un mouvement
rectiligne uniforme ». La table à coussin d'air reçoit une **soufflerie** : sans air, le palet frotte et s'arrête vite ;
avec l'air, il glisse sans ralentir.

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_meca3_a1_actions.html | A1 : aimant approché d'une bille en mouvement, bille heurtant un obstacle, palets sur table à coussin d'air | O2 | Lâche une bille d'acier depuis une gouttière ; une photographie à pose multiple montre une droite (léger ralentissement dû aux frottements), une courbe quand il pose l'aimant près du trajet (action à distance), un rebond sur la cale en bois (action de contact). Puis lance le palet sans air (il s'arrête), avec l'air (il glisse) : poids et action de l'air se compensent, le palet est pseudo-isolé. |
| tc_meca3_a2_principe.html | A2 : vérification expérimentale du principe d'inertie | O1, O2 | Palet posé avec l'air : il reste immobile. Palet lancé : distances MiMi+1 mesurées à la règle au tableur, toutes égales (mouvement rectiligne uniforme), énoncé du principe. Table inclinée : actions non compensées, mouvement non uniforme. Sonde spatiale isolée. |
| tc_meca3_a3_centre_inertie.html | A3 : centre d'inertie, mouvement d'ensemble et mouvement propre ; barycentre de deux palets solidaires | O3, O4, O5 | Deux palets de 400 g et 200 g reliés par une tige, lancés en tournant : les traces A et B sont des courbes. Sur la feuille, un curseur vert glisse le long de A0B0 et place une croix au même point de chaque segment AiBi : l'élève cherche où les croix sont alignées et régulières (G), mesure GA et GB, découvre mA·GA = mB·GB. Puis colle une gommette au centre d'inertie d'une tige, d'une barre, d'un disque et d'une sphère ; exercice sur la relation barycentrique. |

## Modifier ou ajouter une simulation

Les sources sont dans `sources/<nom>/` : `page.html` (liste des scripts), un fichier par appareil, et
`simulation.js` (les missions : consignes, vérifications, questions). Les outils communs sont dans `commun/`.

Après une modification, refaites les fichiers autonomes :

```
python -m outils.assembler_laboratoire            (toutes les simulations)
python -m outils.assembler_laboratoire tc_meca1_a3_force_pressante
```

Pour essayer pendant l'écriture, ouvrez directement `sources/<nom>/page.html` dans le navigateur.

## Inscription au manifeste

Chaque simulation a sa fiche dans `contenu/manifeste.json` : chapitre (niveau/chapitre), activité de la fiche officielle,
objectifs, missions (titre, ce que fait l'élève, conclusion), durée estimée. Les agents ne reçoivent que les ressources
du chapitre du cours choisi dans `config/application.json`. Un test vérifie que chaque simulation de `sources/` est inscrite.

## Ce que la simulation envoie à la page du professeur

Quand elle est ouverte dans le cadre des médias, la simulation envoie (postMessage) :
`laboratoire_ouvert`, `etape_reussie`, `reponse` (avec juste / faux), `mission_terminee` (avec la durée),
`laboratoire_termine`. Ces messages ne sont pas encore enregistrés par le journal de recherche.
