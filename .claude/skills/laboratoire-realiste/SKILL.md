---
name: laboratoire-realiste
description: Créer, modifier ou relire une simulation de laboratoire virtuel de prof-ia (prof-ia/contenu/ressources/laboratoires) — un chapitre d'orientations à la fois, une simulation par activité de la fiche. À utiliser à chaque « continu » de l'enseignant, avant d'écrire la première ligne d'un poste ou d'une simulation, et pour relire une simulation existante (réalisme, physique, pédagogie, code, tests).
---

# Laboratoire virtuel réaliste — méthode et liste de contrôle

L'enseignant veut des simulations **réalistes et soignées dans les détails**, sans avoir à répéter ses remarques.
Cette compétence rassemble ses demandes et tout ce qui a été appris chapitre après chapitre. La suivre en entier.

## 1. Avant de coder

1. Lire `prof-ia/CLAUDE.md` (règles de code et de rapport) et la fiche du chapitre
   `prof-ia/contenu/orientations/<niveau>/<chapitre>.json` (contenus, objectifs, activités, **orientations**, hors programme).
   L'ordre des chapitres est celui de `prof-ia/contenu/orientations/index.json`.
2. Une simulation **par activité** de la fiche ; chaque mission cite ses objectifs (O1, O2…). Respecter les orientations à
   la lettre (ex. « parler de retard, pas de déphasage » ; « ne pas faire tracer les courbes des filtres » ; « laisser
   de la liberté à l'élève »).
3. Chercher ce qui existe déjà dans `commun/` (grep) et le réutiliser : table à coussin d'air (`poste_coussin_air.js`,
   éclateur, feuille, règle, `vecteurs_vitesse.js`, `surcharge.js`), circuits (`circuit.js` et composants, multimètre,
   oscilloscope, GBF, interface d'acquisition), mouvements filmés (`pointage_video.js` : caméra + portable + logiciel de
   pointage, étalonnage, origine, export vers le tableur), chimie (verrerie, réactifs), documents (`documents_mur.js`),
   tri (`tri.js`), tableur, courbe, carnet. Lire l'en-tête « Reçoit / Produit » du fichier avant de l'utiliser.
4. Choisir des **valeurs réalistes** (matériel courant d'un lycée marocain : bobine 1 000 spires, GBF 50 Ω, multimètre
   2 000 points, éclateur 20/40/60 ms…) et **vérifier la physique sur le papier** : ordres de grandeur, ce que verra
   l'élève, ce qu'il mesurera, avec quelle précision. Les nombres attendus doivent sortir de la simulation elle-même.

## 2. Réalisme visuel (liste de contrôle à passer sur chaque capture)

- Scène 1024 × 640 en perspective 2,5D (`L.boitier`, ombres `L.ombre_sol`) ; **rien ne flotte** : tout est posé sur la
  paillasse ou fixé au mur, avec son ombre ; les objets cachés derrière d'autres le sont dans le bon ordre.
- **Tout câble est branché jusqu'au bout** : cordon secteur jusqu'à une prise murale (`L.cordon_secteur`, `c.prise()`),
  toujours avec `L.cordon_secteur` (fiche enfoncée dans la prise, manchon, cordon qui entre dans le manchon) : jamais un
  trait et un rond dessinés à la main (remarque de l'enseignant : « un espace entre le fil et la prise ») ;
  câble d'un capteur jusqu'à une prise de l'appareil (remarque de l'enseignant : « le fil du capteur n'est pas branché »).
- Textes lisibles, **sans chevauchement ni débordement** : étiquettes courtes sur les supports, pas de texte sous une
  borne, une fiche, le clavier du portable, le pense-bête (haut gauche), le carnet (bas gauche) ou la tablette (bas droit).
- Les **touches doivent rester cliquables quand des fils passent dessus** : les dessiner dans `c.calque_bornes`
  (au-dessus des fils), comme les bornes.
- Appareils fidèles : afficheurs, calibres, unités, résolution et **limites réelles** (pas de 200 V~ sur le multimètre,
  saturation, dépassement « 1 »). Réglages de départ qui donnent une trace lisible (sensibilité, balayage).
- Les éléments réglables montrent leur état (cale posée sous la table, cale prise sur la paillasse estompée…).
- Unités et nombres écrits à la française (virgule, espaces fines), symboles corrects (µ, Ω, ⏚, ², indices).

## 2 bis. Dessin du matériel (remarque de l'enseignant : « pas des choses bizarres à l'œil »)

Chaque objet doit ressembler au **vrai matériel d'un laboratoire de lycée** (catalogues de fournisseurs scolaires), pas à
un pictogramme ni à une forme abstraite.
- Forme reconnaissable et **proportions réelles** (échelle commune de la scène : un chronomètre n'est pas plus grand
  qu'une potence, une masse de 100 g n'est pas un gros bloc) ; épaisseurs, volumes, arêtes visibles en 2,5D.
- Matières rendues : métal (dégradés `url(#metal)`, `url(#acier)`, `url(#laiton)`), plastique mat, bois, verre ; reflets
  légers ; pas d'aplat de couleur vive sans relief (un « rectangle rouge » n'est pas un aimant : un aimant de freinage a
  une monture, des pôles, une vis de fixation).
