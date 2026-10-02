# Prompts — Professeur IA de physique-chimie

Oct 2, 2026 · @abdelilah

## Mode d'emploi

Donnez d'abord le prompt maître, puis les prompts d'étape un par un, en testant chaque étape avant de passer à la suivante.

1. Utilisez un assistant de code qui crée et exécute des fichiers, par exemple Claude Code. Un simple chat ne suffit pas : le projet compte plusieurs dizaines de fichiers.
2. Enregistrez le prompt maître dans un fichier CLAUDE.md à la racine du dossier du projet. Claude Code le relit à chaque session : les règles s'appliquent toujours. Avec un autre outil, collez-le au début de chaque nouvelle conversation.
3. Donnez les prompts d'étape dans l'ordre, un seul à la fois. Remplacez les passages entre crochets \[ \] par vos informations.
4. Après chaque étape, faites le test indiqué sous le prompt. S'il échoue, utilisez le prompt de dépannage avant de continuer.
5. Sauvegardez une copie du dossier après chaque étape réussie : une modification de l'IA peut casser ce qui marchait.
6. Toutes les trois étapes, lancez le prompt de contrôle de la structure.

Ce qu'il faut avoir sous la main :

- une clé d'API Claude (Anthropic) et une clé d'API Gemini (Google) ;
- votre cours, au format texte ou Word ;
- les extraits des orientations pédagogiques qui concernent ce cours ;
- votre dossier de ressources (simulations, images, documents, figures) ;
- votre QCM diagnostique, rédigé et validé par vous.

## Prompt maître

Ce prompt fixe le projet et les règles de structure du code pour toute la durée du travail. Enregistrez-le tel quel dans CLAUDE.md.

