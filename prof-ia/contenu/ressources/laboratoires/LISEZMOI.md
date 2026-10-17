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

## Inscription au manifeste

Chaque simulation a sa fiche dans `contenu/manifeste.json` : chapitre (niveau/chapitre), activité de la fiche officielle,
objectifs, missions (titre, ce que fait l'élève, conclusion), durée estimée. Les agents ne reçoivent que les ressources
du chapitre du cours choisi dans `config/application.json`. Un test vérifie que chaque simulation de `sources/` est inscrite.

## Ce que la simulation envoie à la page du professeur

Quand elle est ouverte dans le cadre des médias, la simulation envoie (postMessage) :
`laboratoire_ouvert`, `etape_reussie`, `reponse` (avec juste / faux), `mission_terminee` (avec la durée),
`laboratoire_termine`. Ces messages ne sont pas encore enregistrés par le journal de recherche.