- Détails qui rendent l'objet crédible : vis, noix de serrage, molettes, poignées, prises femelles, plaques
  signalétiques, graduations, pieds en caoutchouc ; mais pas de surcharge.
- Chaque pièce est **tenue par quelque chose** (fixation, support, noix) et les liaisons mécaniques sont plausibles
  (un fil s'accroche à un crochet, une tige passe dans un guide, une règle est vissée sur un montant).
- **Attaches sans vide** (remarque de l'enseignant : « un petit vide entre le fil et le solide, le solide peut se séparer
  de lui ») : un fil ou un ressort part exactement du centre de l'œillet ou du crochet (constantes partagées, ex.
  `L.pieces_banc.OEILLET`), l'œillet est visible sur le fond ; un objet tenu par un appareil (dynamomètre, fil) ne doit
  pas pouvoir être déplacé seul à la main (option `deplacable: false`).
- **Relecture en gros plan** : pour chaque objet nouveau, capture recadrée et agrandie (×3) avant de l'intégrer ;
  se demander « un professeur reconnaîtrait-il cet objet au premier coup d'œil ? ». Sinon, le redessiner.
- Réutiliser les objets communs déjà validés (potence, masses marquées, boîtiers, portable, chronomètre) plutôt que d'en
  inventer d'autres.

## 3. Justesse physique

- Le modèle doit être juste dans son domaine (lois, conservation de l'énergie, régimes) ; s'il est simplifié, le dire
  dans l'en-tête et dans « Problèmes restants ».
- Méthodes numériques adaptées : méthode des trapèzes pour un LC (pas d'amortissement artificiel), régime sinusoïdal
  forcé en complexes (`circuit_sinus.js`), signaux à deux fréquences calculés par le poste (`modulation.js`)…
- Dans le test, **comparer les valeurs mesurées à la théorie** (ex. T = 14,06 ms pour 2π√(LC) ; UC/U = Q) et les donner
  dans le rapport.
- Tolérances des questions : celles d'une vraie mesure (lecture à la règle, au curseur), ni trop larges ni impossibles.

## 4. Pédagogie

- Démarche : manipuler → observer → mesurer → conclure. Consignes courtes et concrètes ; `court` pour le pense-bête ;
  `aide_geste` quand le geste n'est pas évident ; messages d'erreur qui disent quoi corriger (« Ligne 3 : en C… »).
- Vérifier par des **faits** notés par le poste (`L.missions.noter`), jamais par l'apparence.
- Conceptions de la fiche visées par les questions ; `conclusion` claire et juste (elle va au manifeste).
- Missions : `id: "x", paillasse: N, titre: "…"` sur une ligne, puis `\n    conclusion: "…"` (lu par `ajouter.py`).

## 5. Code (règles de prof-ia/CLAUDE.md)

- Fichiers ≤ 150 lignes, fonctions ≤ 30 lignes ; en-tête Rôle / Reçoit / Produit / Utilisé par ; une phrase en français
  au début de chaque fonction ; noms français sans accents ; aucune nouvelle bibliothèque.
- Structure : `sources/<id>/` (poste local, `simulation.js` en dernier) ; ce qui sert à plusieurs chapitres va dans
  `commun/`. Toute modification d'un fichier commun : **option désactivée par défaut**, **signalée** à l'enseignant,
  et **régression** (rejouer les scénarios des simulations qui l'utilisent).
- Vérifier : `python3 -m pytest -q` et `python3 -m outils.verifier_structure` (dans `prof-ia/`).

## 6. Pièges connus

- Question `nombre` : `tolerance` est un nombre ; pour une tolérance proportionnelle, `tolerance_relative`. `attendu`
  peut être une fonction des faits, **pas la tolérance**.
- Tableur : 4 colonnes (A à D), 11 lignes de données ; formules `RACINE`, `ABS`, `PI`, `COS`, `SIN`, `LN`, `EXP`, `^`.
- Courbe : `courbe.x`, `courbe.y`, `courbe.y2` (deuxième série), `courbe.n` ; modèles `"lineaire"` et `"affine"`.
- Plusieurs paillasses dans une page : le DOM contient tous les postes ; dans les tests, viser l'élément **visible**
  (`>> visible=true`, ou filtrer par `getBoundingClientRect`).
- Animations : les points de la courbe apparaissent un à un (attendre avant la capture) ; un mobile peut rebondir
  plusieurs secondes au bas d'une pente avant d'être « immobile ».
- Corrélation d'un son avec une note : comparer au sinus **et** au cosinus.
- `pages.py` régénère les pages de **tous** les identifiants de SIMS sans argument : toujours lui passer l'identifiant.
- Tests : avant de taper dans une cellule déjà remplie, `outils_test.js` sélectionne son contenu (Ctrl+A) ; l'équation
  d'une courbe se lit dans `.courbe-equation` (le fait « courbe » n'est pas noté) ; une vidéo de pointage donne
  `objet(k)` (position vraie) pour pointer juste ; `L.pointages[nom]` donne l'écran du logiciel.
- Un bouton dessiné par `L.bouton_poussoir` est large (≈ 120 px) : prévoir un boîtier assez grand pour que son titre
  ne soit pas caché.
- `L.bouton_rond`, `L.boitier` et `L.cordon_secteur` sont dans `circuit_decor.js`, absent des pages de mécanique : `pages.py`
  l'ajoute pour `b2_meca3*` (l'ajouter aussi pour un autre chapitre qui en a besoin).
- Solide en rotation filmé : `L.pointage_video(g, { …, polaire: true })` donne θ = (Ox, OM) sans saut d'un tour (origine
  sur l'axe) ; la vérification contrôle `origine_m` (position de l'origine dans le champ filmé).
