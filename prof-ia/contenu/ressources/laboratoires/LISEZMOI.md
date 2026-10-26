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

## Chapitre tronc commun « Quantité de mouvement » (fiche tronc_commun/meca4_quantite_mouvement)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_meca4_a1_quantite.html | A1 : définition et représentation de p | O1, O2 | Lance un mobile de 300 g sur la table à coussin d'air, mesure sa vitesse, calcule p = m·v (kg·m/s) et trace le vecteur p à l'échelle. Pose une surcharge de 300 g : à vitesse égale, p double. |
| tc_meca4_a2_conservation.html | A2 : expériences de conservation, puis généralisation | O3 | « Explosion » : deux mobiles serrés contre un ressort, retenus par un fil que l'élève coupe. Avec la surcharge sur A, mA·vA = mB·vB et pA + pB = 0 ; sans surcharge, vA = vB. Loi de conservation, exercice des patineurs. |
| tc_meca4_a3_applications.html | A3 : applications (recul d'une arme, choc, barque) | O3 | Choc de deux mobiles qui se collent (mA·vA = (mA + mB)·v') ; enfant qui saute d'une barque sur un lac (bouées graduées) ; canon à ressort sur un chariot qui recule (rail gradué, barrière lumineuse) ; recul d'un fusil. |
| tc_meca4_a4_force.html | A4 : vérification expérimentale de F = Δp/Δt | O4 | Chronophotographie d'une bille lâchée devant une règle (fils de lecture rouges) : t et y au tableur, v3, v7, Δp/Δt = m·g = P, Δp vertical vers le bas. Bille lancée horizontalement devant un quadrillage : vx constante, Δp vertical. |

## Modifier ou ajouter une simulation

Les sources sont dans `sources/<nom>/` : `page.html` (liste des scripts), un fichier par appareil, et
`simulation.js` (les missions : consignes, vérifications, questions). Les outils communs sont dans `commun/`.

Après une modification, refaites les fichiers autonomes :

```
python -m outils.assembler_laboratoire            (toutes les simulations)
python -m outils.assembler_laboratoire tc_meca1_a3_force_pressante
```

Pour essayer pendant l'écriture, ouvrez directement `sources/<nom>/page.html` dans le navigateur.

## Chapitre tronc commun « Équilibre d'un solide » (fiche tronc_commun/meca5_equilibre)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_meca5_a1_ressort.html | A1 : relation tension/allongement d'un ressort | O1 | Accroche des masses marquées sous un ressort, lit sa longueur sur la règle, trace T en fonction de Δl : T = K·Δl (K ≈ 25 N/m). Avec un ressort plus raide, mesure K en une mesure ; étalonnage d'un dynamomètre. |
| tc_meca5_a2_archimede.html | A2 : mesure de la poussée d'Archimède | O2 | Cylindre accroché à un dynamomètre fin, plongé dans un bécher posé sur un support élévateur : F = P − P' ; immersion à moitié ; cylindre de même volume mais de masse différente ; eau salée ; F = ρ·V·g. |
| tc_meca5_a3_trois_forces.html | A3 : vecteurs des trois forces à l'équilibre | O3 | Table à forces : anneau tenu par trois fils et des porte-masses chargés de masses à fente ; angles au rapporteur, projections (méthode analytique) ; vecteurs mis bout à bout : triangle fermé (méthode graphique). |
| tc_meca5_a4_frottement.html | A4 : mise en évidence du frottement | O4 | Plan inclinable : angle de démarrage φ du pavé, k = tan φ, bois puis caoutchouc. Traction horizontale au dynamomètre (index du maximum) : F_max = k·P, avec et sans surcharge. |
| tc_meca5_a5_moments.html | A5 : effet de rotation, moment d'un couple, théorème des moments, M = −C·θ | O5, O6, O7 | Barre à trous et masses marquées : rotation, force sur l'axe, équilibres à deux et trois masses, ΣM = 0. Pendule de torsion : couple de deux forces, M en fonction de θ, constante de torsion C. |

## Chapitre tronc commun « Courant électrique continu » (fiche tronc_commun/elec1_courant_continu)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_elec1_a1_electrisation.html | A1 : expériences simples (électrisation par frottement) | O1, O2 | Frotte une baguette de PVC (laine) ou de verre (soie) et l'approche de petits papiers ; pose un PVC frotté sur un étrier suspendu, approche un autre PVC (répulsion) puis le verre (attraction) ; loupe « modèle » : électrons en excès ou en manque ; n = |Q|/e. |
| tc_elec1_a2_nature_courant.html | A2 : nature du courant dans les métaux et les électrolytes | O3, O4 | Pose lui-même les fils : circuit en série avec une DEL (le courant a un sens, sens conventionnel) ; loupe sur un fil (électrons libres en sens inverse de I) ; multimètre en ampèremètre, Q = I·Δt, n = Q/e ; tube en U d'électrolyse (migration des ions colorés, inversion du générateur). |
| tc_elec1_a3_loi_noeuds.html | A3 : loi des nœuds en série et en dérivation | O5 | Deux lampes différentes en série, ampèremètre déplacé à trois endroits (même intensité), calibre 20 mA dépassé, choix du calibre ; deux lampes en dérivation avec A, A1, A2 : I = I1 + I2 dans le tableur ; conservation de la charge. |