```text
# PROJET : Professeur IA de physique-chimie

## Qui je suis, qui tu es
Je suis enseignant de physique-chimie et chercheur en didactique. Je ne suis pas développeur.
Tu es un développeur senior qui construit ce projet avec moi, étape par étape.
Réponds toujours en français simple. Si un terme technique est nécessaire, définis-le en une phrase.

## Le projet en bref
Une application web où un professeur IA enseigne UN cours de physique-chimie à UN élève à la fois.
- L'élève saisit son nom et sa classe, choisit le cours, puis répond à un QCM diagnostique
  (réponse + justification + degré de certitude). Les questions sont rangées par partie du cours.
- Le professeur explique au tableau : il parle (voix de synthèse) et écrit en même temps
  en style manuscrit (texte, formules, schémas).
- Chaque partie du cours est sur un tableau différent. Les anciens tableaux restent consultables : c'est la trace écrite.
- Chaque partie suit la démarche Prédiction -> Observation -> Explication (POE) : le prof recueille
  la prédiction de l'élève, montre une simulation, une image ou un document, puis explique au tableau.
- Les simulations s'ouvrent dans un cadre. Le prof demande de passer en plein écran et de manipuler.
  La lecture reprend quand l'élève clique sur « J'ai terminé ».
- Une zone de discussion permet de lever la main et d'écrire une question.
  Le prof y répond à la fin de la phase d'explication en cours.
- Les parties sont générées par des agents IA. La partie 1 est générée dès que l'élève a répondu
  aux questions du QCM qui la concernent. Pendant que l'élève suit la partie N, la partie N+1
  est générée en arrière-plan.

## Principe d'architecture (à respecter absolument)
1. Les agents IA ne pilotent JAMAIS le tableau en direct. Ils produisent une PARTITION :
   un fichier JSON par partie, qui décrit beat par beat ce que le prof dit, ce qu'il écrit,
   où, en quelle couleur, et quand il affiche un média.
   Un beat = une ou deux phrases dites + les actions au tableau qui les accompagnent.
2. Le LECTEUR, dans le navigateur, joue la partition : voix + écriture + médias, synchronisés.
3. La partition est le contrat entre les deux. Son format est défini dans schemas/partition.schema.json.
   Toute partition est validée par ce schéma avant d'être jouée.

## Les agents (un fichier de code et un fichier de prompt par agent)
- pedagogique : reçoit le cours, les orientations pédagogiques, le manifeste des ressources et le
  profil de l'élève. Produit le plan POE de la partie : objectif, conceptions visées, question de
  prédiction avec une réaction par réponse possible, ressource d'observation, points d'explication,
  trace écrite visée. La prédiction peut rappeler la réponse de l'élève au QCM.
- voix : produit le texte oral découpé en beats. Les formules et unités sont écrites en toutes
  lettres dans texte_dit (« U égale R fois I », « vingt milliampères »).
- ecriture : pour chaque beat, uniquement ce qui doit être écrit ou dessiné, pas tout ce qui est dit.
- architecture : choisit la zone, la couleur, le moment d'affichage des médias et les changements
  de tableau. Il choisit des ZONES NOMMÉES, jamais des coordonnées : le code calcule les positions.
- chef : vérifie la partition complète (exactitude scientifique, respect des orientations, démarche
  POE, conceptions du profil traitées, cohérence voix/écriture). Il valide ou renvoie des corrections
  précises à l'agent concerné. 2 tours de correction au maximum.
- repondeur : répond aux questions de la main levée, en restant dans le programme.
Le profil de l'élève est calculé par du code simple à partir du QCM : chaque mauvaise réponse
est étiquetée avec une conception. Pas d'IA pour cela.

## Choix techniques
- Serveur : Python 3 + FastAPI. Client : HTML + CSS + JavaScript sans framework (modules ES),
  sans étape de compilation.
- Tableau : SVG. Écriture manuscrite : tester Vara.js ; si les accents français ne s'affichent pas,
  utiliser une police manuscrite révélée progressivement. Formules : KaTeX avec l'extension mhchem.
  Schémas : SVG tracé trait par trait, aspect fait main avec Rough.js, à partir d'une bibliothèque
  d'éléments (pile, lampe, résistance, bécher, flèche...).
- Modèles de langage : API Claude d'Anthropic avec les sorties structurées (schéma JSON).
  Modèles dans config/modeles.json : pedagogique et chef -> claude-opus-5-5 ;
  voix, ecriture, architecture -> claude-sonnet-5-5 ; repondeur -> claude-haiku-4-5-20251001.
- Voix : Gemini TTS de Google. gemini-3.8-flash-tts pour le cours, gemini-3.8-flash-lite-tts pour
  le répondeur. Un audio par beat ; sa durée est enregistrée dans la partition.
  Synchronisation par beat : l'écriture du beat commence avec son audio et se termine avant la fin.
- La voix passe par une interface unique (serveur/voix/synthese.py) pour pouvoir changer de
  fournisseur sans toucher au reste.
- Ces API sont récentes. Avant de coder un appel, lis la documentation officielle à jour :
  Claude : https://platform.claude.com/docs
  Gemini TTS : https://ai.google.dev/gemini-api/docs/speech-generation
  Ne te fie pas à ta mémoire.
- Stockage : fichiers JSON pour les partitions, SQLite pour le journal de recherche.
  Clés d'API dans .env, jamais dans le code.

## RÈGLES DE STRUCTURE DU CODE (obligatoires à chaque étape)
1. Un fichier = une seule responsabilité, décrite en une phrase.
2. 150 lignes maximum par fichier (viser 50 à 120). 30 lignes maximum par fonction.
   Si une limite est dépassée, découpe AVANT de continuer.
3. Noms explicites en français, sans accents : generer_partie, jouer_beat, onglets.js.
4. En tête de chaque fichier, un commentaire en français : Rôle / Reçoit / Produit / Utilisé par.
5. Chaque fonction commence par une phrase en français qui dit ce qu'elle fait.
6. Aucune valeur en dur : couleurs, zones, modèles, durées, chemins -> dans config/.
7. Les prompts des agents sont dans prompts/*.md, jamais dans le code :
   je dois pouvoir les modifier sans toucher au code.
8. Un seul fichier parle à l'API Claude (serveur/agents/appel_ia.py).
   Un seul fichier parle au serveur depuis le navigateur (client/js/api.js).
9. Aucune nouvelle bibliothèque sans me la proposer et m'expliquer pourquoi.
10. Pas de code « pour plus tard » : seulement ce que demande l'étape en cours.
11. Ne modifie pas un fichier hors de l'étape en cours sans me le signaler.
12. Chaque module du serveur a au moins un test simple (pytest).

## À LA FIN DE CHAQUE ÉTAPE, donne-moi :
1. La liste des fichiers créés ou modifiés, avec leur nombre de lignes.
2. Ce que fait l'étape, en 5 lignes maximum, en langage simple.
3. Le test à faire : la commande exacte à lancer et ce que je dois voir.
Puis mets à jour ARCHITECTURE.md (tableau fichier -> rôle) et JOURNAL.md
(date, étape, ce qui a été fait, problèmes restants).
Ne passe jamais à l'étape suivante sans que je le demande.

## Arborescence imposée
prof-ia/
  CLAUDE.md                ce prompt maître
  ARCHITECTURE.md          carte des fichiers, tenue à jour par toi
  JOURNAL.md               suivi étape par étape
  .env                     clés d'API (jamais partagé)
  config/                  modeles.json, tableau.json, voix.json, application.json
  contenu/                 ce que fournit l'enseignant
    cours/                 le cours
    orientations/          extraits des orientations pédagogiques
    qcm/                   qcm.json (diagnostic), qcm_post.json (post-test)
    ressources/            simulations, images, documents, figures
    manifeste.json         une fiche par ressource
  prompts/                 pedagogique.md, voix.md, ecriture.md, architecture.md, chef.md, repondeur.md
  schemas/                 partition, plan_pedagogique, qcm, manifeste (.schema.json)
  outils/                  verifier_structure.py, valider_partition.py, generer_audio.py,
                           generer_partie.py, exporter_donnees.py
  serveur/
    main.py                démarre le serveur et branche les routes (court)
    routes/                une route par fichier : eleve.py, qcm.py, parties.py, questions.py
    agents/                appel_ia.py + un fichier par agent
    pipeline/              orchestrateur.py (enchaîne les agents), file_attente.py (arrière-plan)
    voix/                  synthese.py (interface), gemini_tts.py
    eleve/                 pseudonymes.py, profil.py
    donnees/               stockage.py, journal_recherche.py
    tests/
  client/
    index.html, qcm.html, attente.html, classe.html
    css/
    js/
      api.js               seul fichier qui parle au serveur
      lecteur/             lecteur.js (enchaîne les beats), audio.js
      tableau/             tableau.js, zones.js, ecriture.js, formule.js, dessin.js, onglets.js
        elements/          un fichier par élément de schéma
      medias/              cadre_media.js (simulation, image, document, plein écran)
      interaction/         prediction.js, main_levee.js, qcm.js
  sorties/
    parties/               partitions générées + audio, par élève
    valide/                parties validées par l'enseignant (mode figé)
    journaux/              données de recherche

## Format de la partition (résumé ; le schéma complet est dans schemas/)
Partie : numero, tableau, titre, beats[].
Beat : id, phase (prediction | observation | explication | synthese), texte_dit,
       audio (fichier), duree_s, actions[].
Types d'action :
- ecrire : zone, texte, couleur, style (titre | normal | a_retenir)
- formule : zone, latex, couleur
- dessiner : element (nom dans la bibliothèque), zone, parametres
- media : ressource (id du manifeste), plein_ecran (oui/non), consigne, attendre ("clic_termine")
- prediction : question, choix[], justifier (oui/non),
               branches (une courte réaction orale par choix, avec son audio)
- pause : duree_s
- nouveau_tableau : titre
Jamais d'effacement : la trace écrite reste.

## Recherche et données
- Dès l'accueil, le nom de l'élève est remplacé par un pseudonyme (E001, E002...).
  La correspondance nom <-> pseudonyme est stockée à part. Le nom n'est jamais envoyé à une API.
- Événements enregistrés avec horodatage : réponses au QCM (choix, justification, certitude, temps),
  prédictions, ouverture d'un média, plein écran, durée de manipulation, questions et réponses,
  retours aux anciens tableaux, fin de chaque partie, post-test.
- Deux modes dans config/application.json :
  « adaptatif » : parties générées pour chaque élève ;
  « fige » : parties validées par l'enseignant, chargées depuis sorties/valide/, identiques pour tous.

## Hors périmètre de la version 1
Un seul cours, un élève à la fois, pas de comptes utilisateurs, pas d'application mobile.
```

