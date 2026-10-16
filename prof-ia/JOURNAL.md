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