- Un fil clair (#e9e2cf) disparaît devant le mur carrelé : fil tendu en gris-brun (#7d735c).

## 7. Outils (dossier `outils/` de cette compétence)

- `pages.py <id>` : écrit `sources/<id>/page.html` (scripts communs + fichiers locaux, `simulation.js` en dernier).
  Ajouter d'abord l'entrée `'<id>': (titre, rôle)` dans `SIMS` et, si besoin, la liste de scripts du domaine.
- `node lancer.js sources/<id>/page.html ./scenario.js capture.png` (depuis `outils/`) : joue un scénario Playwright,
  affiche les erreurs. Aides : `outils_test.js` (attendre, glisser, etat, tableur, repondre, mission_suivante,
  courbe_xy), `outils_circuit.js` (brancher, toucher, deplacer_fil, multimetre), `coussin_*.js` (table à coussin d'air),
  `outils_pointage.js` (pointer(page, images, { origine }) : étalonnage, origine, pointage d'après objet(k), export).
  Pour lire les faits : remplacer `Labo.missions.noter` pour copier dans `window.notes` (voir `exemple_scenario.js`).
- `python3 -m outils.assembler_laboratoire <ids>` (dans `prof-ia/`) : fichier autonome `laboratoires/<id>.html`.
- `ajouter.py labos.json` (le `labos.json` de ce dossier est la source à jour) : ajouter une entrée par simulation (id, chapitre, activite, objectifs,
  duree_min, description, conceptions, faire — une phrase par mission), puis lancer : réécrit `contenu/manifeste.json`.
- `bash regression.sh "<id> <scenario>" …` : rejoue des scénarios.

## 8. Déroulé d'un chapitre

1. Fiche lue, plan par activité (matériel, valeurs, ce qui est mesuré, missions), réutilisation de `commun/`.
2. Code (poste, simulation), page (`pages.py`), scénario de test de **tout le parcours**.
3. **Relire chaque capture** avec les listes des § 2 et 2 bis (gros plans des objets nouveaux) et corriger avant d'aller
   plus loin ; comparer les mesures à la théorie.
4. Régression si `commun/` a changé ; assembler (nouvelles simulations et celles touchées par les changements communs) ;
   rejouer les scénarios sur les fichiers assemblés.
5. Manifeste (`ajouter.py`), `LISEZMOI.md` des laboratoires, `ARCHITECTURE.md`, `JOURNAL.md` (problèmes restants honnêtes).
6. Tests et contrôle de structure ; commit (pied de commit demandé par la session) ; push sur la branche de travail.
7. Rapport en français simple : fichiers et lignes ; ce que fait l'étape (5 lignes au plus) ; test exact et ce qu'on doit
   voir ; points à régler. Puis attendre « continu ».