## Prompts par étape

Douze étapes, de la plus simple à la plus complète. Les étapes 1 à 6 construisent le tableau sans aucune IA, à partir d'une partie que vous écrivez vous-même ; les agents n'arrivent qu'à l'étape 8.

### Étape 1 — Squelette du projet

```text
Étape 1 — Squelette du projet. Respecte toutes les règles de CLAUDE.md.
Objectif : un projet qui démarre et affiche une page, rien de plus.
À faire :
- Crée l'arborescence complète décrite dans CLAUDE.md, dossiers vides compris.
- Crée les fichiers de config/ avec des valeurs de départ, et explique chaque réglage dans ARCHITECTURE.md.
- Crée un serveur FastAPI minimal qui sert les pages de client/.
- Crée la page d'accueil (nom, classe, choix du cours), qui ne fait encore rien.
- Crée .env.exemple (noms des clés, sans valeurs), requirements.txt et un README court :
  installer, lancer, arrêter.
- Crée outils/verifier_structure.py : il liste les fichiers de plus de 150 lignes
  et les fonctions de plus de 30 lignes.
```

Test attendu : la page d'accueil s'affiche dans le navigateur, et le script de vérification ne signale rien. Copiez ensuite votre cours, vos orientations, votre QCM et vos ressources dans les dossiers de contenu/.

