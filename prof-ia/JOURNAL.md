# Journal

## 2026-10-02 — Étape 1 : squelette du projet

Fait :
- Arborescence complète créée, dossiers vides compris.
- Quatre fichiers de réglages dans config/, expliqués dans ARCHITECTURE.md.
- Serveur FastAPI minimal : il sert les pages de client/ et la route /api/accueil.
- Page d'accueil sobre (nom, classe, cours), testée sur ordinateur et sur téléphone.
- outils/verifier_structure.py, 8 tests pytest réussis, README, .env.exemple, .gitignore.

Ajouts hors de l'arborescence d'origine (signalés) :
- serveur/configuration.py : un seul endroit pour lire config/.
- client/js/accueil.js, client/css/theme.css, base.css, formulaire.css : page d'accueil et design.
- Section « Design de l'interface » ajoutée à CLAUDE.md.

Problèmes restants, à faire par l'enseignant :
- Remplacer le titre du cours et les classes dans config/application.json.
- Copier le cours, les orientations, le QCM et les ressources dans contenu/.
- Confirmer le vouvoiement dans l'interface (ou passer au tutoiement).
- Le bouton « Commencer » affiche un message provisoire : l'enregistrement arrive à l'étape 7.

## 2026-10-02 — Étape 2 : manifeste et partition modèle

Fait :
- Cours rangé dans contenu/cours/ (Word + version texte avec les formules).
- Schémas du manifeste et de la partition ; manifeste proposé (6 ressources, toutes à fournir).
- outils/valider_partition.py + outils/controles_partition.py, messages en français ; 6 nouveaux tests (14 au total).
- Brouillon de la partie 1 (11 beats, activité 1) : valide, un avertissement (animation pas encore fournie).
- Titre du cours mis dans config/application.json.

Ajouts signalés :
- Bibliothèque jsonschema (vérifie les fichiers avec leurs schémas JSON).
- outils/controles_partition.py, pour garder valider_partition.py sous 150 lignes.