Le matériel électrique est commun (dossier `commun/`, fichiers `circuit*.js` et `multimetre.js`) : on tire un fil
depuis une borne et on le lâche sur une autre ; on tire un fil posé pour le débrancher. Les fiches s'empilent sur une
borne (c'est alors un nœud). Les courants sont calculés à chaque changement (méthode des nœuds). Le générateur limite
son courant en cas de court-circuit (voyant LIMIT) ; il a un bouton Marche/Arrêt et son cordon est branché dans la prise.

## Chapitre tronc commun « Tension électrique » (fiche tronc_commun/elec2_tension)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_elec2_a1_tensions_continues.html | A1 : mesures de tensions continues | O1, O3, O4 | Voltmètre en dérivation aux bornes du générateur (P, N) ; U_NP = −U_PN ; flèche de U_PN vers P ; dépassement du calibre 2 V ; incertitude de la notice : U_PN = (6,00 ± 0,05) V. Deux lampes en série : U_PN = U_AB + U_CD (tableur) ; interrupteur ouvert : U_EF = U_PN sans courant. En dérivation : U_AB = U_CD = U_PN. |
| tc_elec2_a2_potentiel.html | A2 : différence de potentiel | O2 | Plaquette de trois résistances au code des couleurs (A, B, C, D) ; masse en D : potentiels V_A, V_B, V_C ; U_AB mesurée = V_A − V_B ; masse en C : les potentiels changent, les tensions non. |
| tc_elec2_a3_oscilloscope.html | A3 : tensions variables à l'oscilloscope | O1, O5, O6 | Pile sur l'oscilloscope : U = Sv·y. GBF sinusoïdal : réglage de Sv et b, T = b·x, f = 1/T, Umax = Sv·y ; voltmètre TRMS en V~ : U = Umax/√2. Triangle et carré : même période ; en carré U = Umax, donc U = Umax/√2 seulement en sinusoïdal. |

Matériel ajouté dans `commun/` : multimètre complet (`multimetre.js`, `multimetre_mesure.js` : V⎓, V~ TRMS, A⎓, quatre bornes,
fusible de la borne mA), `mesure_tension.js` (quelle tension mesure le voltmètre), `circuit_resistances.js` (code des couleurs),
`circuit_pile.js`, `gbf.js`, `oscilloscope.js` et `oscilloscope_ecran.js`. Les appareils branchés sur le secteur (générateur,
GBF, oscilloscope) ont chacun leur cordon et leur fiche dans une prise du bloc mural.

## Chapitre tronc commun « Montages électriques » (fiche tronc_commun/elec3_montages_electriques)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_elec3_a1_associations.html | A1 : associations série/dérivation (ohmmètre), diviseur de tension | O1, O2, O3 | Ohmmètre et choix du calibre ; code des couleurs et tolérance (valeurs réelles légèrement différentes) ; Req en série (R1 + R2) et en parallèle (G = G1 + G2) ; fils résistants : R = ρ·l/S, ρ du constantan ; diviseur de tension U = R2/(R1 + R2)·U0. |
| tc_elec3_a2_caracteristiques.html | A2 : caractéristiques de dipôles passifs | O4, O5 | Alimentation réglable ; caractéristiques d'une résistance (droite, U = R·I), d'une lampe (U/I croît : le filament chauffe), d'une diode (seuil vers 0,6 V, bloquée en inverse) ; Zener 5,1 V à l'oscilloscope (écrêtage) ; CTN dans trois béchers et photorésistance (lampe de poche, cache) à l'ohmmètre. |
| tc_elec3_a2_dipoles_actifs.html | A2 (suite) : pile et électrolyseur, dans la même séance | O6 | Pile 4,5 V débitant dans un rhéostat : U = E − r·I, Icc = E/r ; électrolyseur : pas de courant sous E', puis U = E' + r'·I (bulles deux fois plus abondantes à la cathode). Conventions générateur et récepteur, sans algébriser I. |
| tc_elec3_a3_point_fonctionnement.html | A3 : point de fonctionnement | O7 | Problème d'adaptation lampe 6 V – 0,1 A / pile 4,5 V : point mesuré, puis intersection des deux caractéristiques (deux courbes sur la tablette) ; loi de Pouillet (avec R, puis R et électrolyseur) ; deux piles en série, résistance d'adaptation de 27 Ω. |

Calcul des circuits renforcé pour ce chapitre : dipôles non linéaires (méthode de Newton amortie) — lampe à filament
de tungstène (résistance à froid ≈ 12 % de la résistance à chaud), diode 1N4007, Zener 5,1 V, électrolyseur ; circuit
alimenté par un GBF calculé instant par instant (72 instants par période), ce qui permet de voir l'écrêtage de la Zener.
Nouveau matériel commun : `circuit_semiconducteurs.js`, `thermistance.js`, `photoresistance.js`, `rheostat.js`,
`electrolyseur.js`, `caracteristique.js` (relevé des points I, U) ; ohmmètre dans le multimètre ; alimentation réglable ;
deuxième courbe facultative sur le graphique de la tablette.

## Chapitre tronc commun « Montages électroniques » (fiche tronc_commun/elec4_montages_electroniques)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_elec4_a1_transistor.html | A1 : comportement d'un transistor NPN ; montages à transistor | O1, O2, O3, O6 | Effet transistor : un faible courant de base commande la lampe du collecteur ; régimes bloqué, linéaire, saturé ; trois ampèremètres : I_C = β·I_B (β ≈ 150) et I_E = I_B + I_C au tableur ; détecteur d'obscurité câblé (photorésistance, transistor, DEL) : capteur, traitement, sortie. |
| tc_elec4_a2_ao.html | A2 : AO, suiveur, inverseur, non-inverseur (oscilloscope bicourbe) | O4, O5, O6 | AO 741 alimenté en ±15 V ; caractéristique de transfert Us = f(ε) au voltmètre (±13,5 V, ε = 0 en régime linéaire) ; suiveur (Us = Ue) ; inverseur R1 = 10 kΩ, R2 = 22 kΩ (Us = −2,2·Ue, opposition de phase, écrêtage) ; non-inverseur (Us = 3,2·Ue) ; l'AO dans une chaîne électronique. |

Nouveau matériel commun : `transistor.js` (BC547, brochage C-B-E du boîtier TO-92), `amplificateur_operationnel.js`
(alimentation symétrique et AO avec une tension de décalage de 1 mV, comme un vrai 741) ; sources commandées dans le
calcul des circuits ; oscilloscope à deux voies (Y1, Y2, masse commune) ; calibre 2 mA du multimètre (13 positions).

## Chapitre tronc commun « Espèces chimiques » (fiche tronc_commun/chim1_especes_chimiques)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim1_a1_sens.html | A1 : les cinq sens sur un fruit et sur du papier | O1 | Cartes des sens et loupe sur une orange (entière, coupée, pressée) et une feuille de papier ; la carte du goût est refusée (on ne goûte jamais au laboratoire) ; les sens donnent des indices, pas des preuves ; définition d'une espèce chimique. |
| tc_chim1_a2_tests.html | A2 : tests de détection | O1 | Sulfate de cuivre anhydre (eau), papier pH et phénolphtaléine (pH au tableur), eau iodée (amidon), liqueur de Fehling au bain-marie (glucose), toujours avec un témoin ; l'élève propose le test qui vérifie une hypothèse. |
| tc_chim1_a3_classement.html | A3 : inventaire, classement, documents sur l'industrie chimique | O1 | Inventaire des espèces trouvées ; étiquettes de six produits ; classement en naturelle, synthétique identique à une espèce naturelle, synthétique artificielle (synthétique ≠ artificiel) ; documents : phosphates du Maroc, vanilline de synthèse. |

Nouveau matériel commun de chimie : `chimie_melange.js` (contenus et couleurs des tests), `chimie_verrerie.js`,
`chimie_gouttes.js` (pipettes compte-gouttes, une par produit), `chimie_objets.js`, `chimie_poudre.js`,
`chimie_chauffage.js` (bain-marie), `chimie_decor.js` (affiche de sécurité).

Matériel physique (depuis le chapitre « Extraction ») : la verrerie est dessinée à ses vraies dimensions (1,6 px par mm)
et les liquides respectent la physique : surface horizontale, ballottement quand on bouge le récipient (secoué trop
fort, il déborde), filet qui tombe en chute libre là où l'on verse, flaques, robinet de l'ampoule (loi de Torricelli),
phases non miscibles rangées par densité, émulsion puis décantation, partage du diiode, température des mélanges.
Fichiers : `liquide_geometrie.js`, `liquide_contenu.js`, `chimie_reactions.js`, `verrerie_profils.js`,
`verrerie_rendu.js`, `verrerie_accessoires.js`, `recipient_physique.js`, `ecoulement.js`, `recipient_gestes.js`,
`pipette_physique.js`, `verre_montre.js`, `porte_tubes.js`, `bain_marie_physique.js`, `plaque_ccm.js`.
Les quatre simulations de chimie (chim1 A2, chim2 A1, A2, A3) l'utilisent ; chim1 A1 et A3 ont été mises à la taille réelle.

## Chapitre tronc commun « Extraction, séparation et identification » (fiche tronc_commun/chim2_extraction)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim2_a1_traditionnelles.html | A1 : documents historiques ; macération, infusion, décoction | O1 | Quatre documents (enfleurage, macération, infusion et décoction, distillation et eau de rose) ; feuilles de thé dans l'eau froide, l'eau de la bouilloire, l'eau qui bout sur la plaque (temps accéléré) ; classement de préparations. |
| tc_chim2_a2_extraction.html | A2 : hydrodistillation, extraction par solvant, filtration sous vide, verrerie | O1, O2, O3 | Hydrodistillation de la lavande (pierre ponce, eau du réfrigérant par le bas) ; choix du solvant au tableau de données, ampoule à décanter (verser, boucher, secouer, dégazer, décanter, recueillir) ; filtration sous vide (arrêt dans le bon ordre) ; montage à reflux numéroté. |
| tc_chim2_a3_ccm.html | A3 : chromatographie sur couche mince, révélation | O4 | Ligne au crayon, dépôts au capillaire, éluant sous la ligne, cuve fermée, front marqué ; colorants d'un sirop de menthe comparés à des références, Rf au tableur ; espèces incolores d'un médicament révélées sous UV et au diiode. |

## Chapitre tronc commun « Synthèse d'espèces chimiques » (fiche tronc_commun/chim3_synthese)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim3_a1_savon.html | A1 : synthétiser une espèce (reflux, filtration, séparation) | O1, O2, O3 | Fiches de sécurité et pictogrammes ; lunettes et gants exigés pour la soude ; huile, soude, éthanol par l'entonnoir, pierre ponce, réfrigérant à boules, reflux de 30 min ; relargage dans l'eau salée ; filtration sous vide ; mousse comparée à un savon du commerce et à un témoin. |
| tc_chim3_a2_arome.html | A2 : synthétiser une espèce naturelle et vérifier qu'elle est identique | O1, O2, O3 | Acétate d'isoamyle (arôme de banane) au reflux avec un catalyseur ; lavage à l'eau salée à l'ampoule (ester en phase supérieure, odeur par déplacement d'air) ; chromatographie du produit, de l'arôme naturel et de la référence, révélée sous UV. |

Matériel commun ajouté : `pictogrammes.js` (SGH), `equipement.js` (lunettes, gants), `chauffe_ballon.js`,
`pierre_ponce.js`, `refrigerant_boules.js`, `montage_reflux.js` et `reflux_gestes.js` (montage à reflux que l'on
assemble), `poste_synthese.js` (paillasse de synthèse), `buchner.js` et `buchner_poste.js` (filtration sous vide),
`ampoule_support.js` (ampoule à décanter), `ccm_materiel.js`, `ccm_gestes.js`, `ccm_poste.js`, `ccm_missions.js`
(chromatographie). Plusieurs de ces fichiers étaient avant dans les dossiers de chim2 : ils ont été déplacés sans changer
leur rôle.

## Chapitre tronc commun « Modèle de l'atome » (fiche tronc_commun/chim4_atome)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim4_a1_rutherford.html | A1 : recherche historique ; expérience de Rutherford | O1, O2, O3 | Cinq documents illustrés (Démocrite et Dalton, Thomson, Rutherford, Bohr, Chadwick) ; prévision avec le modèle de Thomson ; chambre de diffusion (source alpha, feuille d'or de 2 µm, détecteur tournant), vide à la pompe, comptages N(θ) avec et sans feuille, tableur et courbe ; ordres de grandeur ; classement des découvertes par époque. |
| tc_chim4_a2_masse.html | A2 : calcul de la masse d'atomes | O2, O3, O4, O5 | Tableau magnétique : construire ¹²₆C, ²³₁₁Na, l'ion Na⁺, ¹⁶₈O, ³⁵₁₇Cl (couches K, L, M remplies dans l'ordre), isotopes ; masse de quatre atomes et rapport noyau / atome au tableur ; pesée d'un cylindre de cuivre et nombre d'atomes. |
| tc_chim4_a3_cuivre.html | A3 : conservation de l'élément cuivre | O4 | Sous la hotte, lunettes et gants : cuivre + acide nitrique (gaz roux, ions Cu²⁺ bleus), soude (Cu(OH)₂ bleu), bain-marie (CuO noir), acide sulfurique (Cu²⁺), poudre de fer (cuivre métal rouge), dans le même tube. |
| tc_chim4_a4_carbone.html | A4 : conservation du carbone ; cycle du carbone ; abondance des éléments | O1, O4 | Bec Bunsen, têt à combustion : charbon chauffé au rouge puis plongé dans le dioxygène ; eau de chaux versée, flacon fermé et agité (trouble) ; documents (cycle du carbone, abondance, Soleil) et classement des phénomènes qui retirent ou rejettent du CO₂. |

On dit « nombre de nucléons » A, jamais « nombre de masse » (orientation de la fiche). Les réactions nucléaires du
Soleil sont seulement évoquées dans un document.

Matériel commun ajouté : `balance_electronique.js` (balance au centième, tare), `echantillons_metal.js` (cylindres de
cuivre, aluminium, fer, zinc), `spatule_physique.js` (pot de poudre et microspatule), `bec_bunsen.js` (robinet de gaz,
allume-gaz, virole, chaleur de la flamme). Petits ajouts signalés : `documents_mur.js` accepte une illustration,
`verrerie_profils.js` a un flacon à gaz de 600 mL fermé par une plaque de verre (`verrerie_accessoires.js`), et
`recipient_gestes.js` ne verse pas dans un récipient fermé par un objet (`q.ferme`).

## Chapitre tronc commun « Géométrie de quelques molécules » (fiche tronc_commun/chim5_molecules)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim5_a1_lewis.html | A1 : formules développées, semi-développées, brutes | O1, O2, O3 | Tableau de l'atome : former Na⁺ et Cl⁻ (duet, octet ; affiche des gaz nobles) ; tableau magnétique de Lewis : H₂O, NH₃, CH₄, CO₂, N₂, C₂H₄ (doublets liants et non liants ; message quand une règle n'est pas respectée) ; deux isomères de C₂H₆O, une molécule C₄H₁₀ ; formules semi-développées ; limites du modèle (NO₂). |
| tc_chim5_a2_cram.html | A2 : modèles moléculaires ; représentation de Cram | O4 | Boîte de modèles moléculaires et modèle en 3D que l'on tourne : CH₄ (109,5°), NH₃ (107°), H₂O (104,5°), C₂H₄ plane, CO₂ linéaire ; méthane tourné (deux liaisons dans le plan) puis dessiné en Cram au tableau (trait, triangle plein, triangle hachuré). |

La géométrie des modèles vient de la répulsion des doublets (liaisons, trous libres, doublets non liants) autour de
chaque atome ; une liaison double compte pour une seule direction. Le modèle de démonstration est 1,8 fois plus grand
qu'un modèle de boîte d'élève, pour qu'on le manipule facilement.

Matériel commun ajouté : `lewis_regles.js`, `lewis_dessin.js`, `tableau_lewis.js` (tableau de Lewis), `molecule_3d.js`
(géométrie), `modele_dessin.js` (rendu 3D), `modele_atelier.js` (assemblage, rotation, liaisons doubles),
`boite_modeles.js` (boîte de modèles). `tableau_atome.js` a été déplacé de tc_chim4_a2_masse vers commun (il sert aussi
aux ions de chim5).

## Chapitre tronc commun « Classification périodique des éléments » (fiche tronc_commun/chim6_classification)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim6_a1_familles.html | A1 : documents sur l'histoire de la découverte des éléments et la méthode de Mendeleïev | O1, O3 | Trois documents (de l'Antiquité à Lavoisier, Mendeleïev et l'éka-silicium, la classification par Z) ; 16 cartes à ranger comme Mendeleïev (masse, formules des composés) ; Li, Na, K dans l'eau avec phénolphtaléine, derrière un écran ; NaCl, KBr, KI et nitrate d'argent (précipités). |
| tc_chim6_a2_tableau.html | A2 : nombre de liaisons d'un élément à partir de sa position | O1 à O4 | Tableau périodique magnétique (18 cartes : symbole, Z, formule électronique) ; liaisons et ions d'après la colonne ; Lewis de H₂S, PH₃, SiH₄, CCl₄ ; formule de MgCl₂. |

Matériel commun ajouté : `tableau_cartes.js` (tableau magnétique quadrillé et cartes), profil `cristallisoir_90`
(`verrerie_profils.js`). Le tableau de Lewis accepte maintenant F, Si, P, S (`lewis_regles.js`, `lewis_dessin.js`,
`tableau_lewis.js` : liste d'éléments au choix) ; `lewis_verif.js` (vérifications des molécules) a été déplacé de
tc_chim5_a1_lewis vers commun.

## Chapitre tronc commun « La mole et la concentration » (fiche tronc_commun/chim7_quantite_matiere)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim7_a1_mole.html | A1 : comment mesurer une même quantité (mole) d'espèces différentes ? | O1, O2, O3 | Masses molaires de C₁₂H₂₂O₁₁, NaCl, S, Fe au tableur ; pesée de 0,010 mol de chaque solide (coupelle, tare, spatule) ; volume de 0,10 mol d'éthanol prélevé à la pipette graduée et vérifié à la balance ; volume molaire des gaz. |
| tc_chim7_a2_solutions.html | A2 : dissolution d'espèces moléculaires (sucre, diiode, alcool) | O3, O4, O5 | Saccharose dans l'eau, avec et sans agitateur ; diiode dans l'eau (très peu soluble) et dans l'éthanol ; éthanol et eau miscibles ; solutions moléculaires et ioniques ; 100,0 mL de glucose à 0,100 mol/L en fiole jaugée (pesée, entonnoir, rinçage, dissolution, trait de jauge, homogénéisation) ; dilution dix fois d'une eau iodée. |

Les solides dissous suivent la loi de Noyes-Whitney : la vitesse dépend de la surface des cristaux, de l'agitation et de
l'écart entre la solubilité et la concentration ; une solution saturée ne dissout plus. Le trait de jauge se lit sur une
loupe (×4) : le bas du ménisque doit être sur le trait (± 0,2 mL pour la fiole de 100 mL, ± 0,12 mL pour celle de 50 mL).
Après le dernier ajout d'eau, il faut boucher la fiole et la secouer pour que la solution soit homogène. Si le trait est
dépassé, le bouton « Nouvelle fiole » vide la fiole : il faut tout recommencer, comme au laboratoire.

Matériel commun ajouté : `pesee_poudre.js`, `pipette_graduee.js` (A1), `coupelle_versement.js`, `dissolution.js`,
`agitateur.js`, `pissette.js`, `fiole_accessoires.js`, `fiole_jaugee.js` (A2), profils `fiole_jaugee_100` et
`fiole_jaugee_50` (`verrerie_profils.js`) et leur trait de jauge (`verrerie_accessoires.js`). Le ménisque est dessiné
dans les cols étroits (`verrerie_rendu.js`) ; la pointe de la pipette graduée entre dans un col étroit lâchée juste
au-dessus (`pipette_graduee.js`).

## Chapitre tronc commun « Transformation chimique d'un système » (fiche tronc_commun/chim8_transformation)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| tc_chim8_a1_transformations.html | A1 : cuivre et nitrate d'argent, fer et sulfate de cuivre, combustions, sodium et dichlore, précipitation de l'hydroxyde de cuivre | O1, O2 | Fil de cuivre dans le nitrate d'argent, clou dans le sulfate de cuivre ; ions formés identifiés à la soude ; Cu(OH)₂ bleu ; soufre et laine de fer dans le dioxygène, sodium dans le dichlore (sous la hotte) ; sept équations à écrire et ajuster au tableau magnétique. |
| tc_chim8_a2_avancement.html | A2 : influence des quantités de réactifs sur l'avancement maximal (acide éthanoïque et hydrogénocarbonate de sodium) | O3, O4 | Quatre essais (0,10 à 0,75 g d'hydrogénocarbonate, 10,0 mL de vinaigre à 0,50 mol/L) ; CO₂ recueilli sur la cuve à eau ; graphique n(CO₂) = f(n(NaHCO₃)) ; tableau d'avancement et bilan de matière au tableur. |

Les quantités suivent les équations : par exemple 0,10 g de soufre consomment 0,10 g de dioxygène et donnent 0,20 g de
SO₂ ; le métal plongé est en excès, les ions sont entièrement consommés. Dans l'activité 2, l'ampoule de coulée est
isobare (son tube d'égalisation évite que le vinaigre versé chasse de l'air) : le volume lu est celui du CO₂ formé
(Vm = 24 L/mol). Le volume plafonne à 120 mL (xmax = 5,0 mmol) dès que l'acide est le réactif limitant (m > 0,42 g).

Matériel commun ajouté : `ions_metaux.js`, `metal_tube.js`, `flacon_gaz.js`, `cuillere_combustion.js`,
`equation_regles.js`, `tableau_equation.js` (A1) ; `degagement_gaz.js`, `recueil_gaz.js` (A2). `coupelle_versement.js`
accepte une poudre qui colle moins à la coupelle (`collant`).

## Chapitre 1re année du bac « Rotation d'un solide autour d'un axe fixe » (fiche 1bac/meca1_rotation)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_meca1_a1_rotation.html | A1 : documents et exemples du vécu | O1 | Fait tourner une maquette de grande roue au doigt ; chronophotographie (10 images) : le rayon [AB] change de direction, la nacelle [CD] garde la sienne ; classe huit mouvements du vécu (rotation, translation circulaire, translation rectiligne). |
| b1_meca1_a2_enregistrement.html | A2 : enregistrements du mouvement d'un point d'un solide en rotation | O2 à O6 | Solide qui pivote autour du clou de la table à coussin d'air ; points A (6 cm) et B (12 cm) ; θ au rapporteur, s_A et s_B à la règle ; courbe θ(t), ω, s = R·θ, v = R·ω. |
| b1_meca1_a3_uniforme.html | A3 : caractéristiques de la rotation uniforme | O3 à O6 | Disque entraîné par un moteur (f = 0,8 tr/s par volt) ; stroboscope dans la salle obscure : un trait immobile pour fe = f, deux pour fe = 2f ; capteur à fourche : T et durée de passage de fentes à 4, 6 et 8 cm ; graphique v = f(R). |

Au stroboscope, l'œil garde les images des éclairs pendant au moins un dixième de seconde (et au moins un tour du disque) :
on voit donc toutes les positions éclairées pendant un tour. Le compteur ajoute un bruit de ±0,1 % aux mesures.

Matériel commun ajouté : `bouton_reglage.js`, `rapporteur.js`. Modifiés, sans changer les simulations existantes :
`tri.js` (nombre d'étiquettes par ligne réglable, 3 par défaut), `coussin_air.js` (donne la conversion vers la table),
`feuille_enregistrement.js` (dessine la croix de l'axe quand le mobile tourne autour du clou).

## Chapitre 1re année du bac « Travail et puissance d'une force » (fiche 1bac/meca2_travail_puissance)

La fiche ne propose qu'une activité (documents, logiciels ou expériences simples sur l'effet d'actions mécaniques dont le
point d'application se déplace) : elle est réalisée par deux simulations, l'une en translation, l'autre en rotation.

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_meca2_a1_translation.html | A1 (translation) | O1, O2, O3 | Tire un pavé de 500 g de A à B (40 cm) à vitesse constante, fil horizontal puis incliné de 30° et 60° (rapporteur) : W = F·AB·cos α au tableur, travail du frottement, du poids et de la réaction ; classe neuf situations (moteur, résistant, nul) ; monte un chariot de 500 g jusqu'au faisceau d'un niveau laser (h = 20 cm) sur un plan incliné à trois angles : F·L = m·g·h. |
| b1_meca2_a1_rotation.html | A1 (rotation) | O4, O5 | Tire au dynamomètre le fil de la grande gorge d'une poulie (R = 5 cm, r = 1,5 cm) : une masse de 600 g monte ; θ lu sur la poulie graduée, h sur une règle : W(F) = M·Δθ = −W(P) ; monte une masse de 500 g avec un treuil électrique à 4, 6 et 9 V : chronomètre à deux cellules, compte-tours, P = m·g·Δh/Δt = M·ω. |

Le pavé glisse avec μ = 0,40 (F = μ·m·g / (cos α + μ·sin α)) : la force nécessaire est la plus petite vers 22°. Sur le plan
incliné et sur la poulie, les frottements sont négligés. Le moteur du treuil suit ω = 3·U − 60·M (rad/s, M en N·m).

Matériel commun ajouté : `dynamometre_traction.js`. Modifié, sans changer les simulations existantes : `formules.js`
(fonctions COS et SIN du tableur, angle en radians : =COS(A2*PI()/180)).

## Chapitre 1re année du bac « Le travail, mode de transfert d'énergie » (fiche 1bac/meca3_travail_energie)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_meca3_a1_cinetique.html | A1 : approche de Ec (translation, rotation) | O1 | Lance un mobile (200 à 400 g) sur un banc à coussin d'air avec un ressort ; v mesurée par une cellule ; un curseur à frottement l'arrête sur la distance d : d ∝ m·v². Lance puis freine un volant d'inertie (disques A et B, J donné) : n tours ∝ J·ω². |
| b1_meca3_a2_theoreme.html | A2 : glissement sans frottement, ΔEc et travaux | O2 | Enregistre la descente du mobile autoporteur (600 g) sur la table inclinée (sin α = 0,050) ; M1Mi et vi à la règle ; ΔEc = f(W(P)) : droite de pente 1 ; généralisation à la rotation. |
| b1_meca3_a3_potentielle.html | A3 : Epp à partir du travail du poids | O3 | Lâche une bille d'acier (33,0 g) avec un électroaimant ; deux cellules (v = d/Δt) ; ΔEc = f(m·g·z2) : pente −1, Epp = m·g·z + cte ; changement d'état de référence. |
| b1_meca3_a4_mecanique.html | A4 : conservation de Em, non-conservation avec frottement | O4, O5 | Ec, Epp et Em de la bille à six hauteurs (Em constante) ; rail à coussin d'air incliné (sin α = 0,100) : débit normal, Em se conserve ; débit faible (f = 0,080 N), ΔEm = W(f) = −Q. |

Dans l'activité 1, le ressort du lanceur (k = 40 N/m) donne au mobile l'énergie ½·k·c² : à compression égale, la distance
de freinage ne dépend pas de la masse (m·v² est le même), ce qui confirme Ec = ½·m·v². Le curseur exerce f = 0,25 N, le
frein du volant un couple de 0,020 N·m. Les durées des cellules sont exactes à ±0,1 % (frottements de l'air négligés).

Matériel commun ajouté : `chute_dessin.js`, `chute_libre.js` (activités 3 et 4).

## Chapitre 1re année du bac « Travail et énergie interne » (fiche 1bac/meca4_energie_interne, filière SM)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_meca4_a1_energie_interne.html | A1 : effets du travail et modes de transfert | O1 à O4 | Retourne 60 fois un tube contenant 500 g de grenaille de plomb (chute de 1,00 m) : T monte d'environ 4 °C ; n·m·g·h ≈ m·c·ΔT (énergie interne) ; classe neuf situations selon l'effet du travail ; pose 1, 2 puis 3 kg sur le piston d'une seringue à gaz (S = 4,00 cm²) : W = p·(V1 − V2), le gaz s'échauffe puis revient à 20 °C : Q = −W, ΔU = W + Q. |

À chaque chute, la grenaille s'échauffe de g·h/c ≈ 0,076 K ; le plomb se refroidit lentement vers 20 °C (constante de temps
15 min), d'où un léger écart entre n·m·g·h et m·c·ΔT. Dans la seringue, la compression brusque échauffe le gaz d'environ
30 K × (p/p_avant − 1) (valeur adoucie, la sonde ne suit pas les pointes), puis le gaz revient à 20 °C en 5 s environ.

## Chapitre 1re année du bac « Énergie thermique, transfert thermique » (fiche 1bac/meca5_thermique)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_meca5_a1_parametres.html | A1 : paramètres dont dépend Q | O1, O2 | Chauffe dans un gobelet, avec un thermoplongeur de 100 W, 200 g d'eau 60 s, 400 g 60 s, 200 g 120 s, puis 200 g d'huile : Q/(m·Δθ) est constant pour l'eau (≈ 4180 J·kg⁻¹·K⁻¹) et différent pour l'huile (≈ 2000). |
| b1_meca5_a2_calorimetrie.html | A2 : capacité d'un calorimètre, chaleur massique d'un métal, chaleur latente de fusion | O3, O4, O5 | Mélange eau froide (18 °C) et eau chaude (60 °C) : C ≈ 150 J/K ; cylindre de 100 g sorti de l'eau bouillante : c ≈ 900 J·kg⁻¹·K⁻¹ (aluminium) ; glaçons (≈ 30 g) dans l'eau à 30 °C : Lf ≈ 3,34×10⁵ J/kg. |
| b1_meca5_a3_rayonnement.html | A3 : rayonnement | O1, O6 | Lampe de 100 W au-dessus d'une plaque noire et d'une plaque brillante : relevés de 0 à 5 min, la plaque noire s'échauffe beaucoup plus ; lampe rapprochée à 15 cm ; tableau des modes de transfert. |

Le modèle thermique (`vase_modele.js`) est conservatif : chaque corps échange avec le liquide jusqu'à l'équilibre, la somme
des chaleurs échangées est nulle (pertes vers l'air très lentes). L'agitateur accélère l'équilibre. Les temps sont accélérés
(× 5 pour le chauffage, × 3 pour la calorimétrie, × 10 pour le rayonnement), c'est écrit sur les appareils.

Matériel commun ajouté : `vase_modele.js`, `vase_dessin.js`, `becher_verseur.js`.

## Chapitre 1re année du bac « Énergie potentielle électrostatique » (fiche 1bac/elec1_energie_electrostatique, SM)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_elec1_a1_electrisation.html | A1 : électrisation par frottement, contact, influence | O1 | Pendule électrostatique : boule neutre attirée, contact, répulsion, attraction par la charge opposée ; électroscope : influence sans contact, charge par contact, charge par influence (doigt relié à la Terre). |
| b1_elec1_a2_champ.html | A2 : lignes de champ, champ uniforme (et loi de Coulomb) | O1, O2 | Balance de Coulomb : F pour cinq distances (F·d² constant, k ≈ 9×10⁹ SI), puis charge de B divisée par 2 ; semoule dans l'huile de ricin : deux pointes, puis deux plaques (champ uniforme) ; E = F/q. |
| b1_elec1_a3_potentiel.html | A3 : travail de la force électrostatique, ddp, Epe | O3, O4 | Cuve rhéographique (0 V et 12,0 V, d = 10 cm) : V(x) sur une ligne, E = 120 V/m, équipotentielle à 6,00 V ; potentiels de deux points A et B : W = q·(VA − VB), Epe = q·V ; électron accéléré : Ec = e·U. |

Les baguettes et chiffons viennent de la simulation du tronc commun (`sources/tc_elec1_a1_electrisation/frottement.js`, inclus
tel quel). Une baguette lâchée près du support isolant y reste posée (« Reprendre » la rend) : on peut ainsi garder une
baguette près de l'électroscope pendant qu'on pose et retire le doigt. Sur la balance de Coulomb, Δm = F/g, avec
F = k·qA·qB/d² (k = 8,99×10⁹ SI, q = 5,56 nC après la sonde : 11,3 mg à 5 cm).

## Chapitre 1re année du bac « Transfert d'énergie dans un circuit électrique » (fiche 1bac/elec2_transfert_energie)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_elec2_a1_transferts.html | A1 : lampe et moteur, transfert d'énergie | O1 | Générateur 6 V, interrupteur ; lampe, moteur à treuil (200 g) puis électrolyseur branchés tour à tour : rayonnement, travail mécanique, énergie chimique, et toujours de la chaleur ; tableau magnétique : forme principale de l'énergie utile de huit appareils. |
| b1_elec2_a2_puissance.html | A2 : mesures de U et I pendant Δt | O2, O4, O5 | Moteur à treuil, ampèremètre en série, voltmètre à ses bornes ; montée chronométrée de 40 cm : W = U·I·Δt, P = U·I, W_u = m·g·Δh = 0,785 J, Q = W − W_u ; rendement à 4, 5 et 6 V au tableur (environ 34 %, 41 %, 45 %). |
| b1_elec2_a3_joule.html | A3 : loi de Joule (calorimétrie), effet Joule dans la vie courante | O3 | Résistance chauffante R = 4,0 Ω dans un calorimètre (C = 150 J/K, 200 g d'eau), chauffes de 300 s (temps accéléré × 10) à 6, 8 et 10 V : Q = 986·Δθ comparée à R·I²·Δt ; tableau magnétique : effet Joule utile ou nuisible ; haute tension, lampe à incandescence. |
| b1_elec2_a4_generateur.html | A4 : énergie fournie par le générateur ; influence de E et des résistances | O5, O6 | Pile 4,5 V (r = 1,5 Ω) : E à vide, U_PN et I avec 22 Ω ; P_g = E·I, P_e = U·I, r, rendement U/E ; I pour 22, 47 et 69 Ω comparée à E/(R + r) ; deux piles en série (E = 9 V). |

Le moteur à treuil (`commun/moteur_treuil.js`) est un vrai récepteur : U = k·ω + r'·I (k = 0,30 V·s/rad, r' = 25 Ω) ; au
démarrage, I = U/r' reste sous le fusible de 0,25 A de la borne mA jusqu'à 6 V. Un contact de fin de course l'arrête en
haut ; « ↓ » redescend la masse. Les touches de réglage des alimentations (±1 V, ±0,1 V) sont maintenant sur le dessus
du boîtier : les câbles, qui pendent vers l'avant, ne les cachent plus.

## Chapitre 1re année du bac « Magnétisme : champ magnétique et forces électromagnétiques » (fiche 1bac/elec3_magnetisme)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_elec3_a1_champ.html | A1 : document d'Œrsted, aimant brisé, superposition, champ terrestre | O1, O2 | Barreau aimanté sur une feuille : boussole loin de l'aimant puis devant ses pôles, limaille, B à 2 et 4 cm du pôle nord ; aimant cassé en deux ; deux aimants à angle droit : B mesuré ≈ √(B1² + B2²) ; champ terrestre : B_H, B_V, B_T ≈ 0,042 mT, inclinaison ≈ 46° ; fil nord-sud au-dessus d'une boussole (Œrsted), courant inversé. |
| b1_elec3_a2_courants.html | A2 : champ d'un fil, d'une spire, d'une bobine | O3 | Fil vertical à travers une plaque (20 A pour la limaille) : cercles, sens du champ, B à 2 cm pour 2 à 10 A (B/I = 0,01 mT/A), B à 1, 2, 3, 4 cm (B·d constant) ; spire de 20 tours (≈ 1,0 mT à 4 A) ; bobine de 200 spires sur 16 cm : champ uniforme, faces nord et sud, B ≈ 2,9 mT à 2 A (μ0·n·I = 3,1 mT). |
| b1_elec3_a3_laplace.html | A3 : force de Laplace ; haut-parleur, moteur | O4, O5, O6 | Rails de Laplace (sens selon I et B, tige immobile à 1 A, W = F·d) ; balance de Laplace : |Δm| pour I = 1 à 5 A, l = 1, 2, 4 cm, α = 90°, 60°, 30°, 0° (F = I·l·B·sin α) ; rubans parallèles (attraction, répulsion) ; faisceau d'électrons et aimant ; haut-parleur en coupe ; moteur avec et sans collecteur ; aimant dans une bobine (courant induit). |

Le champ est calculé par superposition (`commun/champ_magnetique.js`) : champ terrestre (B_H = 2,9×10⁻⁵ T, B_V = 3,0×10⁻⁵ T),
pôles d'aimants (B = q·r/r³) et courants (loi de Biot et Savart, exacte pour chaque segment). La touche « zéro » du
teslamètre retranche le champ terrestre ; les mesures de B créé par un courant ne sont notées qu'après un zéro fait circuit
ouvert. Sur la balance de Laplace, le cadre exerce sur l'aimant une force opposée à la force de Laplace : l'indication varie
de Δm = F/g (1,63 g pour 5 A, 4 cm, 0,080 T).

## Chapitre 1re année du bac « Conditions de visibilité d'un objet » (fiche 1bac/opt1_visibilite)

| Fichier | Activité de la fiche | Objectifs | Ce que l'élève fait |
|---|---|---|---|
| b1_opt1_a1_vision.html | A1 : peut-on voir la lumière ? conditions de vision | O1, O2 | Caisse vitrée à fond noir : laser sans fumée (seule la tache est vue), puis bâton d'encens (le faisceau apparaît) ; salle obscure : lampe d'architecte, livre, élève assis, carton qui coupe la lumière ; trois écrans percés à aligner (la lumière passe par les trous) ; tri sources primaires / objets diffusants ; règle sur l'illusion de Müller-Lyer, triangle de Kanizsa. |
| b1_opt1_a2_lois.html | A2 : réflexion et réfraction | O3, O4 | Disque optique sur pied, laser sur curseur : miroir (r = i pour cinq angles, retour inverse) ; demi-cylindre de plexiglas (sin i1 / sin i2 = 1,50 au tableur, retour inverse, angle limite ≈ 41,8°, réflexion totale) ; paille dans l'eau, reflet d'un arbre. |
| b1_opt1_a3_lentilles.html | A3 : lentilles face à un faisceau parallèle | O4 | Tableau magnétique, boîte à cinq rayons, lentilles profil L1 à L4 : foyer image réel ou virtuel (repère F', prolongements) ; f' mesurée (42, 28, 31 mm) comparée à R/(2(n − 1)) (40, 25, 29 mm : lentilles épaisses) ; loupes A et B au-dessus d'un texte. |

Les rayons traversant les lentilles sont calculés exactement, face par face (lois de Descartes en vecteurs, faces sphériques) :
on voit donc l'épaisseur et l'aberration des bords, et f' mesurée depuis le centre dépasse un peu la valeur de la lentille mince.

## Inscription au manifeste

Chaque simulation a sa fiche dans `contenu/manifeste.json` : chapitre (niveau/chapitre), activité de la fiche officielle,
objectifs, missions (titre, ce que fait l'élève, conclusion), durée estimée. Les agents ne reçoivent que les ressources
du chapitre du cours choisi dans `config/application.json`. Un test vérifie que chaque simulation de `sources/` est inscrite.

## Ce que la simulation envoie à la page du professeur

Quand elle est ouverte dans le cadre des médias, la simulation envoie (postMessage) :
`laboratoire_ouvert`, `etape_reussie`, `reponse` (avec juste / faux), `mission_terminee` (avec la durée),
`laboratoire_termine`. Ces messages ne sont pas encore enregistrés par le journal de recherche.