### Étape 2 — Manifeste et partition modèle

```text
Étape 2 — Manifeste et partition modèle. Respecte toutes les règles de CLAUDE.md.
Objectif : définir le format de la partition et disposer d'une partie 1 modèle.
À faire :
- Écris schemas/manifeste.schema.json, puis propose contenu/manifeste.json en listant les fichiers
  de contenu/ressources/ (id, type, fichier, description, phase POE, ce qui est manipulable).
  Laisse les descriptions à compléter par moi quand tu ne peux pas deviner.
- Écris schemas/partition.schema.json d'après le résumé de CLAUDE.md. Explique chaque champ en une ligne.
- Écris outils/valider_partition.py : il vérifie une partition et affiche les erreurs en français.
- Lis contenu/cours/[nom du fichier] et propose un BROUILLON de partie 1 dans
  sorties/valide/partie_1.json : 8 à 12 beats, démarche POE, ressources prises dans le manifeste.
  Pas encore d'audio.
Je corrigerai ce brouillon moi-même : il servira d'exemple aux agents.
```

Test attendu : le validateur affiche que partie\_1.json est valide. Relisez ensuite le brouillon et corrigez vous-même le contenu scientifique, la démarche et la trace écrite.

### Étape 3 — Le tableau : texte, formules, onglets