Problèmes restants, à faire par l'enseignant :
- Relire et corriger sorties/valide/partie_1.json (contenu, démarche, ancres), puis passer relu_par_enseignant à true.
- Fournir les ressources de contenu/manifeste.json, surtout l'animation de la grande roue.
- Le cours Word se termine par une phrase étrangère au cours (« C'est une excellente remarque pédagogique… ») : à supprimer.
- Vouvoiement ou tutoiement du prof : à confirmer (le brouillon vouvoie).
- Le schéma « repere_cercle » sera dessiné à l'étape 4.

## 2026-10-02 — Étape 3 : le tableau qui écrit

Fait :
- Vara.js essayé : ses polices n'ont pas d'accents (é, è, à, ç, ô deviennent « ? »). Remplacé par la police
  manuscrite Caveat, révélée de gauche à droite.
- Tableau SVG vert, zones de config/tableau.json, couleurs de craie selon le style, aucun chevauchement
  (zone pleine : message dans la console et écrit non affiché).
- Formules KaTeX + mhchem révélées de gauche à droite.
- Onglets Tableau 1, 2… ; les anciens restent consultables.
- client/demo_tableau.html : Lecture, Pause, Beat suivant ; 4 s par beat ; une seule écriture à la fois.
- Routes /api/tableau et /api/parties/<n> ; 3 nouveaux tests (17 au total).
- Zones titre et a_retenir agrandies : toute la partie 1 tient au tableau.

Ajouts signalés :
- client/js/lecteur/horloge.js, client/js/demo_tableau.js, client/css/tableau.css.
- client/bibliotheques/ : KaTeX 0.19.0, mhchem, police Caveat (copiés, pour travailler sans internet).
- Réglages ajoutés : dimensions, police, marge_zone, espace_entre_ecrits (config/tableau.json) ;
  chemins.parties_validees (config/application.json).

Problèmes restants :
- θ et Δ n'existent pas dans la police Caveat : le navigateur les prend dans une autre police (un peu différente).
- Actions dessiner (étape 4), media et prediction (étape 6) : pas encore au tableau, signalées sous les boutons.
- La pause arrête l'écriture en cours ; Beat suivant termine le beat en cours d'un coup.

## 2026-10-02 — Étape 4 : les schémas, et simulations interactives (demande de l'enseignant)

Fait (étape 4) :
- Rough.js ajouté (prévu dans CLAUDE.md) : traits d'aspect fait main, révélés trait par trait.
- Bibliothèque adaptée au cours de rotation : point, segment, fleche, cercle, angle, axe_rotation,
  repere_cercle (O, A, G, θ, s), disque_points (disque, axe, A et B).
- L'action « dessiner » réserve un carré dans la zone, sans chevauchement. Le repère du beat 8 s'affiche.
- Bouton « Tous les éléments » : la bibliothèque sur un onglet à part.

Fait (à la demande de l'enseignant, en avance sur l'étape 6) :
- Quatre simulations interactives dans contenu/ressources/animations/ : grande roue, repérage,
  table à coussin d'air (uniforme ou accélérée), rotation uniforme avec θ(t). Valeurs conformes au cours
  (arc A2A4 = 3,6 cm, 34°, VA = 0,45 m/s, ω = 7,5 rad/s).
- Cadre des médias : la simulation s'ouvre sur le tableau, Plein écran, la lecture attend « J'ai terminé ».
- Manifeste : 4 simulations ajoutées. Partie 1 : nouveau beat p1_b10 (simulation de repérage) ; beats renumérotés.
- Routes /api/manifeste et /ressources ; 1 nouveau test (18 au total).

Corrigé en testant :
- Les pointillés de l'axe (Δ) disparaissaient après le tracé.
- Le catalogue devenait la page où le cours s'écrivait.

Problèmes restants :
- Les événements des médias (ouverture, plein écran, durée) seront enregistrés à l'étape 6, avec la prédiction.
- Les ressources image (documents 1, 2, 3, 5 et enregistrement réel) restent à fournir.

## 2026-10-02 — Étape 5 (sans clé d'API) et étape 6 : voix, prédiction, événements

Fait (étape 5, sans clé : l'enseignant ajoutera la clé Gemini plus tard) :
- Interface de la voix (synthese.py), cache audio, contrôle du débit, ancrage (debut_s), outils/generer_audio.py.
- Voix « essai » : fichiers WAV muets de la durée de la parole, pour tester toute la chaîne sans clé.
- Lecteur : le prof « parle » (audio joué en suivant pause, reprise, Beat suivant), chaque écrit part à son debut_s.
- Partie 1 complétée : audio, durées et debut_s (148 s de parole estimée).

Fait (étape 6) :
- Prédiction : question, choix, justification obligatoire, puis réaction du prof selon le choix.
- Événements envoyés au serveur (api.js -> /api/evenements) : prediction (avec la conception révélée et le temps),
  media_ouvert, plein_ecran, media_termine (durée de manipulation). Le serveur les affiche dans le terminal.
- 4 nouveaux tests (22 au total).

Problèmes restants :
- Pas encore de vraie voix : gemini_tts.py et elevenlabs_tts.py seront écrits avec la clé et la documentation à jour,
  ainsi que la comparaison à l'aveugle des voix.
- Les événements ne sont pas encore enregistrés (étape 11 : journal SQLite) ni liés à un élève (étape 7 : pseudonyme).

## 2026-10-02 — Étape 7 : accueil, QCM et profil de l'élève

Fait :
- QCM diagnostique rédigé (brouillon) à partir du cours : 9 questions, 3 par partie, 17 conceptions décrites.
- Accueil : message sur l'IA ; à l'envoi, le serveur remplace le nom par un pseudonyme (E001…).
  La correspondance est dans sorties/prive/ (ignoré par git, jamais envoyé à une API).
- qcm.html : une question à la fois, choix + justification + certitude obligatoires, temps mesuré.
- Le navigateur ne reçoit jamais les bonnes réponses ni les conceptions.
- profil.py : réussites par partie, conceptions détectées, solidité (ancrée / probable / fragile selon la certitude).
- Page d'attente (barre simulée), puis entrée en classe. Les événements portent maintenant le pseudonyme.
- 5 nouveaux tests (27 au total) ; parcours complet testé dans le navigateur : le vrai nom n'apparaît que dans la correspondance.

Problèmes restants :
- QCM à relire et valider par l'enseignant (puis passer « statut » à « validé »).
- Classes à remplacer dans config/application.json.
- Un même élève qui revient reçoit un nouveau pseudonyme (à décider : faut-il le reconnaître ?).

## 2026-10-11 — Étapes 8 à 12 : l'application complète, prête à recevoir les clés

Fait (sans clé : tout ce qui parle à l'IA est testé avec de faux clients, aucun appel réel) :
- Étape 8 : six agents (prompts/*.md, schémas de réponse), appel_ia.py (cache du contexte, sortie JSON imposée,
  effort, repli, nouveaux essais, coût), assemblage de la partition par le code, orchestrateur avec relecture
  du chef (deux tours de corrections au plus), outils/generer_partie.py. Voix Gemini écrite (gemini_tts.py).
- Brouillons des parties 2 (vitesses) et 3 (rotation uniforme), avec prédiction et simulation ; vérifiés au tableau.
- Étape 9 : file d'attente (partie N, puis N+1 pendant que l'élève suit N ; repli sur la partie validée),
  vraie page d'attente, page de classe (classe.html), attente utile entre deux parties (« à retenir » à recopier).
- Étape 10 : main levée (question notée, réponse à la fin de la phrase, à voix haute et au brouillon).
  Sans clé : le professeur dit qu'il note la question.
- Étape 11 : journal de recherche SQLite (tous les événements, sous pseudonyme), questionnaire de fin
  (qcm.html?test=post), export CSV (outils/exporter_donnees.py), sans jamais lire la correspondance des noms.
- 44 tests réussis ; structure conforme ; parcours complet testé dans le navigateur.

Choix signalés :
- Entre deux parties, on ne repose pas les questions du QCM (cela fausserait le questionnaire de fin) :
  on montre « à retenir » de la partie précédente.
- Les réponses à la partie 1 du QCM partent dès la 3e question : la préparation de la partie 1 commence plus tôt.
- Bibliothèques anthropic et google-genai ajoutées à requirements.txt (prévues dans CLAUDE.md).
- Corrigé : un élément caché (bouton « Entrer en classe »…) restait visible ; règle [hidden] ajoutée à base.css.

Problèmes restants, à faire par l'enseignant :
- Relire les parties 1, 2 et 3 (sorties/valide/) et le QCM ; décider si le questionnaire de fin garde les mêmes questions.
- Ajouter les clés dans .env, puis suivre le README (« Ajouter les clés ») : voix Gemini, mode adaptatif.
- Vérifier les prix dans config/modeles.json et les noms des modèles de voix dans config/voix.json.
- ElevenLabs (comparaison des voix) n'est pas écrit : seulement utile si la voix Gemini ne convient pas.

## 2026-10-12 — Programme officiel : fiches JSON des orientations nationales

Fait :
- Lecture complète du document officiel (PDF de 165 pages, en arabe, 2007), page par page : son texte
  n'est pas lisible par un programme (polices anciennes), il a donc été lu en image.
- 63 fiches JSON (17 tronc commun, 17 en 1re année, 29 en 2e année), plus index.json et general.json.
  Chaque fiche : contenus, objectifs numérotés, activités, orientations, hors programme, horaire, pages
  sources, et ajouts propres à certaines filières (par exemple SM en 1re année, PC/SM en 2e année).
- Les agents reçoivent seulement la fiche du cours, adaptée à la filière (environ 1 300 jetons, mis en cache),
  avec des règles strictes dans prompts/commun.md, pedagogique.md, chef.md, repondeur.md.
- Chaque partie déclare ses objectifs officiels ; un objectif inconnu est refusé à la validation ;
  outils/couverture_orientations.py montre la couverture. Parties 1 à 3 : O1-O2, O3-O4, O5-O6.
- 5 nouveaux tests (49 au total).

Choix signalés :
- JSON plutôt que RAG : plus court, exact et reproductible pour un chapitre à la fois.
- Quelques éléments « hors programme » sont déduits de la progression (et signalés « déduit » dans la fiche).

Problèmes restants, à faire par l'enseignant :
- Relire les fiches : l'extraction et la traduction de l'arabe ont été faites par l'IA (statut indiqué dans index.json).
- Le document date de 2007 : vérifier qu'il n'existe pas de version plus récente pour vos classes.
- Choisir la filière de vos classes dans config/application.json (SE par défaut).

## 2026-10-12 — Laboratoires virtuels : chapitre tronc commun « Exemples d'actions mécaniques »

Fait :
- Moteur commun des laboratoires (contenu/ressources/laboratoires/commun/) : scène fixe 1024 × 640 mise à
  l'échelle (même mise en page sur téléphone, portable, TBI), zoom à deux doigts jusqu'à 5×, glisser-déposer
  réaliste, tablette (tableur à formules, graphique avec modélisation), carnet de missions, pense-bête,
  tableau magnétique de tri. Aucun panneau : seulement le laboratoire, ou l'espace pour les astres.
- Une simulation par activité de la fiche : A1 échelle des distances (O1), A2 gravitation (O2 : observation,
  actions réciproques, découverte de F = G·m·M/d² avec des sondes, G donnée comme constante), A3 force
  pressante (O4, O5, O6 : brique et mousse, classement des forces, capsule manométrique, baromètre).
  Deux compléments pour O3 (sans activité dans la fiche) : poids au dynamomètre, poids en altitude.
- outils/assembler_laboratoire.py : un seul fichier HTML autonome par simulation (186 à 213 ko).
- Vérifié : parcours complet des 5 simulations avec de vrais gestes (aucune erreur), pincement réel à
  deux doigts, rapport 1,6 identique sur 4 tailles d'écran, 52 tests réussis, structure conforme.

Choix signalés :
- Dégradés, ombres et animations sont utilisés dans les laboratoires (réalisme demandé), pas dans l'interface.
- Les anciennes simulations de contenu/ressources/animations/ sont laissées en place (le cours de rotation
  les utilise encore) ; elles seront remplacées quand le chapitre de rotation sera refait.
- contenu/ est exclu du contrôle de structure : les fichiers des laboratoires respectent quand même
  la limite de 150 lignes, sauf deux feuilles de style (carnet.css : 201, tablette.css : 218).

Problèmes restants, à faire par l'enseignant :
- Essayer les 5 simulations avec des élèves ; relire les consignes, les tolérances et les réponses attendues.
- Décider si les deux simulations complémentaires O3 sont gardées.
- Les messages postMessage des simulations ne sont pas encore enregistrés dans le journal de recherche,
  et les simulations ne sont pas encore dans contenu/manifeste.json (le cours actuel est la rotation).

## 2026-10-15 — Laboratoires : bouton « Pause » dans la simulation Soleil-Terre-Lune

Fait (demande de l'enseignant : la Lune est petite et bouge, on ne pouvait pas y poser la flèche F_T/L) :
- commun/bouton.js : bouton-poussoir lumineux « Pause / Lecture » sur le bord du poste d'observation
  (doigt, souris, clavier) ; la date affiche « temps arrêté ». Le carnet invite à l'utiliser.
- Flèche posée : on retient l'astre le plus proche du point de dépôt (la Lune près de la Terre n'est plus
  confondue avec la Terre) ; le nom F_T/L s'écrit à côté de la Lune.
- Chaque scène est découpée à sa taille : les cercles de la scène voisine ne débordent plus.
- Vérifié : temps arrêté puis relancé au clavier, flèche posée sur la Lune immobile ; parcours complets
  de l'activité 2, de l'activité 3 et de l'altitude sans erreur ; 52 tests réussis.

## 2026-10-15 — Laboratoires virtuels : chapitre tronc commun « Le mouvement »

Fait :
- Matériel commun (commun/) : table à coussin d'air en perspective (mobile lancé au doigt, table horizontale
  ou inclinée, fil accroché au clou central pour le mouvement circulaire), éclateur (τ = 20, 40, 60 ms),
  feuille d'enregistrement que l'on prend en main, transparent millimétré, règle qui pivote, flèches-vecteurs
  vitesse à tracer, calculs de vérification sur l'enregistrement de l'élève.
- Une simulation par activité de la fiche : A1 relativité (O1 : rue, cycliste, caméra fixe et caméra
  embarquée, cycloïde / cercle, bouton « Pause »), A2 repère d'espace et de temps (O1, O4), A3 vitesse
  instantanée (O2, O3, O4, table inclinée), A4 MRU et MCU (O4, O5, O6, deux missions).
- Corrections après captures : rue remontée pour que le vélo et les traces ne passent plus sous la tablette
  et le carnet (posés sur un muret) ; points du stroboscope régulièrement espacés ; numéros Mi placés de part
  et d'autre de la trajectoire (lisibles sur un cercle) ; feuille neuve si le mobile est repris en main
  pendant l'enregistrement ; flèches-vecteurs cachées tant que le fil n'est pas accroché (mission MCU).
- demarrage.js : la place de la tablette posée peut être choisie (repos_tablette) ; bouton.js découpé.
- Vérifié : parcours complets des 9 simulations (meca1 et meca2) avec de vrais gestes, sans erreur ;
  52 tests réussis ; structure conforme.

Problèmes restants, à faire par l'enseignant :
- Essayer les 4 simulations avec des élèves : vitesse du lancer, lisibilité des points sur le téléphone
  (zoomer pour mesurer au millimètre), tolérances des mesures (± 1,5 mm sur une distance).
- Les simulations ne sont pas encore dans contenu/manifeste.json.

## 2026-10-15 — Laboratoires virtuels : chapitre tronc commun « Principe d'inertie »

Fait :
- Une simulation par activité de la fiche :
  - A1 actions et mouvement (O2) : bille d'acier, gouttière, aimant, cale en bois, photographie à pose
    multiple ; palet sur la table à coussin d'air avec et sans air ;
  - A2 principe d'inertie (O1, O2) : palet au repos, palet lancé (distances mesurées au tableur), table inclinée ;
  - A3 centre d'inertie (O3, O4, O5) : deux palets solidaires lancés en tournant, curseur sur la feuille pour
    trouver G, mesure de GA et GB, relation barycentrique ; gommettes au centre de quatre solides homogènes.
- Matériel commun : soufflerie (commun/soufflerie.js) ; plusieurs tables à coussin d'air dans une même
  simulation (chaque table ne reçoit que ses étincelles ; le relevé indique la table et l'air) ; l'éclateur
  s'arrête seul quand le mobile s'arrête ; deux électrodes (marques A et B) pour les palets solidaires.
- Vérifié : parcours complets des 3 nouvelles simulations et des 4 du chapitre « Le mouvement », sans erreur.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : force de l'aimant, position de la cale, vitesse de rotation des palets solidaires.
- Les simulations ne sont pas encore dans contenu/manifeste.json.

## 2026-10-15 — Manifeste des ressources : les laboratoires virtuels

Fait (demande de l'enseignant : que l'IA trouve les simulations avec leurs métadonnées) :
- schemas/manifeste.schema.json : nouveaux champs facultatifs chapitre, activite (texte officiel), objectifs,
  conceptions, missions (titre, ce que fait l'élève, conclusion), duree_min.
- contenu/manifeste.json : toutes les simulations des laboratoires ; les 9 ressources du cours de rotation
  reçoivent leur chapitre (1bac/meca1_rotation).
- serveur/agents/commun.py : les agents ne reçoivent que les ressources du chapitre du cours choisi.
- Tests : filtre par chapitre ; chaque simulation de laboratoires/sources/ est inscrite au manifeste.

## 2026-10-15 — Laboratoires virtuels : chapitre tronc commun « Quantité de mouvement »

Fait :
- Une simulation par activité de la fiche : A1 définition de p (O1, O2), A2 explosion de deux mobiles
  (O3), A3 choc, barque, recul d'un canon (O3), A4 F = Δp/Δt par chronophotographie (O4).
- Matériel commun : dessin_palet.js, surcharge.js ; flèches de quantité de mouvement (lettre p, échelle en
  kg·m/s) ; l'éclateur note la masse du mobile ; une seule étiquette par point resté immobile ou très serré.
- Les 4 simulations sont inscrites au manifeste avec leurs métadonnées.
- Vérifié : parcours complets des 16 simulations des quatre chapitres, sans erreur ; 54 tests réussis.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : précision de lecture sur la règle (tolérance 3 mm), vitesse du lancer pour le choc.

## 2026-10-15 — Correction : la bille de « Actions mécaniques » ne partait pas

Problème signalé par l'enseignant : dans tc_meca3_a1_actions, toucher la bille ne la lâchait pas.
- Cause : la bille est redessinée à chaque image ; pendant un appui normal (plus long qu'un clic instantané),
  l'élément touché disparaissait et le navigateur annulait le « clic ».
- Correction (bille.js) : le geste est suivi par l'outil de glisser-déposer commun, sur le groupe de la bille ;
  un toucher court, un appui long ou un petit glissé lâchent la bille.
- Les tests de parcours font désormais des appuis de 150 ms (au lieu de clics instantanés) : les 16 simulations
  passent ; toucher au doigt vérifié sur écran tactile simulé.

## 2026-10-15 — Laboratoires virtuels : chapitre tronc commun « Équilibre d'un solide »

Fait :
- Une simulation par activité de la fiche : A1 ressort (O1), A2 poussée d'Archimède (O2), A3 trois forces
  à l'équilibre, méthodes analytique et graphique (O3), A4 frottement (O4), A5 moments, théorème des moments,
  couple de torsion (O5, O6, O7). Les 5 simulations sont inscrites au manifeste.
- Matériel commun : le dynamomètre, les masses marquées et l'accrochage (chapitre 1) passent dans commun/
  et deviennent réglables (calibre, préfixe des faits) ; potence.js (potence et coffret de masses).
- Tableur : la formule PI() est acceptée (comme dans un tableur habituel), en plus de PI.
- Corrections après captures : équilibre de l'anneau calculé avec le porte-masses posé sur la paillasse
  quand une force est trop grande ; position d'équilibre du cylindre dans le liquide (le ressort du
  dynamomètre se raccourcit) ; noix du plan inclinable sur la tige ; longueur du dynamomètre de traction.
- Vérifié : parcours complets des 21 simulations des cinq chapitres de mécanique, sans erreur.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : vitesse d'immobilisation des ressorts (2 s), précision de lecture des angles.
- Deux fonctions anciennes (accrochage.js, analyseur de formules.js) contiennent des fonctions internes et
  dépassent 30 lignes au sens strict du contrôle : à découper lors d'une prochaine étape.

## 2026-10-16 — Laboratoires virtuels : chapitre tronc commun « Courant électrique continu »

Fait :
- Une simulation par activité de la fiche : A1 électrisation par frottement (O1, O2), A2 nature du courant
  dans les métaux et les électrolytes, Q = I·Δt (O3, O4), A3 loi des nœuds et ampèremètre (O5).
  Les 3 simulations sont inscrites au manifeste (33 ressources).
- Nouveau matériel commun pour toute l'électricité : fils posés par l'élève (glisser d'une borne à l'autre,
  fiches empilées), calcul des courants, générateur (Marche/Arrêt, limitation, fiche dans la prise murale),
  lampe, DEL, interrupteur, multimètre en ampèremètre (calibres, dépassement), décor de paillasse vue de haut.
- Corrections après captures : baguettes reposées sur la paillasse quand on les lâche, torsion du fil de
  l'étrier, électrons placés entre les noyaux dans la loupe, cordon secteur terminé par une fiche dans la prise
  (remarque de l'enseignant), bouchons et pince du tube en U, étiquettes lisibles.
- Vérifié : parcours complets des 3 simulations, sans erreur ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : facilité à tirer les fils sur tablette (zone de prise des bornes : 13 px),
  vitesse de migration des ions (temps accéléré × 60), seuil d'attraction des petits papiers.

## 2026-10-16 — Corrections signalées par l'enseignant (électricité)

- Symbole de la DEL : triangle, barre et deux flèches de lumière qui sortent (symbole normalisé).
- Électrisation : les petits papiers faisaient des allers-retours sans fin. Cause : la baguette frottée les attirait
  de trop loin (137 px), même posée à sa place. Corrections : attraction à courte distance (5 cm au plus), seule une
  baguette tenue attire ; au contact, un papier prend la charge de la baguette, il est repoussé et n'est plus attiré
  pendant 20 s (ou jusqu'à un nouveau frottement) ; en lâchant la baguette, les papiers collés retombent dans la
  coupelle ; la baguette glisse jusqu'à sa place au lieu de sauter.
- Vérifié : parcours complets des 3 simulations du chapitre ; papiers immobiles une fois retombés.
- Chute des papiers (remarque de l'enseignant : elle n'était pas physique, le papier glissait en ligne droite vers
  sa place de départ). Nouveau fichier papiers_mouvement.js : chaque morceau a un point au sol et une hauteur ;
  attiré, il part de l'arrêt et accélère vers la baguette ; détaché, il tombe sous son poids, freiné par l'air
  (vitesse limite faible), se balance, tournoie et se pose juste en dessous ; son ombre au sol suit sa hauteur.

## 2026-10-16 — Laboratoires virtuels : chapitre tronc commun « Tension électrique »

Fait :
- Une simulation par activité de la fiche : A1 mesures de tensions continues (O1, O3, O4), A2 différence de potentiel
  (O2), A3 tensions variables à l'oscilloscope (O1, O5, O6). Inscrites au manifeste (36 ressources).
- Multimètre complet, comme un appareil réel : V⎓ (200 mV à 200 V), V~ TRMS, A⎓, quatre bornes (10A, mA, COM, VΩ),
  résolution et dépassement d'un appareil à 2000 points, notice de précision, fusible de la borne mA (il grille si
  l'on branche l'ampèremètre en dérivation). Les simulations du chapitre « Courant électrique continu » et leurs tests
  sont mis à jour pour ce multimètre.
- Nouveau matériel : résistances au vrai code des couleurs, pile 4,5 V, GBF, oscilloscope (trace déclenchée, repère de
  masse), lettres des bornes (P, N, A, B...). Calcul du circuit en alternatif par superposition (GBF).
- Détails corrigés après captures : bloc de trois prises au mur, chaque appareil secteur a sa fiche ; trace de la pile
  hors de l'écran avec 1 V/div (réglage de départ 2 V/div, vérification que le trait est visible) ; touches du GBF
  masquées par leur symbole ; lettres des bornes cachées par les fiches.
- Vérifié : parcours complets des 6 simulations d'électricité, sans erreur ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : lecture des divisions de l'oscilloscope (graduations de 0,2 div, zoom), tolérances des
  lectures (0,15 à 0,2 div), notation U_{PN} dans le carnet et UPN dans le tableur (les cellules n'ont pas d'indice).

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « Montages électriques »

Fait :
- Quatre simulations : A1 associations, résistivité, diviseur de tension (O1, O2, O3) ; A2 caractéristiques de dipôles
  passifs, Zener à l'oscilloscope, CTN et photorésistance (O4, O5) ; A2 suite, pile et électrolyseur (O6) ; A3 point de
  fonctionnement, loi de Pouillet, piles en série et adaptation (O7). Inscrites au manifeste (40 ressources).
- Calcul des circuits : dipôles non linéaires (Newton amorti), lampe à filament réaliste (sa caractéristique n'est
  plus une droite, ce qui aurait donné une fausse idée), diode et Zener exponentielles, électrolyseur ; GBF calculé
  instant par instant (remplace la superposition, qui ne permettait pas l'écrêtage de la Zener).
- Multimètre : fonction ohmmètre (courant de test, « 1 » si circuit ouvert, pas d'indication DC) ; commutateur
  réorganisé en 12 positions. Alimentation réglable (grossier ±1 V, fin ±0,1 V). Graphique de la tablette : deuxième
  courbe facultative (en orange) pour lire une intersection ; barre d'outils sur deux lignes.
- Détails corrigés après captures : bulles deux fois plus nombreuses à la cathode (dihydrogène), étiquettes
  raccourcies, nom des béchers, conclusion ajustée aux valeurs mesurées.
- Le script d'inscription au manifeste lit maintenant les missions réparties dans plusieurs fichiers.
- Vérifié : parcours complets des 10 simulations d'électricité ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : durée de stabilisation de la CTN (constante de temps 4 s), précision demandée pour r et r'
  (12 et 15 %), lecture de l'intersection (tolérance 7 mA).

## 2026-10-16 — Laboratoires virtuels : chapitre tronc commun « Montages électroniques »

Fait :
- Deux simulations : A1 transistor NPN — effet transistor, régimes, I_C = β·I_B, I_E = I_B + I_C, détecteur
  d'obscurité (O1, O2, O3, O6) ; A2 amplificateur opérationnel — caractéristique de transfert, suiveur, inverseur,
  non-inverseur à l'oscilloscope bicourbe, chaîne électronique (O4, O5, O6). Inscrites au manifeste (42 ressources).
- Calcul des circuits : sources commandées par une tension (transfert du transistor, sortie de l'AO). Transistor
  d'Ebers-Moll (β ≈ 150). AO : l'état linéaire, saturé + ou saturé − est choisi pour être cohérent avec ε (la méthode
  de Newton sur une courbe en tanh restait bloquée en saturation dans le suiveur).
- Matériel commun modifié (signalé) : multimètre à 13 positions (calibre 2 mA ajouté) ; oscilloscope réécrit pour une
  ou deux voies ; option « nom » du générateur (G1, G2).
- Détails corrigés après captures : brochage du BC547 (C, B, E de gauche à droite, côté plat devant) ; prises BNC de
  l'oscilloscope bicourbe cachées sous les touches TIME/DIV ; noms des bornes de l'AO cachés par les fiches ; pile
  déplacée (ses fils couvraient les touches du générateur) ; à l'étape de l'écrêtage, les deux courbes doivent tenir
  dans l'écran, pour ne pas confondre la saturation de l'AO avec une courbe coupée par le bord de l'écran.
- Vérifié : parcours complets des 12 simulations d'électricité ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Essayer avec des élèves : tolérance des lectures à l'oscilloscope (0,15 V + 3 %), nombre de couples (ε, Us) demandés
  (8), place de la pile qui fixe V− à 4,5 V (à expliquer avant la manipulation).

## 2026-10-16 — Laboratoires virtuels : chapitre tronc commun « Espèces chimiques »

Fait :
- Trois simulations : A1 les cinq sens (orange, papier, loupe ; on ne goûte jamais) ; A2 tests de détection avec
  témoins (sulfate de cuivre anhydre, papier pH, phénolphtaléine, eau iodée, liqueur de Fehling au bain-marie) ;
  A3 inventaire, classement naturelle / synthétique / artificielle, documents sur l'industrie chimique. Objectif O1.
  Inscrites au manifeste (45 ressources).
- Nouveau matériel commun de chimie (7 fichiers) : contenus et règles de couleur des tests, verrerie, pipettes
  compte-gouttes (une par produit, pour ne rien mélanger), tubes déplaçables, verres de montre, poudre et spatule,
  bain-marie, affiche de sécurité.
- Détails corrigés après captures : verres de montre trop petits (8 cm, plus larges qu'un bécher de 50 mL) ;
  gouttes déposées sur la poudre et non à côté ; pipettes Pasteur à tétine (sans bague) dans les béchers ; bleu de
  la liqueur de Fehling trop pâle ; thermomètre plongé dans l'eau ; écorce vidée après pressage ; loupe et couteau
  qui se chevauchaient ; pictogramme « environnement » du sulfate de cuivre ; flacons sans bouchon ; documents
  trop petits pour être lus.
- Vérifié : parcours complets des 3 simulations ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le temps est accéléré au bain-marie (précipité de Fehling en une trentaine de secondes au lieu de quelques minutes).
- Valider les textes des documents (70 % des réserves de phosphates, moins de 1 % de vanilline naturelle) et les
  étiquettes des produits.

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « Extraction, séparation et identification » et matériel physique de chimie

Fait :
- Demande de l'enseignant : matériel plus réaliste, à sa vraie taille, et physique respectée (« si on vibre beaucoup, le
  liquide sort »). Nouveau matériel commun : verrerie aux vraies dimensions (1,6 px par mm), liquides en phases rangées
  par densité, surface horizontale, ballottement, débordement, filet en chute libre, flaques, robinet (Torricelli),
  émulsion et décantation, partage du diiode, température des mélanges ; pipettes à gouttes réelles, verres de montre,
  porte-tubes, bain-marie, plaque de chromatographie.
- Trois simulations : A1 techniques traditionnelles (documents ; macération, infusion avec une bouilloire qui verse,
  décoction sur la plaque) ; A2 hydrodistillation, extraction à l'ampoule à décanter, filtration sous vide, montage à
  reflux ; A3 chromatographie sur couche mince (colorants d'un sirop de menthe, Rf ; espèces incolores révélées sous UV
  et au diiode). Inscrites au manifeste (48 ressources).
- Refaites avec ce matériel : chim1 A2 (tests de détection). Mises à la taille réelle : chim1 A1 et A3.
- Corrigé après captures : tuyaux qui semblaient fuir (enfilés sur l'olive, dans l'axe de l'embout) ; robinet trop près
  de la prise ; objets qui se chevauchaient quand on les repose ; bouilloire qui touchait le bécher en versant ;
  chronomètre qui cachait la poignée de versement ; filet d'eau invisible ; teinte des solutions diluées.
- Vérifié : parcours complets des 6 simulations de chimie ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Valider les Rf choisis (E102 0,72 ; E124 0,55 ; E131 0,38 dans l'eau salée ; paracétamol 0,45 ; caféine 0,25) et
  l'éluant du médicament (nommé « mélange de solvants préparé par le professeur »).
- Le temps est accéléré (1 s = 1 min) pour l'extraction du thé, l'hydrodistillation, la montée de l'éluant et le diiode.
- Verser exactement 100 mL demande de l'adresse (bécher incliné à la main) : la tolérance est de 70 mL au moins.

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « Synthèse d'espèces chimiques »

Fait :
- Deux simulations à taille réelle : A1 synthèse d'un savon (fiches de sécurité et pictogrammes, lunettes et gants
  exigés pour la soude, reflux de l'huile avec la soude et l'éthanol, relargage, filtration sous vide, mousse comparée
  à un savon du commerce) ; A2 arôme de banane (estérification au reflux avec catalyseur, lavage à l'eau salée à
  l'ampoule, odeur par déplacement d'air, comparaison par CCM avec l'arôme naturel et la référence). Objectifs O1 à O3.
  Inscrites au manifeste (50 ressources).
- Matériel commun : montage à reflux que l'élève assemble (entonnoir, réfrigérant à poser sur le col, eau, chauffe ;
  sans réfrigérant, les vapeurs s'échappent), pictogrammes SGH, équipement de protection, paillasse de synthèse.
- Rangement : Büchner, ampoule, chauffe-ballon, pierre ponce et chromatographie déplacés de chim2 vers commun ; chim2
  vérifié après le déplacement.
- Corrigé après essais : le ballon revenait sur le chauffe-ballon au lieu de verser ; un ballon à fond rond ne se pose
  plus sur la paillasse ; béchers reposés derrière le chauffe-ballon ou sur le flacon de pierre ponce ; limite entre
  deux phases incolores peu visible.
- Vérifié : parcours complets des 8 simulations de chimie ; tests (54) et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Valider les Rf de la CCM de l'arôme (ester 0,62 ; alcool isoamylique 0,36 ; autre espèce de la banane 0,18) et le
  rendement choisi (14 mL d'ester pour 15 mL d'alcool).
- Temps accéléré (1 s = 1 min) pour le reflux de 30 min et le refroidissement.
- Pour vider un ballon il faut l'incliner beaucoup (comme en vrai) : à expliquer aux élèves.

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « Modèle de l'atome »

Fait :
- Quatre simulations à taille réelle, inscrites au manifeste (54 ressources) : A1 histoire du modèle de l'atome
  (documents illustrés, classement par époque) et expérience de Rutherford (chambre de diffusion, vide, comptages N(θ)
  qui suivent la loi K / sin⁴(θ/2), tableur et courbe, ordres de grandeur) ; A2 tableau magnétique de l'atome (symbole
  ᴬ_ZX, ion Na⁺, isotope, couches K L M), masse des atomes au tableur, pesée d'un cylindre de cuivre ; A3 cycle du
  cuivre sous la hotte (Cu, Cu²⁺, Cu(OH)₂, CuO, Cu²⁺, Cu) ; A4 combustion du carbone dans le dioxygène, eau de chaux,
  documents sur le cycle du carbone, l'abondance des éléments et le Soleil. Objectifs O1 à O5.
- Matériel commun : balance électronique, cylindres de métal, pot de poudre et spatule, bec Bunsen ; petits ajouts à
  documents_mur.js (illustration), verrerie_profils.js (flacon à gaz), verrerie_accessoires.js (plaque de verre),
  recipient_gestes.js (pas de versement dans un récipient fermé par un objet).
- Corrigé après essais : bouche des récipients mal calculée (la poudre et le gaz roux partaient du fond du tube) ;
  spatule invisible sur la paillasse (elle est maintenant plantée dans le pot) ; on pouvait verser l'eau de chaux dans
  le flacon fermé par le têt ; charbon chauffé « à blanc » dans la flamme (limité à 950 °C) ; pompe cachée par la
  tablette ; schéma du cycle du carbone illisible.
- Vérifié : parcours complets des 4 nouvelles simulations ; les 10 simulations de chimie reconstruites sans erreur ;
  tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Rutherford : nombres choisis pour l'enseignement (1,2 million de particules par minute à 0°, K = 3 par minute) ;
  la vraie source d'une salle de classe donne beaucoup moins de coups (comptages de plusieurs minutes).
- Cycle du cuivre : quantités en « unités de cuivre », réactions accélérées (quelques secondes) ; l'attaque nitrique se
  fait sous la hotte, à valider selon les consignes de sécurité de l'établissement.
- Têt à combustion : il faut garder le doigt appuyé pour le tenir dans la flamme (environ 5 s).

## 2026-10-17 — Correction : bécher qui disparaît après un versement (paillasses à chauffe-ballon)

Fait :
- Problème signalé : sur les paillasses de synthèse (savon, arôme), un bécher que l'on touche après avoir versé dans
  l'entonnoir disparaissait. Cause : aucune place libre n'était trouvée près de l'endroit où il était tenu, et il était
  reposé à l'aplomb du ballon, caché derrière le chauffe-ballon.
- recipient_gestes.js : un toucher après un versement remet le récipient à sa place de départ (ou à la place libre la
  plus proche de celle-ci) ; s'il n'y a aucune place libre, il revient à sa place de départ, jamais derrière un appareil.
- Les 8 simulations de chimie qui utilisent ce fichier ont été reconstruites et leurs parcours complets relancés.

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « Géométrie de quelques molécules »

Fait :
- Deux simulations, inscrites au manifeste (56 ressources) : A1 ions monoatomiques (Na⁺, Cl⁻ sur le tableau de l'atome,
  règles du duet et de l'octet), tableau magnétique de Lewis (H₂O, NH₃, CH₄, CO₂, N₂, C₂H₄ ; le tableau dit quelle
  règle n'est pas respectée), isomères de C₂H₆O et C₄H₁₀, formules semi-développées, limites du modèle (NO₂) ; A2 boîte
  de modèles moléculaires et modèle en 3D que l'on tourne (CH₄ 109,5°, NH₃ 107°, H₂O 104,5°, C₂H₄ plane, CO₂ linéaire),
  représentation de Cram du méthane. Objectifs O1 à O4.
- Matériel commun : tableau de Lewis (règles, dessin, gestes), géométrie et rendu 3D des modèles moléculaires, atelier
  d'assemblage, boîte de modèles. tableau_atome.js déplacé de chim4 vers commun (chim4 A2 vérifié après le déplacement).
- Corrigé après essais : NH₃ refusé parce que la formule brute était écrite « H₃N » (les formules sont maintenant
  comparées atome par atome) ; dernière rangée du quadrillage sous le bouton « Tout ranger » ; modèle trop petit et vu
  dans l'axe ; bâtonnets dessinés par-dessus les boules.
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le modèle 3D est 1,8 fois plus grand qu'un modèle d'élève (comme un modèle de démonstration).
- Les doublets non liants ne sont pas montrés sur les modèles (comme dans les boîtes du commerce) : ils sont seulement
  évoqués dans les questions.
- Le tableau de Lewis n'accepte que des liaisons entre points voisins du quadrillage (horizontales ou verticales).

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « Classification périodique des éléments »

Fait :
- Deux simulations, inscrites au manifeste (58 ressources) : A1 documents historiques et cartes à ranger comme
  Mendeleïev ; lithium, sodium, potassium dans l'eau (derrière un écran, phénolphtaléine, flamme lilas du potassium) ;
  halogénures et nitrate d'argent (trois précipités) ; A2 tableau périodique magnétique à remplir (Z ≤ 18), liaisons et
  ions d'après la colonne, Lewis de H₂S, PH₃, SiH₄, CCl₄, formule de MgCl₂. Objectifs O1 à O4.
- Matériel commun : tableau à cartes, cristallisoir de 90 mm ; tableau de Lewis étendu à F, Si, P, S ; lewis_verif.js
  déplacé dans commun (chim5 A1 revérifié).
- Corrigé après essais : grain de métal invisible (surface de l'eau mal calculée) ; pinces flottantes au-dessus des
  flacons (elles sont maintenant dans les flacons) ; pictogrammes sur le nom du métal.
- Vérifié : parcours complets des deux simulations, et de chim5 A1 ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La réaction des alcalins avec l'eau est normalement faite par le professeur : la simulation la montre derrière un
  écran de protection, lunettes exigées.
- Les masses des cartes de Mendeleïev sont arrondies (valeurs connues en 1869).

## 2026-10-17 — Laboratoires virtuels : chapitre tronc commun « La mole et la concentration »

Fait :
- Deux simulations, inscrites au manifeste (60 ressources) : A1 masses molaires au tableur, pesée de 0,010 mol de quatre
  solides, 0,10 mol d'éthanol prélevé à la pipette graduée et vérifié à la balance, volume molaire des gaz ; A2
  dissolution du saccharose (avec et sans agitation), du diiode dans l'eau et dans l'éthanol, mélange éthanol-eau,
  solutions moléculaires et ioniques ; préparation de 100,0 mL de glucose à 0,100 mol/L en fiole jaugée ; dilution dix
  fois d'une eau iodée. Objectifs O1 à O5.
- Matériel commun : pesée de poudre, pipette graduée à molette, versement et rinçage d'une coupelle, dissolution,
  agitateur, pissette, fioles jaugées de 100 et 50 mL (entonnoir, bouchon, loupe sur le trait, homogénéisation) ;
  ménisque dessiné dans les cols étroits.
- Corrigé après essais : entonnoir qui ne recevait pas la poudre ; cristaux trop petits pour être vus (ils forment
  maintenant un petit tas) ; trait de jauge invisible dans la loupe ; volume de la fiole noté trop tard.
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La vitesse de dissolution est accélérée par rapport à la réalité (pour que l'élève n'attende pas des minutes).
- Le volume ne change pas quand un solide se dissout (on néglige la contraction).
- Les fioles se secouent d'un mouvement de va-et-vient : on ne peut pas les retourner.

## 2026-10-18 — Laboratoires virtuels : chapitre tronc commun « Transformation chimique d'un système »

Fait :
- Deux simulations, inscrites au manifeste (62 ressources) : A1 cuivre dans le nitrate d'argent, fer dans le sulfate de
  cuivre, identification des ions à la soude, précipitation de l'hydroxyde de cuivre ; combustions du soufre et du fer
  dans le dioxygène, du sodium dans le dichlore (sous la hotte) ; écriture et ajustement de sept équations au tableau
  magnétique. A2 vinaigre et hydrogénocarbonate de sodium : quatre essais, CO₂ recueilli sur la cuve à eau, avancement
  maximal et réactif limitant, tableau d'avancement et bilan de matière. Objectifs O1 à O4.
- Matériel commun : métaux et ions, flacons de gaz, têt à combustion et réactifs, règles et tableau des équations,
  dégagement gazeux, recueil de gaz sur la cuve à eau.
- Corrigé après essais : tube à dégagement qui s'arrêtait sous l'éprouvette (il entre maintenant dans l'éprouvette) et
  tube d'égalisation de l'ampoule dessiné par-dessus la poire (signalés par l'enseignant) ; tuyau du bec Bunsen collé au
  flacon ; aimants de la réserve qui changeaient de place ; essais non enregistrés (fin de réaction trop lente).
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La combustion du sodium dans le dichlore est une expérience de professeur : la simulation l'impose sous la hotte, lunettes mises.
- Le dioxyde de carbone un peu soluble dans l'eau de la cuve est négligé.
- Les réactions sont accélérées (une minute au lieu de plusieurs pour les métaux dans les solutions).

## 2026-10-23 — Laboratoires virtuels : chapitre 1re année du bac « Rotation d'un solide autour d'un axe fixe »

Fait :
- Trois simulations, inscrites au manifeste (65 ressources) : A1 grande roue et chronophotographie, tri de mouvements du
  vécu ; A2 solide pivotant sur la table à coussin d'air, rapporteur et règle sur la feuille, θ(t), ω et v = R·ω ;
  A3 disque entraîné par un moteur, stroboscope (salle obscure), capteur optique à fourche et compteur-chronomètre.
  Objectifs O1 à O6.
- Matériel commun : bouton de réglage rotatif, rapporteur. Modifiés (ajouts, valeurs par défaut inchangées) : tri.js,
  coussin_air.js, feuille_enregistrement.js.
- Corrigé après essais : réserve du tri qui débordait, trépied de l'appareil photo sur la tablette, fiche dessinée
  par-dessus la feuille, chiffres des afficheurs cachés, stroboscope qui ne montrait qu'un trait à fe = 2f.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La mise en vitesse du moteur est rapide (un tiers de seconde) pour que l'élève n'attende pas.
- La persistance rétinienne est simplifiée (images gardées un tour, au moins un dixième de seconde).
- Le solide pivotant de l'activité 2 tourne sans frottement : sa rotation est parfaitement uniforme.

## 2026-10-23 — Laboratoires virtuels : chapitre 1re année du bac « Travail et puissance d'une force »

Fait :
- Deux simulations pour l'activité unique de la fiche, inscrites au manifeste (67 ressources) : translation (pavé tiré
  avec un angle, tri moteur/résistant/nul, plan incliné et niveau laser) ; rotation (poulie à deux gorges, treuil
  électrique avec chronomètre à deux cellules et compte-tours). Objectifs O1 à O5.
- Matériel commun : dynamomètre de traction (tiré dans toutes les directions). Modifié : formules.js (COS et SIN).
- Corrigé après essais : repère A et charnière du plan cachés par le carnet et la tablette (matériel recentré), rapporteur
  du plan illisible sur la paillasse sombre, câbles du moteur qui passaient sur le chronomètre (ils passent à droite).
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le pavé démarre et s'arrête sans à-coup : on ne voit pas la différence entre frottement statique et dynamique au dynamomètre.
- Le rendement du moteur du treuil n'est pas abordé (pas de mesure de puissance électrique).
- Sur le plan incliné, l'inclinaison va de 18° à 40° (au-dessous, la planche de 90 cm est trop courte).

## 2026-10-23 — Laboratoires virtuels : chapitre 1re année du bac « Le travail, mode de transfert d'énergie »

Fait :
- Quatre simulations, inscrites au manifeste (71 ressources) : A1 banc à coussin d'air et curseur à frottement, volant
  d'inertie freiné ; A2 table à coussin d'air inclinée (théorème de l'énergie cinétique) ; A3 chute libre et énergie
  potentielle ; A4 conservation de Em en chute libre, non-conservation sur un rail incliné à débit d'air faible.
  Objectifs O1 à O5.
- Matériel commun : appareil de chute libre (électroaimant, deux cellules déplaçables, chronomètre à deux voies).
- Corrigé après essais : mobile du banc difficile à saisir (zone de prise agrandie), levier du frein qui traversait le
  disque de rechange, titres illisibles sur le boîtier clair, câbles qui croisaient l'électroaimant ou passaient sur la
  règle (boîtiers déplacés, câbles derrière la règle).
- Vérifié : parcours complets des quatre simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le volant se freine avec un couple constant : la fin de la rotation est plus brusque que dans la réalité.
- La chute de la bille est en temps réel (moins d'une demi-seconde) : on ne la suit presque pas des yeux.
- Les frottements du débit faible sont modélisés par une force constante.

## 2026-10-23 — Laboratoires virtuels : chapitre 1re année du bac « Travail et énergie interne » (SM)

Fait :
- Une simulation à trois paillasses pour l'activité unique de la fiche, inscrite au manifeste (72 ressources) : tube à
  grenaille de plomb (énergie mécanique perdue → énergie interne), tableau des effets du travail, seringue à gaz chargée
  de masses (travail des forces pressantes, premier principe). Objectifs O1 à O4.
- Corrigé après essais : nombres de la seringue illisibles sur le mur clair (étiquettes blanches), câble de la sonde qui
  passait devant le cylindre.
- Vérifié : parcours complet ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- L'échauffement du gaz à la compression est adouci (le calcul adiabatique donnerait des dizaines de degrés).
- Les 60 retournements du tube prennent environ une minute : on peut réduire le nombre demandé.

## 2026-10-23 — Laboratoires virtuels : chapitre 1re année du bac « Énergie thermique, transfert thermique »

Fait :
- Trois simulations, inscrites au manifeste (75 ressources) : A1 gobelet et thermoplongeur (Q = m·c·Δθ) ; A2 calorimétrie
  (capacité thermique du calorimètre, chaleur massique d'un métal, chaleur latente de fusion de la glace) ; A3 lampe et
  plaques noire et brillante, modes de transfert. Objectifs O1 à O6.
- Matériel commun : modèle thermique d'un vase, calorimètre et gobelet dessinés, bécher que l'on vide dans un vase.
- Corrigé après essais : câble du thermoplongeur sur un bouton, thermoplongeur sans support (potence ajoutée), sonde et
  agitateur qui flottaient (barrette sur le bord), potence de la lampe qui cachait une plaque, nombres illisibles.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les béchers se remplissent d'eux-mêmes quand on vide le gobelet (le préparateur n'est pas représenté).
- Le cylindre de métal ne refroidit pas pendant son transport de l'eau bouillante au calorimètre.
- Le rayonnement reçu suit une loi en 1/d² simplifiée (lampe ponctuelle).

## 2026-10-24 — Laboratoires virtuels : chapitre 1re année du bac « Énergie potentielle électrostatique » (SM)

Fait :
- Trois simulations, inscrites au manifeste (78 ressources) : A1 pendule électrostatique et électroscope (frottement,
  contact, influence) ; A2 balance de Coulomb et lignes de champ dans la semoule ; A3 cuve rhéographique (potentiel,
  champ uniforme, travail et énergie potentielle électrostatique). Objectifs O1 à O4.
- Réutilisé sans modification : frottement.js de la simulation tc_elec1_a1_electrisation (baguettes et chiffons).
- Corrigé après essais : boule collée à la baguette après le contact (attraction par influence bornée de près), bouton
  placé sur la trajectoire de la boule, support isolant ajouté (on ne peut pas tenir la baguette et poser le doigt à la
  fois), câbles de la cuve de semoule cachés sous la cuve, grains éloignés qui ne s'alignaient pas.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les charges ne fuient pas dans l'air (en réalité, elles disparaissent en quelques minutes par temps humide).
- La cuve rhéographique est idéale : potentiel exactement linéaire entre les plaques, constant au-delà.
- L'en-tête de frottement.js (tronc commun) ne cite pas encore cette simulation parmi ses utilisateurs.

## 2026-10-24 — Laboratoires virtuels : chapitre 1re année du bac « Transfert d'énergie dans un circuit électrique »

Fait :
- Quatre simulations, inscrites au manifeste (82 ressources) : A1 lampe, moteur et électrolyseur, tri des appareils ;
  A2 énergie et puissance reçues par un moteur, rendement ; A3 loi de Joule par calorimétrie, effet Joule utile ou
  nuisible ; A4 bilan de puissance d'une pile, I = E/Req, piles en série. Objectifs O1 à O6.
- Matériel commun nouveau : moteur à treuil (f.c.é.m., masse de 200 g, cellules, chronomètre, fin de course).
- Modifié hors de l'étape (signalé) : commun/circuit_generateur.js — touches de réglage déplacées sur le dessus du
  boîtier (un câble branché sur N ou P passait sur elles et prenait le clic) ; nom G1/G2 décalé à gauche quand
  l'alimentation est réglable. Les 14 simulations d'électricité ont été réassemblées ; les parcours des 5 simulations
  qui ont une alimentation réglable (tronc commun elec3 et elec4) passent toujours.
- Corrigé après essais : cellules et règle du treuil qui flottaient (barres de fixation), afficheur Δt caché par les
  câbles (chronomètre fixé à la tige), récepteurs placés sous les câbles (lampe et électrolyseur remontés), fusible mA
  grillé au démarrage du moteur (r' porté à 25 Ω, masse 200 g), câble de la pile 2 qui traversait son boîtier.
- Vérifié : parcours complets des quatre simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le bilan SM avec transistor ou AO (objectif O7) n'a pas de simulation dans ce chapitre.
- Dans le calorimètre, la chaleur de la résistance passe tout de suite à l'eau (pas de retard ni de gradient).
- Le moteur à treuil ne chauffe pas visiblement ; la chaleur Q est seulement calculée.

## 2026-10-24 — Laboratoires virtuels : chapitre 1re année du bac « Magnétisme »

Fait :
- Trois simulations, inscrites au manifeste (85 ressources) : A1 champ d'un aimant (boussole, limaille, teslamètre),
  aimant brisé, superposition de deux champs, champ terrestre, expérience d'Œrsted ; A2 champ d'un fil, d'une spire, d'une
  bobine (B ∝ I) ; A3 rails et balance de Laplace, courants parallèles, faisceau d'électrons, haut-parleur, moteur,
  induction (observation). Objectifs O1 à O6.
- Matériel commun nouveau : calcul du champ (terre, aimants, Biot et Savart), feuille vue d'en haut, barreau aimanté,
  boussole, limaille, teslamètre (composantes, zéro), générateur de courant.
- Corrigé après essais : limaille trop uniforme (désordre qui dépend de B), rose des vents cachée par la limaille, cercles
  du fil invisibles à 10 A (20 A pour l'observation), plateau tournant trop grand pour la balance, tare détectée au
  démarrage, rapport du générateur réécrit pour l'expérience d'Œrsted.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La limaille s'aligne aussitôt quand on déplace un aimant (en vrai, il faut tapoter de nouveau).
- Le haut-parleur, le moteur et l'induction sont des modèles animés simplifiés (pas de mesure).
- Le teslamètre mesure la valeur de la composante choisie, sans orientation de la sonde.

## 2026-10-26 — Laboratoires virtuels : chapitre 1re année du bac « Conditions de visibilité d'un objet »

Fait :
- Trois simulations, inscrites au manifeste (88 ressources) : A1 voir la lumière (laser et fumée), conditions de vision,
  propagation rectiligne, sources, rôle du cerveau ; A2 lois de la réflexion et de la réfraction sur un disque optique ;
  A3 lentilles convergentes et divergentes (tableau magnétique, tracé exact des rayons), loupes. Objectifs O1 à O4.
- Matériel commun nouveau : rayon lumineux, pied et noix, lampe sur douille, module laser, écran percé, lampe
  d'architecte, livre, élève assis.
- Corrigé à la demande de l'enseignant : objets plats ou flottants remplacés par du matériel en volume posé sur la
  paillasse (pieds, noix, caisse vitrée, chevalets, règle à faire glisser, disque sur pied avec épaisseur, laser
  cylindrique) ; dans les écrans percés, la lumière entre par chaque trou et ressort derrière le carton.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les loupes agrandissent ou réduisent le texte d'un facteur fixe (pas de calcul selon la distance au texte).
- Les angles du disque optique sont entiers ; la lecture de i2 se fait sur les graduations (à 0,5° près).

## 2026-10-26 — Laboratoires virtuels : chapitre 1re année du bac « Obtention de l'image d'un objet »

Fait :
- Trois simulations, inscrites au manifeste (91 ressources) : A1 miroir plan (deux bougies, champ de vision) ;
  A2 lentille convergente au banc d'optique (foyer, distance focale, vergence, conditions de Gauss, images réelles et
  virtuelle) et construction de l'image sur une planche à dessin ; A3 relations de conjugaison et de grandissement au
  banc, loupe. Objectifs O1 à O6.
- Matériel commun nouveau : banc d'optique (rail gradué sur pieds, cavaliers, lanterne « F », lentille, écran quadrillé),
  calcul de l'image (nette ou floue) et faisceau visible.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La mise au point se fait au millimètre en faisant glisser les cavaliers : sur un petit écran, zoomer à deux doigts aide.
- Le flou d'aberration sans diaphragme est un modèle simple (valeur fixe), pas un tracé des rayons des bords.
- À la loupe, l'œil est fixe ; on ne peut pas rapprocher l'œil de la loupe.

## 2026-10-26 — Laboratoires virtuels : chapitre 1re année du bac « Quelques instruments d'optique »

Fait :
- Deux simulations, inscrites au manifeste (93 ressources) : A1 la lunette astronomique (documents, tri, maquette au
  banc tournée vers la Lune, lunette afocale, grossissement, cercle oculaire, faisceau) ; A2 le microscope (microscope
  en volume, mise au point, mesure du champ et d'une cellule, grossissement commercial, limites ; modèle au banc).
  Objectifs O1 à O4.
- Matériel commun nouveau : calcul des instruments à plusieurs lentilles et vue « ce que voit l'œil »
  (instrument_optique.js) ; au banc d'optique : oculaire, taille de l'objet « F » réglable, étiquettes à la bonne largeur.
  Les simulations de l'activité précédente (opt2) ont été réassemblées et retestées avec ce banc.
- Vérifié : parcours complets des deux simulations et des simulations d'optique déjà faites ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La lame ne se déplace pas sur la platine : on observe toujours le centre de la préparation.
- Le grossissement « à vide » et la baisse de lumière aux forts grossissements sont des modèles simples (qualitatifs).
- Le champ visible quand l'œil s'éloigne du cercle oculaire est un modèle qualitatif (conforme à la fiche : pas d'étude quantitative).

## 2026-10-26 — Laboratoires virtuels : chapitre 1re année du bac « Importance de la mesure des quantités de matière »

Fait :
- Une simulation (l'unique activité de la fiche), inscrite au manifeste (94 ressources) : documents et tri des mesures
  par domaine ; bandelettes « nitrates » dans trois eaux (potabilité) ; échelle de teintes du colorant E131 dans une
  boisson (concentration, dose journalière admissible). Objectif O1.
- Vérifié : parcours complet ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les teneurs (nitrates, colorant) sont fixées dans le code ; on peut les changer pour varier les exercices.
- Une bandelette ne se trempe qu'une fois ; on ne peut pas reprendre une bandelette déjà lue.

## 2026-10-26 — Laboratoires virtuels : chapitre 1re année du bac « Grandeurs physiques liées aux quantités de matière »

Fait :
- Trois simulations, inscrites au manifeste (97 ressources) : A1 le gaz parfait (Boyle-Mariotte à la seringue, pression
  et température au bain thermostaté, PV = nRT) ; A2 les solutions électrolytiques (molécules polaires, solide ionique,
  préparation d'une solution de sulfate de cuivre, tests d'ions, migration des ions) ; A3 un gaz produit par une
  transformation (pression mesurée, tableau d'avancement, réactif limitant, prévision). Objectifs O1 à O9.
- Matériel commun nouveau : pressiomètre numérique et thermomètre électronique (capteurs_numeriques.js).
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les gaz sont parfaits et la température de la salle est fixe (20 °C) ; la réaction du magnésium ne chauffe pas l'acide.
- Dans les tubes, l'ordre des réactifs n'est pas pris en compte (par exemple, pas d'oxyde d'argent avec la soude) :
  « Nouveaux tubes » permet de faire chaque test sur une solution neuve.
- La vitesse de migration des ions est fixée (quelques millimètres par seconde, accélérée).

## 2026-10-26 — Laboratoires virtuels : chapitre 1re année du bac « La conductance »

Fait :
- Trois simulations, inscrites au manifeste (100 ressources) : A1 mesure de la conductance (ions indispensables,
  G = I/U, facteurs L, S, C, conductivité) ; A2 courbe d'étalonnage au chlorure de sodium et sérum physiologique ;
  A3 solutions de même concentration et conductivités molaires ioniques. Objectifs O1 à O6.
- Matériel commun nouveau : conductimetrie.js (λ, σ, G) et cellule_conductance.js (cellule à plaques parallèles,
  support élévateur, béchers de la verrerie physique).
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La température reste à 25 °C (son influence est seulement citée).
- La gêne entre ions est un modèle simple (1 − 0,5·√C).

## 2026-10-26 — Laboratoires virtuels : conductance avec le vrai matériel d'électricité

Fait (à la demande de l'enseignant : verrerie et appareils réalistes, comme dans les autres simulations) :
- Les béchers sont ceux de la verrerie physique (on les prend, on les pose sur le plateau, on peut verser).
- Les appareils simplifiés de l'étagère sont remplacés par le GBF et les deux multimètres des simulations d'électricité.
  L'élève câble le circuit et choisit les calibres ; une première étape « montage et calibres » est ajoutée aux trois
  activités. La cellule de conductance devient un composant du circuit (poste_conductance.js, nouveau).
- Fichiers communs modifiés (signalé) : multimetre_mesure.js et multimetre.js reçoivent les calibres 2 V~, 20 mA~ et
  200 mA~ (valeur efficace du courant) ; le commutateur passe de 13 à 16 positions (repères un peu plus écartés).
  conductimetrie.js perd l'étagère d'appareils, devenue inutile.
- Vérifié : parcours complets des trois simulations de conductance et des quinze simulations d'électricité qui
  utilisent le multimètre ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les plaques ne se polarisent pas, quelle que soit la fréquence du GBF (la conductance ne dépend pas de f).
- Pas de calibre 2 mA~ : pour les solutions très diluées, il faut augmenter l'amplitude du GBF.

## 2026-10-27 — Laboratoires virtuels : chapitre 1re année du bac « Titrages »

Fait :
- Quatre simulations, inscrites au manifeste (104 ressources) : A1 transfert de protons (indicateurs, vinaigre + soude,
  ammoniaque + acide) ; A2 transfert d'électrons (fer et ions cuivre, Javel et iodure, diiode et vitamine C) ; A3 titrage
  conductimétrique d'un déboucheur ; A4 titrages colorimétriques (fer II par le permanganate, diiode par le thiosulfate).
  Objectifs O1 à O6.
- Matériel commun nouveau : reactions_totales.js, acide_base.js, oxydoreduction.js (chimie des espèces, pH, couleurs) ;
  burette.js, agitateur_magnetique.js, conductimetre.js, poste_titrage.js (paillasse de titrage à 1 px/mm).
- Remarque de l'enseignant prise en compte : la sonde du conductimètre et le barreau aimanté sont dessinés derrière la paroi
  avant du bécher (on les voit à travers le verre), comme la pipette dans un bécher.
- Vérifié : parcours complets des quatre simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La burette est remplie et ajustée au zéro par une touche (pas de rinçage ni de remplissage geste par geste).
- Les prises d'essai (10,0 mL) sont déjà dans les béchers : la pipette jaugée n'est pas manipulée.
- Le tableur a 11 lignes : le titrage conductimétrique se fait en 11 mesures (environ tous les 1,5 mL).
- Le pH des mélanges est un modèle simple (acides et bases forts, deux couples faibles) ; le jus de citron n'a qu'un pH.

## 2026-10-27 — Laboratoires virtuels : chapitre 1re année du bac « Expansion de la chimie organique »

Fait :
- Une simulation (l'unique activité de la fiche), inscrite au manifeste (105 ressources), en trois paillasses : documents
  (composition, histoire, matières naturelles, diversité et économie) ; combustion d'une bougie (buée et eau de chaux :
  éléments hydrogène et carbone) ; modèles moléculaires de l'éthane, de l'éthène et de l'éthyne. Objectifs O1, O2.
- Fichiers communs modifiés (signalé) : molecule_3d.js, modele_dessin.js, modele_atelier.js reçoivent la liaison triple
  (trois ressorts, molécule linéaire) et le bilan compte les liaisons simples, doubles et triples. La simulation
  « représentation de Cram » du tronc commun a été rejouée : elle passe.
- Vérifié : parcours complet ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La buée n'est pas testée au sulfate de cuivre anhydre (ce test est seulement rappelé dans les données).
- Un trou libre tourné vers l'arrière n'est pas visible : il faut incliner le modèle (indiqué dans l'aide).

## 2026-10-27 — Laboratoires virtuels : chapitre 1re année du bac « Lecture d'une formule chimique »

Fait :
- Trois simulations, inscrites au manifeste (108 ressources) : A1 squelette carboné (solubilité, densité, températures
  d'ébullition, courbe Téb = f(n)) et tests des groupes caractéristiques (DNPH, Fehling, BBT, permanganate) ; A2 modèles
  moléculaires (isomères de constitution, noms officiels, isomérie Z/E) et documents (pétrochimie, polymères) ; A3 synthèse
  de l'acide benzoïque (reflux, deux filtrations sous vide, précipitation, pesée, rendement, chromatographie).
  Objectifs O1 à O7.
- Matériel commun nouveau : chimie_organique.js, nomenclature.js.
- Fichier commun modifié (signalé) : modele_atelier.js ajoute le nom officiel du modèle à son bilan. La simulation
  « représentation de Cram » du tronc commun a été rejouée : elle passe.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les paillasses de filtration, de précipitation et de pesée partent de quantités préparées (elles ne reprennent pas ce que
  l'élève a obtenu au reflux) ; la masse de produit sec est fixée à 1,62 g (rendement d'environ 69 %).
- Le séchage à l'étuve et la température de fusion (banc Kofler) sont seulement cités ; le pH du filtrat acidifié n'est
  pas mesuré au papier pH.
- Le nom officiel n'est calculé que pour les alcanes et les alcènes de six carbones au plus (ramifications méthyle, éthyle).

## 2026-10-27 — Laboratoires virtuels : chapitre 2e année du bac « Les questions que se pose le physicien »

Fait :
- La 1re année du bac est complète (chaque activité des 17 fiches a sa simulation) ; on passe à la 2e année, dans l'ordre
  de l'index.
- Une simulation (l'unique activité de la fiche), inscrite au manifeste (109 ressources), en deux paillasses : l'article
  d'une physicienne (cinq documents) et le tableau des questions par partie du programme ; la démarche du physicien sur
  un problème (distance d'un satellite GPS, d = c·Δt). Objectif O1.
- Aucun fichier commun modifié.
- Vérifié : parcours complet ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- L'article est un texte écrit pour la simulation (pas un article réel cité) : à remplacer, si l'on veut, par un extrait
  authentique.

## 2026-10-27 — Laboratoires virtuels : chapitre 2e année du bac « Ondes mécaniques progressives »

Fait :
- Trois simulations, inscrites au manifeste (112 ressources) : A1 exemples familiers (vague et bouchon, ressort :
  ondes transversale et longitudinale, documents son et séismes) ; A2 retard et célérité (ressort avec cellules et
  chronomètre électronique, son avec claquoir, deux micros et oscilloscope à mémoire) ; A3 influence du milieu (corde
  tendue par des masses, trois masses linéiques ; documents). Objectifs O1 à O5.
- Matériel commun nouveau : milieu_1d.js (propagation calculée), detecteurs_onde.js, ressort_long.js, corde_tendue.js,
  micro_claquoir.js, oscilloscope_memoire.js. Aucun fichier commun existant modifié.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- L'amortissement du ressort et de la corde est choisi pour que les bosses réfléchies ne coupent plus les faisceaux
  après un aller-retour : à ajuster si l'on veut voir plus de réflexions.
- La cuve à ondes à deux dimensions (ondes circulaires) n'est pas simulée : la fiche se limite aux ondes à une dimension.
- Les pages chargent tout le matériel commun des ondes, même celui qu'une activité n'utilise pas.

## 2026-10-27 — Correction : la corde tendue (ondes mécaniques, A3)

Remarque de l'enseignant : la corde paraissait élastique et l'onde ne se propageait pas de façon observable.
Cause : la secousse à la main durait trop longtemps (bosse de près de 1 m) et l'onde allait trop vite (0,4 s pour 2 m).
Fait :
- commun/corde_tendue.js : un toucher de la poignée donne un coup sec (demi-sinusoïde, grande ou petite, brève ou
  longue) ; boîtier de commande au mur ; caméra rapide (ralenti × 20 par défaut, le chronomètre mesure les vraies
  durées) ; chronophotographie (huit images numérotées, toutes les 0,05 s).
- A3 : deux étapes ajoutées (chronophotographie et son interprétation ; la forme du coup ne change pas le retard).
- Vérifié : parcours complet de l'A3 ; les célérités mesurées sont à moins de 1 % de √(T/μ).

## 2026-10-27 — Laboratoires virtuels : chapitre 2e année du bac « Ondes mécaniques progressives périodiques »

Fait :
- Deux simulations, inscrites au manifeste (114 ressources) : A1 onde sinusoïdale (corde, vibreur et stroboscope ; son,
  deux micros et oscilloscope) ; A2 diffraction et dispersion (cuve à ondes, ultrasons, documents). Objectifs O1 à O5.
- Matériel commun nouveau : corde_vibreur.js, banc_haut_parleur.js, cuve_ondes.js (image calculée dans un canvas, sans
  bibliothèque), banc_ultrasons.js.
- Fichiers communs modifiés (signalé) : micro_claquoir.js rend accessibles ses dessins du micro et de la règle
  (Labo.micro_pied, Labo.regle_1m) ; oscilloscope_memoire.js reçoit un titre facultatif. La simulation « retard et
  célérité » a été rejouée : elle passe.
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le stroboscope de la cuve à ondes est supposé réglé sur le vibreur (image immobile ou défilement lent) : on ne règle
  pas sa fréquence comme pour la corde.
- La largeur de la fente des ultrasons ne prend que trois valeurs (10, 20, 40 mm) ; l'amplitude suit la loi d'une fente
  idéale, sans réflexion sur la table.
- La diffraction n'est pas interprétée (hors programme) : la relation θ = λ / a n'est pas demandée.

## 2026-10-27 — Laboratoires virtuels : chapitre 2e année du bac « Propagation d'une onde lumineuse »

Fait :
- Deux simulations, inscrites au manifeste (116 ressources) : A1 diffraction de la lumière (fentes, fils, cheveu ; lasers
  rouge et vert ; lumière blanche ; θ = λ / a, ν = c / λ) ; A2 dispersion par un prisme au goniomètre (minimum de
  déviation, indice pour deux couleurs, spectre, fréquence inchangée). Objectifs O1 à O5.
- Matériel commun nouveau : banc_diffraction.js, goniometre_prisme.js. Aucun fichier commun existant modifié.
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La diffraction par un obstacle autre qu'un fil (bord d'écran, trou circulaire) n'est pas proposée.
- Au goniomètre, le trajet dans le prisme est dessiné à partir de son centre (le prisme est petit devant le plateau) ;
  les angles affichés sont exacts.
- Les étiquettes des lasers donnent leur longueur d'onde : la mesure de λ est une vérification de θ = λ / a.

## 2026-10-29 — Laboratoires virtuels : chapitre 2e année du bac « Diffraction de la lumière par un réseau »

Fait :
- Deux simulations, inscrites au manifeste (118 ressources) : A1 modèles de réseau (diapositives, CD, DVD au microscope :
  pas a = 1/n), fente qui rétrécit, réseau au laser, sin θk = k·λ / a au tableur, pas d'un CD par diffraction, nombre de
  maximums ; A2 incidence non normale (sin θk − sin i = k·λ / a), spectres de la lumière blanche, λ d'un laser vert.
  Objectifs O1 à O4.
- Matériel commun nouveau : reseau_lumiere.js, ecran_reseau.js, banc_reseau.js (banc vu de dessus : les faisceaux
  diffractés sont visibles sur la table). Aucun fichier commun existant modifié.
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les photographies au microscope sont des dessins schématiques à l'échelle (pas de vraies images).
- Le CD et le DVD sont utilisés en transmission (couche réfléchissante retirée), pas en réflexion.
- En incidence oblique, l'élève calcule les angles à la calculatrice (le tableur n'a pas de fonction arctangente).

## 2026-10-29 — Laboratoires virtuels : chapitre 2e année du bac « Décroissance radioactive »

Fait :
- Trois simulations, inscrites au manifeste (121 ressources) : A1 expérience de Becquerel, diagramme (N, Z), isotopes,
  équations α, β−, β+ et γ ; A2 radioactivité dans l'environnement, effets biologiques, choix du radioélément, datation
  au carbone 14 (graphique et calcul) ; A3 compteur de Geiger-Müller : aléatoire (moyenne, variance, écart-type),
  radioactivité naturelle, rayonnements et écrans, décroissance du baryum 137m (λ, t½, τ). Objectifs O1 à O7.
- Matériel commun nouveau : compteur_geiger.js, banc_comptage.js.
- Fichier commun modifié (signalé) : formules.js accepte LN et EXP dans le tableur (pour ln N et a₀·e^(−λt)). Les pages
  déjà assemblées gardent l'ancienne version, qui suffit à leurs formules.
- Correction demandée par l'enseignant : le câble du tube de Geiger-Müller n'était pas branché ; il se branche maintenant
  sur la prise « entrée tube » du compteur.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Au-delà de Z = 8, l'affiche du diagramme (N, Z) est un schéma calculé (quelques noyaux isolés peuvent y être mal placés).
- Le béryllium 7 (capture électronique, hors programme) n'apparaît pas dans le tableau des noyaux légers.
- La moyenne et la variance se calculent à la main ou par des formules simples : le tableur n'a pas de fonction MOYENNE.

## 2026-10-29 — Laboratoires virtuels : chapitre 2e année du bac « Noyaux, masse et énergie »

Fait :
- Une simulation à trois paillasses, inscrite au manifeste (122 ressources) : défaut de masse et énergie de liaison sur
  une balance de précision (modèle), unités (u, eV, J) et E = m·c², courbe d'Aston au tableur, bilans d'énergie avec les
  masses des noyaux (α, β−, β+, fission, fusion), applications et dangers (documents, tri). Objectifs O1 à O5.
- Aucun fichier commun modifié.
- Vérifié : parcours complet ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La balance des noyaux est un modèle (masses issues de la spectrométrie de masse) ; l'inclinaison du fléau est amplifiée.
- Le tableur n'a que quatre colonnes : pour Δm, l'élève tape la masse du noyau dans la formule.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Dipôle RC »

Fait :
- Trois simulations, inscrites au manifeste (125 ressources) : A1 charge à courant constant (q = I·t, q = C·u, série et
  parallèle) ; A2 réponse à un échelon à l'interface d'acquisition (continuité de uC, τ à 63 % et par la tangente,
  τ = R·C, décharge, équation différentielle) ; A3 énergie stockée E = ½·C·u² (éclair d'une lampe, flash, défibrillateur).
  Objectifs O1 à O7.
- Matériel commun nouveau : circuit_temps.js, condensateur.js, commutateur.js, boite_resistances.js, source_courant.js,
  interface_acquisition.js, ecran_acquisition.js.
- Fichier commun modifié (signalé) : circuit.js a une fonction resoudre() (calcul sans redessiner les fils), utilisée par
  l'horloge à chaque pas ; calculer() l'appelle, son comportement ne change pas. Simulations d'électricité rejouées.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le temps du circuit avance un peu moins vite que le temps réel si l'ordinateur est lent (au plus 60 pas par image).
- Pour décharger un condensateur de l'activité 1, une touche « Décharger » remplace le fil que l'on poserait entre ses bornes.
- L'énergie dissipée dans la lampe n'est pas mesurée : on compare les éclairs (durée, éclat) à E = ½·C·u².

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Dipôle RL »

Fait :
- Trois simulations, inscrites au manifeste (128 ressources) : A1 bobine en continu (ohmmètre, r = 10 Ω) et en variable
  (deux lampes : retard à l'allumage et à l'extinction, avec et sans noyau) ; A2 inductance par une tension triangulaire
  (uL = L·di/dt, L = 50 mH et 0,5 H, henry) ; A3 réponse à un échelon (établissement, τ = L/(R + r), influence de R et L,
  rupture, équation différentielle, énergie ½·L·i²). Objectifs O1 à O6.
- Matériel commun nouveau : bobine.js, gbf_temps.js.
- Fichiers communs modifiés (signalés) : circuit_temps.js (option « ralenti » : le temps du circuit avance N fois moins
  vite) ; interface_acquisition.js et ecran_acquisition.js (option « durees », bouton « Voie 2 » : EA1, −EA1 ou EA1 − EA0,
  unité ms pour les durées courtes, rappel sur_fin) ; boite_resistances.js (touches − et + au-dessus des fils, pour rester
  cliquables). Les trois simulations du dipôle RC ont été rejouées : elles passent.
- Vérifié : parcours complets des trois simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le temps est ralenti (40 ou 100 fois) pour que l'œil et l'ordinateur suivent des phénomènes de quelques millisecondes ;
  c'est écrit sur la paillasse.
- À l'activité 1, l'extinction de L₁ reste brève (environ 5 ms, soit 0,5 s à l'écran) : elle se voit, mais il faut regarder.
- Pas de surtension ni d'étincelle à l'ouverture d'un circuit sans boucle de décharge : K de l'activité 3 garde la bobine
  en boucle avec R.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Oscillations libres d'un circuit RLC série »

Fait :
- Trois simulations, inscrites au manifeste (131 ressources) : A1 décharge oscillante (régimes pseudo-périodique, critique,
  apériodique ; pseudo-période comparée à 2π√(LC) au tableur ; équation différentielle, q(t), i(t)) ; A2 évolution
  graphique des énergies (mode « Énergies » du logiciel : échanges, effet Joule, trois régimes) ; A3 entretien par un
  dispositif à amplificateur opérationnel (R₀ = R + r, saturation, tension sinusoïdale de 150 Hz). Objectifs O1 à O6.
- Matériel commun nouveau : poste_rlc.js (paillasse partagée par les trois activités), entretien_rlc.js.
- Fichiers communs modifiés (signalés) : circuit_temps.js (option « trapeze ») ; condensateur.js et bobine.js (méthode des
  trapèzes quand elle est choisie ; la bobine a alors une fuite de 1 MΩ entre ses spires) ; interface_acquisition.js et
  ecran_acquisition.js (option « energies » : mode « Énergies » de la touche Voie 2, trois courbes et leur légende).
  Sans ces options, rien ne change : les simulations des dipôles RC et RL ont été rejouées et passent.
- Vérifié : parcours complets des trois simulations (source et fichier assemblé) ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le dispositif d'entretien est un modèle fonctionnel (résistance négative, saturation simplifiée), comme le demandent les
  orientations ; son schéma interne n'est pas montré.
- La saturation est fixée à 40 mA (plus que beaucoup d'amplificateurs réels) pour que l'augmentation de l'amplitude se voie
  en partant de 6 V.
- Le régime critique n'est pas mesuré : on l'encadre entre 220 Ω et 470 Ω.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Oscillations forcées d'un circuit RLC série »

Fait :
- Deux simulations, inscrites au manifeste (133 ressources) : A1 oscillations forcées (u et i à l'oscilloscope bicourbe,
  excitateur et résonateur, impédance, construction de Fresnel sur une feuille, valeur efficace, avance ou retard de i sur u,
  fréquence propre) ; A2 résonance d'intensité (courbes I = f(N) pour 47 Ω et 220 Ω, bande passante, facteur de qualité,
  surtension, puissance et facteur de puissance). Objectifs O1 à O4.
- Matériel commun nouveau : circuit_sinus.js (régime sinusoïdal forcé, nombres complexes), poste_rlc_force.js.
- Fichiers communs modifiés (signalés) : circuit.js (il appelle circuit_sinus.js quand le circuit a un GBF et un condensateur
  ou une bobine, sans horloge ; sinon rien ne change) ; condensateur.js et bobine.js (admittance) ; gbf.js (options
  « frequences » et « r_sortie », pas de 10 crans en touchant l'afficheur, touches au-dessus des fils pour rester
  cliquables). Simulations d'électricité rejouées.
- Vérifié : parcours complets des deux simulations ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le GBF a une résistance de sortie de 0,5 Ω dans ce chapitre (au lieu de 50 Ω) : sa tension efficace reste presque
  constante, comme le suppose l'étude de la résonance.
- La résistance de l'ampèremètre (1 Ω sur le calibre mA) s'ajoute au circuit : ΔN et Q en tiennent compte (58 Ω au total
  pour R = 47 Ω).
- Le multimètre n'a pas de calibre 200 V~ : à l'activité 2, l'amplitude du GBF est réduite (U ≈ 1,06 V) pour que la
  surtension (≈ 12,8 V) reste mesurable.
- Le transitoire du début (avant le régime forcé) n'est pas simulé.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Modulation d'amplitude »

Fait :
- Trois simulations, inscrites au manifeste (136 ressources) : A1 histoire de la transmission (documents, tri), bandes de
  fréquences (tri, λ = c/f), émission et réception par deux antennes ; A2 modulation par un multiplieur (taux de
  modulation, surmodulation, Fp ≫ Fs) et démodulation (détecteur d'enveloppe, choix de τ, filtre passe-haut) ; A3
  récepteur AM monté librement (circuit d'accord, détecteur, écouteur, trois émetteurs). Objectifs O1 à O5.
- Matériel commun nouveau : modulation.js.
- Fichiers communs modifiés (signalés) : oscilloscope.js (option « lire » : tensions calculées par le poste ; option
  « balayages » ; balayages inférieurs à 0,1 ms/div écrits en µs/div) ; oscilloscope_ecran.js (bande pleine quand l'onde
  varie plus vite que les points de l'écran). Simulations à oscilloscope rejouées : elles passent.
- Vérifié : parcours complets des trois simulations (sources et fichiers assemblés) ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Les émetteurs de l'activité 3 donnent une tension de quelques volts à l'antenne (bien plus qu'en réalité) pour que la
  diode conduise sans amplificateur ; leur son est une simple note (400, 600, 900 Hz).
- Le détecteur suppose une diode de seuil 0,2 V (diode au germanium) ; le filtre passe-haut est idéal (il retire la moyenne).
- À l'activité 1, l'amplitude reçue suit une loi simple en 1/d (champ proche non modélisé).

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Lois de Newton »

Fait :
- Deux simulations, inscrites au manifeste (138 ressources) : A1 vecteurs vitesse et accélération (table inclinée : montée
  et descente, v(t), aG, signe de a·v ; mouvement circulaire uniforme : accélération centripète, repère de Frenet) ;
  A2 deuxième loi (quatre essais en faisant varier la masse et la pente, ΣF = m·ΔvG/Δt au tableur et à la courbe),
  référentiels galiléens (documents, tri) et troisième loi. Objectifs O1 à O7.
- Aucun fichier commun modifié : la table à coussin d'air et ses outils du tronc commun suffisent ; les cales sont locales.
- Vérifié : parcours complets des deux simulations (sources et fichiers assemblés) ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Pas de fil tiré par une masse suspendue (poulie) : la force est variée par la pente, la masse par la surcharge.
- Au bas de la pente, le mobile rebondit plusieurs fois sur la butée avant de s'arrêter : il faut attendre pour poser la surcharge.
- Le vecteur accélération n'est pas tracé à la main : on le déduit de Δv (questions).

## 2026-10-30 — Compétence « laboratoire-realiste »

Fait :
- À la demande de l'enseignant (simulations réalistes, attention aux détails, ne plus répéter les remarques) : compétence
  `.claude/skills/laboratoire-realiste/` : méthode d'un chapitre, liste de contrôle du réalisme visuel, justesse physique,
  pédagogie, règles de code, pièges connus ; dossier `outils/` avec les outils de génération de pages, de test
  (Playwright), d'assemblage du manifeste (labos.json) et de régression, qui étaient jusqu'ici dans un dossier temporaire.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Applications des lois de Newton »

Fait :
- Trois simulations, inscrites au manifeste (141 ressources) : A1 chute libre filmée (pointage vidéo, vy(t), g, équation
  différentielle, masse sans influence) ; A2 solide sur plan horizontal et incliné, chariot ou pavé (ẍ = 0, ẍ = cte,
  frottement f) ; A3 projectiles (équations horaires, parabole, flèche, portée, angles complémentaires, masse sans
  influence). Objectifs O1 à O4.
- Matériel commun nouveau : pointage_video.js (ordinateur et logiciel de pointage, comme le demandent les orientations).
- Aucun fichier commun existant modifié.
- Vérifié : parcours complets (sources et fichiers assemblés) ; valeurs mesurées comparées à la théorie (g = 9,81 m/s² ;
  a = −2,92 m/s² pour −2,94 ; 4,09 pour 4,10 ; 1,49 pour 1,48 ; v0x = 2,12 m/s ; portées égales à 30° et 60°) ; tests et
  contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- La précision du pointage dépend des clics de l'élève (1 pixel ≈ 5 à 6 mm) : zoomer à deux doigts pour pointer juste.
- La vidéo commence au lâcher (ou au tir) ; il n'y a pas d'images avant le départ à écarter.
- La balle de bois et la bille de verre sont choisies denses pour que l'action de l'air reste négligeable ; il n'y a pas
  d'objet léger (balle de ping-pong) pour montrer une chute non libre.


## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Relation entre la somme des moments et l'accélération angulaire »

Fait (en suivant la compétence « laboratoire-realiste ») :
- Deux simulations, inscrites au manifeste (143 ressources) : A1 disque entraîné par une masse, filmé et pointé en mode
  polaire (θ, θ̇ et θ̈ par encadrement, rotation uniformément variée, équations horaires, aT et aN ; rotation uniforme
  quand le fil se décroche, uniformément retardée au freinage) ; A2 tige à masselottes, masse motrice, cellule et
  chronomètre (système en translation et en rotation, ΣM = JΔ·θ̈, J = J_tige + 2·m'·d²). Objectifs O1 à O5.
- Fichier commun modifié (signalé) : pointage_video.js reçoit une option « polaire », désactivée par défaut (θ = (Ox, OM)
  en radians, sans saut d'un tour) ; « Exporter » vide d'abord les colonnes A à C (plus de lignes d'un ancien pointage).
  Régression : les trois simulations « Applications des lois de Newton » rejouées.
- Outil de test nouveau : outils_pointage.js (étalonnage, origine, pointage, export) dans la compétence.
- Vérifié : parcours complets (sources et fichiers assemblés) ; mesures comparées à la théorie (θ̈ = 18,87 rad/s² pour
  m·g·r/(J + m·r²) = 18,87 ; θ̇ libre 27,47 rad/s ; freinage −9,98 pour −10 ; J mesuré 5,40 × 10⁻³ kg·m² pour 5,40 × 10⁻³ ;
  J(20 cm) = 1,440 × 10⁻² pour 1,44 × 10⁻²) ; tests et contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Frottements de l'axe négligés : les mesures tombent juste sur la théorie (pas d'ordonnée à l'origine due au frottement).
- Le chronomètre et la vidéo sont exacts au calcul près ; seule l'erreur de pointage de l'élève (A1) disperse les θ̈.
- Les masselottes se déplacent toutes les deux ensemble (solide toujours équilibré) ; on ne peut pas les régler séparément.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Systèmes mécaniques oscillants »

Fait (en suivant la compétence « laboratoire-realiste ») :
- Trois simulations, inscrites au manifeste : A1 tri des oscillateurs, solide-ressort horizontal enregistré (capteur et
  logiciel x(t)), T0 en fonction de m et k, régimes pseudo-périodique et apériodique ; A2 pendule de torsion (J, C,
  isochronisme, chronomètre à main) ; A3 résonance avec excitateur et résonateur bien distincts, témoins d'amplitude,
  influence de l'amortissement, sans courbe de résonance. Objectifs O1 à O5.
- Matériel commun nouveau : banc_ressort_dessin.js, banc_ressort.js, banc_ressort_accessoires.js, logiciel_xt.js,
  chronometre_manuel.js. Aucun fichier commun existant modifié.
- Remarque de l'enseignant prise en compte : le cordon de la soufflerie n'arrivait pas jusqu'à la fiche (espace entre le
  fil et la prise) ; il utilise maintenant L.cordon_secteur (fiche enfoncée, manchon, cordon continu). Règle ajoutée à
  la compétence.
- Vérifié : parcours complets (sources et fichiers assemblés) ; mesures comparées à la théorie : T0 = 0,8888 s pour
  0,8886 ; 1,0883 pour 1,0883 ; 1,2573 pour 1,2566 ; 0,6284 pour 0,6283 ; pseudo-période du modèle 0,8931 s pour 0,8933 ;
  C mesurée 3,9 × 10⁻³ pour 4,0 × 10⁻³ (chronomètre à main) ; amplitudes établies 1,7 / 9,8 / 1,3 cm pour 1,72 / 9,85 /
  1,28 cm ; 3,7 et 0,3 cm avec palette et aimant pour 3,72 et 0,29 cm.

Problèmes restants, à faire par l'enseignant :
- Amortissement modélisé par un frottement fluide (−h·v), y compris pour la palette ; le frottement de l'air réel et le
  frottement solide ne sont pas distingués (hors programme).
- Le chronomètre à main contient le temps de réaction de l'élève : pour le résonateur (T0 = 0,63 s), il faut chronométrer
  10 oscillations ; les tolérances acceptent 4 à 5 %.
- Les deux masselottes du pendule de torsion se déplacent ensemble ; le cadran ne sert qu'à choisir l'amplitude.

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « Aspects énergétiques des oscillateurs mécaniques »

Fait (en suivant la compétence « laboratoire-realiste ») :
- Remarque de l'enseignant : « le design du matériel doit être réaliste, pas des choses bizarres à l'œil ». Règles ajoutées
  à la compétence (§ 2 bis : forme et proportions réelles, matières, détails, fixations, relecture en gros plan de chaque
  objet nouveau). Le banc à coussin d'air a été revu en gros plan et redessiné (banc_ressort_pieces.js) : le mobile coiffe
  le rail (flanc plein en aluminium, plaque anodisée, vis, crochets à œillet), réflecteur et palette en perspective, aimant
  de freinage avec sa monture vissée sur le flanc, surcharges cylindriques, soufflerie avec grille, interrupteur et voyant.
- Une simulation à trois paillasses (activité unique de la fiche), inscrite au manifeste : travail de la force d'un ressort
  (dynamomètre tenu par une noix sur une tige, méthode graphique), énergies du solide-ressort (vue « Énergies » du
  logiciel), énergies du pendule de torsion (capteur de rotation). Objectifs O1 à O4.
- Fichiers communs modifiés (signalés) : logiciel_xt.js (options grandeur et énergies, désactivées par défaut ; état
  affiché plus à droite pour laisser la place à la 5e touche), banc_ressort_dessin.js et banc_ressort_accessoires.js
  (pièces redessinées), pendule_torsion_dessin.js (déplacé de b2_meca4_a2_torsion, position réglable, capteur en option).
  Régression : les trois simulations « Systèmes mécaniques oscillants » rejouées.
- Vérifié : parcours complet (sources et fichier assemblé) ; K mesurée 20 N/m ; Em = 12,4 à 12,2 mJ pour ½·K·x0² = 12,5 mJ
  (très léger amortissement) ; Em du pendule 0,54 à 0,52 mJ pour ½·C·θ0² = 0,548 mJ.

Problèmes restants, à faire par l'enseignant :
- Les énergies sont calculées par le logiciel (v par la méthode des points voisins) avec les valeurs de m, K, J et C du
  montage ; l'élève ne les saisit pas.
- La palette amortit fortement : Em devient presque nulle en 4 s.

## 2026-10-30 — Correction : attache du fil et du ressort au mobile

- Remarque de l'enseignant : un petit vide entre le fil et le solide, et le solide peut se séparer du fil. Les œillets du
  mobile étaient sombres (invisibles sur la paillasse) et décalés de l'axe ; la cordelette du dynamomètre partait 2 px
  après le mobile ; sur la paillasse 1, on pouvait encore saisir le mobile et l'écarter du dynamomètre.
- Corrigé : œillets clairs centrés sur l'axe des ressorts (banc_ressort_pieces.js, constante OEILLET) ; ressorts et
  cordelette accrochés au centre des œillets (banc_ressort.js, poste_travail.js) ; option deplacable du banc (vraie par
  défaut), fausse quand le dynamomètre tient le mobile. Règle ajoutée à la compétence. Simulations rejouées : énergie,
  solide-ressort, résonance (sources et fichiers assemblés).

## 2026-10-30 — Laboratoires virtuels : chapitre 2e année du bac « L'atome et la mécanique de Newton »

- Deux simulations, une par activité de la fiche, inscrites au manifeste (149 ressources).
- b2_meca6_a1_astres_atomes (O1, O2) : documents au mur ; tableur Fe, Fg, Fe/Fg ; simulateur d'orbites sur le portable
  (orbites de Kepler exactes, échappement calculé pas à pas, chute en spirale de l'électron qui rayonne, Terre réaliste
  de espace.js). Mesuré : Fe/Fg = 2,27 × 10³⁹ ; pente de T² = f(r³) 9,895 × 10⁻¹⁴ s²/m³ (théorie 9,904 × 10⁻¹⁴),
  M = 5,98 × 10²⁴ kg ; E = −13,58 eV à 53 pm ; chute en 1,56 × 10⁻¹¹ s.
- b2_meca6_a2_spectres (O2, O3, O4) : Franck et Hertz (modèle : chocs inélastiques de 4,9 eV, probabilité liée à la
  pression de vapeur du mercure, énergies étalées de 0,3 eV, contre-tension 1,5 V) ; tubes spectraux H₂, He, Hg, Ne, X
  sur alimentation 5 kV, spectroscope à échelle graduée (raies du NIST) ; sodium en émission et en absorption (bec
  Bunsen commun, lanterne sur support élévateur, anse en nichrome). Mesuré : maximums à 6,38 / 11,16 / 16,04 / 20,88 /
  25,74 V, pente 4,84 V ; raies de l'hydrogène lues à 2 nm près ; 1,89 eV pour la raie rouge.
- Nouveaux fichiers communs : portable.js, niveaux_energie.js. Fichier commun modifié (signalé) : documents_mur.js, marge
  de 20 px à droite du texte des affiches (le texte touchait ou dépassait le bord dans 12 simulations). Contrôle
  automatique sur les 22 simulations qui affichent des documents : plus aucun texte ne déborde, ni sur l'affiche ni sur le
  document ouvert ; elles ont été réassemblées.
- Vérifié : parcours complets sur les sources et sur les fichiers assemblés, sans erreur ; pytest ; contrôle de structure.

Problèmes restants, à faire par l'enseignant :
- Le four de Franck et Hertz chauffe en quelques secondes (constante de temps 6 s) au lieu de 10 à 15 minutes.
- La pente mesurée (4,84 V) est un peu inférieure à 4,9 V, comme dans les vraies mesures ; la tolérance est de ± 0,15 V.
- La chute de l'électron en spirale est montrée en 8 s avec quelques tours (en réalité environ 200 000 tours).
- Le spectroscope de poche ne sépare pas le doublet du sodium (589,0 et 589,6 nm) : une seule raie est vue.

## 2026-10-30 — Vérification du PDF des orientations : parties propres aux filières PC et SM

- Remarque de l'enseignant : des parties du programme du bac manquent (exemple : mouvement des planètes et des satellites).
- Cause : les fiches JSON listaient les activités des parties communes, mais pas celles des parties spécifiques (PC, SMA,
  SMB) ; je ne faisais qu'une simulation par activité listée. Le texte arabe du PDF ne s'extrait pas (police) : les pages
  112 à 135 (2e année, PC et SM) et 45 à 49, 59 et 60 (1re année) ont été lues en images.
- Contrôle automatique : objectifs de chaque fiche (parties communes et spécifiques) sans aucune simulation au manifeste.
  Physique, parties déjà vues sans simulation : meca2 O5 (frottement, Euler), O6 (champ électrostatique), O7 (champ
  magnétique), O8 (satellites) ; meca4 O6 (pendule pesant) ; meca5 O5 (énergie du pendule pesant) ; 1re année elec2 O7 (SM,
  transistor et AO). nucl2 O6 (fission, fusion) était traité : objectif ajouté. La chimie de 2e année reste à faire, dans l'ordre.
- Fiches corrigées : activités du PDF ajoutées aux parties spécifiques de 2bac/meca2_applications (4 activités, 2
  orientations) et de 2bac/meca4_oscillants (1 activité, 1 orientation). ajouter.py accepte « activite_specifique ».
- Nouvelle simulation b2_meca2_s4_satellites (O8). Mesuré : pente T²/a³ = 2,971 × 10⁻¹⁹ s²/m³ (théorie 2,976 × 10⁻¹⁹),
  MS = 1,99 × 10³⁰ kg ; à 400 km, T = 5 540 s (théorie 5 544 s) ; orbite géostationnaire à 42 200 km, T = 86 005 s.
- Simulateur d'orbites déplacé dans commun/ (signalé), options désactivées par défaut ; b2_meca6_a1_astres_atomes rejouée
  (sources et fichier assemblé) ; barre d'échelle choisie selon le mode.

Problèmes restants, à faire par l'enseignant :
- La Terre du simulateur est vue de côté (Afrique) alors que l'orbite est vue depuis le pôle Nord ; un repère rouge sur
  l'équateur montre la rotation de la Terre.
- Le Soleil est grossi (son rayon n'est pas à l'échelle).