```text
Étape 3 — Le tableau qui écrit. Respecte toutes les règles de CLAUDE.md.
Objectif : jouer la partition modèle au tableau, sans voix.
À faire :
- Tableau SVG fond vert foncé. Zones définies dans config/tableau.json : titre, gauche, droite,
  a_retenir, cadre_media. Couleurs de craie : titres jaunes, texte blanc, à retenir rouge,
  schémas bleu clair.
- Écriture manuscrite animée pour l'action ecrire. Essaie Vara.js et montre-moi le rendu
  de é, è, à, ç, ô. Sinon, police manuscrite révélée progressivement.
- Formules KaTeX + mhchem révélées de gauche à droite.
- Onglets Tableau 1, 2, 3... : nouveau_tableau crée un onglet ; les anciens restent consultables.
- Si une zone est pleine, signale-le dans la console. Jamais de chevauchement.
- Page client/demo_tableau.html avec boutons Lecture, Pause, Beat suivant, qui joue
  sorties/valide/partie_1.json avec une durée fixe de 4 secondes par beat.
```

Test attendu : le titre, le texte et les formules s'écrivent beat par beat, dans les bonnes zones et couleurs, avec les accents bien affichés.

### Étape 4 — Le tableau : schémas

```text
Étape 4 — Les schémas. Respecte toutes les règles de CLAUDE.md.
Objectif : le prof dessine des schémas au tableau.
À faire :
- Bibliothèque d'éléments dans client/js/tableau/elements/, un fichier par élément :
  [pile, lampe, résistance, interrupteur, ampèremètre, voltmètre, fil, flèche — adaptez à votre cours].
- Chaque élément est tracé trait par trait, aspect fait main (Rough.js). Sa taille et sa position
  sont calculées à partir de la zone.
- L'action dessiner assemble des éléments : par exemple, un circuit = une liste d'éléments reliés.
- Ajoute à demo_tableau.html un bouton qui affiche tous les éléments, pour les vérifier.
```

Test attendu : chaque élément se dessine lisiblement, dans le style craie, et un schéma de la partition modèle s'affiche correctement.

### Étape 5 — La voix et la synchronisation

```text
Étape 5 — La voix. Respecte toutes les règles de CLAUDE.md.
Objectif : le prof parle et écrit en même temps.
À faire :
- Lis d'abord la documentation à jour : https://ai.google.dev/gemini-api/docs/speech-generation
- serveur/voix/synthese.py : interface (texte, style -> fichier audio + durée).
  serveur/voix/gemini_tts.py : implémentation avec gemini-3.8-flash-tts.
  Voix et style dans config/voix.json.
- outils/generer_audio.py : génère l'audio de chaque beat et de chaque branche de prédiction
  d'une partition, puis enregistre le fichier et la durée dans la partition.
- Lecteur : chaque beat joue son audio. L'écriture démarre avec l'audio et se termine à 80 %
  de sa durée (valeur dans config/tableau.json). Le beat suivant démarre à la fin de l'audio.
- Génère le même beat avec 3 voix françaises différentes pour que je choisisse.
```

Test attendu : la partie 1 est jouée avec la voix, et l'écriture suit la parole. Choisissez la voix avec 2 ou 3 élèves.

### Étape 6 — Médias et prédictions

```text
Étape 6 — Médias et prédictions. Respecte toutes les règles de CLAUDE.md.
Objectif : le prof montre simulations, images et documents, et recueille les prédictions.
À faire :
- cadre_media.js : affiche une ressource du manifeste dans le cadre (simulation HTML dans un iframe,
  image, PDF), avec un bouton plein écran. Pendant une simulation, la lecture se met en pause ;
  elle reprend au clic sur « J'ai terminé ».
- prediction.js : affiche la question, les choix et un champ de justification. La lecture attend
  la réponse, puis joue la branche qui correspond au choix.
- Chaque événement (ouverture, plein écran, durée, réponse) est envoyé au serveur par api.js.
  Pour l'instant, le serveur l'affiche simplement.
```

Test attendu : la simulation passe en plein écran, la lecture attend « J'ai terminé », et le prof réagit différemment selon la prédiction choisie.

### Étape 7 — Accueil, QCM et profil de l'élève

```text
Étape 7 — Parcours de l'élève : accueil et QCM. Respecte toutes les règles de CLAUDE.md.
Objectif : de l'accueil jusqu'au profil de l'élève.
À faire :
- Accueil : nom, classe, choix du cours. Le nom est remplacé tout de suite par un pseudonyme
  (serveur/eleve/pseudonymes.py).
- Écris schemas/qcm.schema.json, puis qcm.html qui lit contenu/qcm/qcm.json : une question à la fois,
  choix + justification + certitude (« Je devine », « Assez sûr », « Certain »), temps de réponse mesuré.
  Chaque question indique sa partie ; chaque mauvais choix indique la conception qu'il révèle.
- serveur/eleve/profil.py : calcule le profil (conceptions détectées et certitude) sans IA,
  à partir de ces étiquettes.
- Page d'attente avec le message « Le professeur prépare son tableau… » et une barre de progression,
  simulée pour l'instant.
```

Test attendu : après le QCM, un fichier de profil apparaît dans sorties/ avec les conceptions détectées, et le vrai nom de l'élève n'apparaît nulle part.

### Étape 8 — Les agents IA

```text
Étape 8 — Les agents IA. Respecte toutes les règles de CLAUDE.md.
Objectif : générer automatiquement la partition d'une partie à partir du cours, du profil et du manifeste.
À faire :
- Lis d'abord la documentation à jour des sorties structurées :
  https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- appel_ia.py : seul point d'appel à l'API. Modèle lu dans config/modeles.json, sortie validée
  par un schéma, 2 nouvelles tentatives en cas d'erreur.
- Un fichier par agent dans serveur/agents/. Chaque agent lit son prompt dans prompts/ et reçoit
  la partition modèle (sorties/valide/partie_1.json) comme exemple.
- Rédige un premier brouillon de chaque fichier de prompts/ ; je les relirai et les corrigerai.
- orchestrateur.py : pedagogique -> voix -> ecriture -> architecture -> chef
  -> corrections (2 tours maximum) -> audio -> validation par le schéma.
- outils/generer_partie.py (numéro de la partie en paramètre) : lance toute la chaîne en ligne de commande
  et affiche la durée et le coût estimé de chaque agent.
```

Test attendu : une partition de la partie 1 est générée et valide. Comparez-la à votre partition modèle, puis améliorez les prompts des agents dans prompts/.

### Étape 9 — Génération progressive

```text
Étape 9 — Génération progressive. Respecte toutes les règles de CLAUDE.md.
Objectif : l'élève n'attend presque pas.
À faire :
- file_attente.py : tâches de génération en arrière-plan, avec un état
  (en attente, en cours, prête, erreur).
- La génération de la partie 1 démarre dès que l'élève a répondu aux questions du QCM de la partie 1.
  Les parties suivantes sont générées l'une après l'autre en arrière-plan. Chacune reçoit le résumé
  de la partie précédente, ainsi que les prédictions et les questions de l'élève.
- La page d'attente affiche le vrai état. La classe démarre quand la partie 1 est prête.
- Plan B : si la partie suivante n'est pas prête, affiche un mini-quiz récapitulatif
  de la partie terminée.
- Mode « fige » (config/application.json) : charge les parties depuis sorties/valide/
  sans rien générer.
```

Test attendu : la partie 2 est prête avant la fin de la partie 1. En mode figé, aucun appel à l'IA n'a lieu.

### Étape 10 — Main levée et réponses

```text
Étape 10 — Main levée. Respecte toutes les règles de CLAUDE.md.
Objectif : l'élève pose des questions, le prof y répond au bon moment.
À faire :
- Zone de discussion à côté du tableau : bouton main levée + champ de question.
  Les questions sont mises en file.
- À la fin de la phase d'explication en cours, le prof dit qu'il a vu la question, puis l'agent
  repondeur répond. Contexte : partie en cours + contenu du tableau + orientations.
- Réponse orale (gemini-3.8-flash-lite-tts) + écriture courte dans une zone « brouillon »,
  séparée de la trace écrite.
- Question hors programme : réponse courte et bienveillante, puis retour au cours.
```

Test attendu : une question posée pendant la partie est traitée après l'explication, avec la voix et une écriture dans la zone brouillon.

### Étape 11 — Journal de recherche et post-test

```text
Étape 11 — Journal de recherche et post-test. Respecte toutes les règles de CLAUDE.md.
Objectif : recueillir les données de recherche.
À faire :
- journal_recherche.py : enregistre dans SQLite tous les événements listés dans CLAUDE.md,
  avec le pseudonyme et l'horodatage.
- À la fin du cours, pose le post-test : contenu/qcm/qcm_post.json
  [mêmes questions que le diagnostic, ou version parallèle].
- outils/exporter_donnees.py : exporte en CSV, un fichier par type d'événement,
  prêt pour l'analyse statistique.
```

Test attendu : après un parcours complet, les fichiers CSV contiennent vos données, sans aucun nom réel.

### Étape 12 — Relecture finale

```text
Étape 12 — Relecture finale. Respecte toutes les règles de CLAUDE.md.
À faire :
- Lance outils/verifier_structure.py et corrige tous les dépassements.
- Lance tous les tests et corrige ce qui échoue.
- Vérifie qu'aucune clé d'API ni aucun nom d'élève n'apparaît dans le code ou dans les journaux.
- Mets à jour ARCHITECTURE.md et le README (installation et lancement en 5 commandes maximum).
- Donne-moi la liste des limites connues et des améliorations possibles, sans les coder.
```

Test attendu : aucun dépassement signalé, tous les tests réussis, et un parcours complet d'un élève test sans erreur.

## Prompts utiles en cours de route

Ces prompts vous permettent de comprendre le code, de garder les fichiers courts et de réparer une erreur sans tout casser.

### Reprendre le travail après une pause

```text
Lis CLAUDE.md, ARCHITECTURE.md et JOURNAL.md. Résume en 5 lignes où en est le projet
et quelle est la prochaine étape. Ne modifie rien.
```

### Comprendre un fichier

```text
Explique-moi le fichier [chemin du fichier] comme à un enseignant qui ne programme pas :
son rôle, ce qu'il reçoit, ce qu'il produit, qui l'utilise. 10 lignes maximum, sans jargon.
```

### Comprendre le chemin d'une partie

```text
Décris le chemin d'une partie du cours, du QCM jusqu'au tableau. Nomme dans l'ordre
les fichiers traversés, avec une ligne par fichier. Ne modifie rien.
```

### Contrôler la structure (toutes les trois étapes)

```text
Contrôle la structure du projet selon les règles de CLAUDE.md : fichiers de plus de 150 lignes,
fonctions de plus de 30 lignes, valeurs en dur, fichiers sans commentaire d'en-tête,
prompts écrits dans le code. Donne la liste, propose un découpage, et attends mon accord
avant de modifier quoi que ce soit.
```

### Dépanner une erreur

```text
Ça ne marche pas. Ce que je fais : [votre action]. Ce que je vois : [message d'erreur copié,
ou description]. Explique la cause probable en 3 lignes simples, propose la plus petite
correction possible, ne modifie que les fichiers nécessaires, puis dis-moi comment vérifier.
```

### Changer le comportement du professeur

```text
Je veux changer ceci : [comportement du prof]. Dis-moi d'abord si cela se règle dans un prompt
(prompts/), dans la configuration (config/) ou dans le code. Si c'est un prompt ou la configuration,
montre-moi la ligne à changer pour que je le fasse moi-même.
```

Le dernier prompt est important pour votre recherche : la plupart des réglages pédagogiques (ton du prof, longueur des explications, place de la prédiction) se trouvent dans prompts/ et config/, que vous pouvez modifier sans toucher au code.
