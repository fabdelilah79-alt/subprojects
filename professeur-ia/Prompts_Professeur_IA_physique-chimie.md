# Prompts — Professeur IA de physique-chimie

Oct 2, 2026 · @abdelilah · version 2.1

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
- facultatif : une clé d'API ElevenLabs (le compte gratuit suffit), pour comparer deux voix à l'étape 5 ;
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
  en style manuscrit (texte, formules, schémas). Chaque écrit commence au moment où
  le mot qui lui correspond est prononcé.
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
4. Synchronisation au mot : chaque action porte une ANCRE, un mot ou un groupe de mots recopié
   à l'identique depuis texte_dit. Le code calcule l'instant debut_s où ce mot est prononcé,
   et l'action démarre à cet instant. Les agents n'écrivent jamais de temps en secondes.

## Les agents (un fichier de code et un fichier de prompt par agent)
- pedagogique : reçoit le cours, les orientations pédagogiques, le manifeste des ressources et le
  profil de l'élève. Produit le plan POE de la partie : objectif, conceptions visées, question de
  prédiction avec une réaction par réponse possible, ressource d'observation, points d'explication,
  trace écrite visée. La prédiction peut rappeler la réponse de l'élève au QCM.
- voix : produit le texte oral découpé en beats, en phrases courtes. Les formules, nombres et unités
  sont écrits en toutes lettres dans texte_dit (« U égale R fois I », « vingt milliampères ») :
  ni symbole, ni chiffre, ni abréviation. Pour chaque beat, il choisit un ton dans la liste de
  config/voix.json (par exemple : neutre, enthousiaste, interrogatif, lent_et_clair, encourageant).
- ecriture : pour chaque beat, uniquement ce qui doit être écrit ou dessiné, pas tout ce qui est dit.
  Chaque action reçoit son ancre : le mot de texte_dit au moment duquel elle commence.
- architecture : choisit la zone, le moment d'affichage des médias et les changements de tableau.
  Il choisit des ZONES NOMMÉES, jamais des coordonnées : le code calcule les positions.
  La couleur découle du style ; l'agent peut seulement choisir un autre nom de la palette.
- chef : vérifie la partition complète (exactitude scientifique, respect des orientations, démarche
  POE, conceptions du profil traitées, cohérence voix/écriture, ancres bien placées). Il valide ou
  renvoie des corrections précises à l'agent concerné. 2 tours de correction au maximum.
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
  Modèle et niveau d'effort de chaque agent dans config/modeles.json : pedagogique et chef -> claude-opus-5-5 ;
  voix, ecriture, architecture -> claude-sonnet-5-5 ; repondeur -> claude-haiku-4-5-20251001.
  Le contexte stable (cours, orientations, manifeste, partition modèle) est placé en tête de chaque
  appel et mis en cache (cache de prompt) : moins cher et plus rapide d'une partie à l'autre.
  Si l'API refuse de répondre (refus), journalise-le et applique le repli prévu par la documentation.
- Voix : Gemini 3.8 Flash TTS de Google (version stable). gemini-3.8-flash-tts pour le cours,
  gemini-3.8-flash-lite-tts (plus rapide) pour le répondeur, avec la même voix.
  Un audio par beat et par branche de prédiction ; sa durée est enregistrée dans la partition.
  Fournisseur, modèles, voix, consigne de style et traduction de chaque ton : dans config/voix.json.
- La voix passe par une interface unique (serveur/voix/synthese.py) :
  texte + ton (+ texte avant et après, facultatif) -> fichier audio + durée + temps des mots (si disponibles).
  Deux implémentations derrière cette interface :
  gemini_tts.py, par défaut : très bonne qualité, peu coûteux, mais ne donne pas le temps des mots ;
  elevenlabs_tts.py : Eleven v4, donne le temps de chaque caractère et enchaîne l'intonation
  d'un beat à l'autre, mais coûte nettement plus cher.
  Le fournisseur est choisi à l'étape 5, à l'écoute, avec des élèves.
- Ancrage (serveur/voix/ancrage.py) : debut_s = temps réel du mot si le fournisseur le donne,
  sinon estimation proportionnelle au nombre de caractères qui précèdent l'ancre.
  L'écriture avance à une vitesse réaliste (config/tableau.json). Si elle dure plus longtemps
  que la parole, le beat suivant attend la fin de l'écriture, comme un vrai professeur.
- Cache audio : un même texte, avec la même voix et le même ton, n'est généré qu'une fois.
- Contrôle de l'audio : si le débit (caractères par seconde) sort de la plage fixée dans
  config/voix.json, l'audio est régénéré (2 fois au maximum), puis signalé.
- Ces API sont récentes. Avant de coder un appel, lis la documentation officielle à jour :
  Claude : https://platform.claude.com/docs
  Gemini TTS : https://ai.google.dev/gemini-api/docs/speech-generation
  ElevenLabs : https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
  Ne te fie pas à ta mémoire.
- Stockage : fichiers JSON pour les partitions, SQLite pour le journal de recherche.
  Clés d'API dans .env, jamais dans le code.

## Design de l'interface (sobre, fait pour la classe)
Le tableau vert est le seul élément visuel fort. Le reste de l'interface s'efface.
- Fond papier clair, texte presque noir, une seule couleur d'accent : le vert du tableau.
- Polices du système, sans téléchargement : titres en serif (esprit manuel scolaire),
  texte et boutons en sans-serif. Tailles et espaces pris dans une échelle fixe.
- Bordures fines (1 px), coins de 3 px au plus, alignement à gauche, beaucoup d'espace.
- Interdits : dégradés, ombres portées, effets de verre ou de flou, emoji, icônes décoratives,
  illustrations, animations d'interface (seule l'écriture au tableau est animée),
  slogans et formules creuses (« Bienvenue dans l'avenir de l'apprentissage »).
- Textes courts et concrets. L'interface vouvoie l'élève.
- Accessibilité : contraste suffisant (niveau AA), focus clavier visible, une étiquette par champ,
  texte de 16 px au moins, zones cliquables de 44 px de haut au moins.
- Couleurs, polices, tailles et espaces de l'interface : variables CSS dans un seul fichier,
  client/css/theme.css. Les couleurs du tableau restent dans config/tableau.json.
- Écran de classe : le tableau occupe la plus grande place ; une colonne étroite à droite
  accueille la main levée ; les onglets des tableaux sont de simples liens texte au-dessus du tableau.

## RÈGLES DE STRUCTURE DU CODE (obligatoires à chaque étape)
1. Un fichier = une seule responsabilité, décrite en une phrase.
2. 150 lignes maximum par fichier de code (viser 50 à 120). 30 lignes maximum par fonction.
   Ces limites ne s'appliquent ni aux schémas JSON, ni aux prompts, ni aux fichiers .md.
   Si une limite est dépassée, découpe AVANT de continuer.
3. Noms explicites en français, sans accents : generer_partie, jouer_beat, onglets.js.
4. En tête de chaque fichier, un commentaire en français : Rôle / Reçoit / Produit / Utilisé par.
5. Chaque fonction commence par une phrase en français qui dit ce qu'elle fait.
6. Aucune valeur en dur : couleurs, zones, modèles, voix, durées, vitesses, chemins -> dans config/.
7. Les prompts des agents sont dans prompts/*.md, jamais dans le code :
   je dois pouvoir les modifier sans toucher au code.
8. Un seul fichier parle à l'API Claude (serveur/agents/appel_ia.py).
   Un seul fichier par fournisseur de voix (serveur/voix/).
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
    configuration.py       lit les fichiers de config/
    routes/                une route par fichier : eleve.py, qcm.py, parties.py, questions.py
    agents/                appel_ia.py + un fichier par agent
    pipeline/              orchestrateur.py (enchaîne les agents), file_attente.py (arrière-plan)
    voix/                  synthese.py (interface), gemini_tts.py, elevenlabs_tts.py,
                           ancrage.py, cache_audio.py
    eleve/                 pseudonymes.py, profil.py
    donnees/               stockage.py, journal_recherche.py
    tests/
  client/
    index.html, qcm.html, attente.html, classe.html
    css/                   theme.css (réglages visuels), base.css, formulaire.css
    js/
      api.js               seul fichier qui parle au serveur
      accueil.js           page d'accueil
      lecteur/             lecteur.js (enchaîne les beats), audio.js
      tableau/             tableau.js, zones.js, ecriture.js, formule.js, dessin.js, onglets.js
        elements/          un fichier par élément de schéma
      medias/              cadre_media.js (simulation, image, document, plein écran)
      interaction/         prediction.js, main_levee.js, qcm.js
  sorties/
    parties/               partitions générées + audio, par élève
    valide/                parties validées par l'enseignant (mode figé)
    cache_audio/           audios déjà générés, réutilisés
    comparaison_voix/      extraits d'écoute pour choisir la voix (étape 5)
    journaux/              données de recherche

## Format de la partition (résumé ; le schéma complet est dans schemas/)
Partie : numero, tableau, titre, generation (modèles, empreinte des prompts, fournisseur et voix, date), beats[].
Beat : id, phase (prediction | observation | explication | synthese), texte_dit, ton,
       audio (fichier), duree_s, actions[].
Chaque action, sauf pause et nouveau_tableau, porte aussi :
- ancre : mot ou groupe de mots recopié de texte_dit ; s'il apparaît plusieurs fois,
  c'est la première occurrence après l'ancre précédente ;
- debut_s : calculé par le code, jamais écrit par un agent.
Types d'action :
- ecrire : zone, texte, style (titre | normal | a_retenir), couleur (facultative)
- formule : zone, latex, style (normal | a_retenir), couleur (facultative)
- dessiner : element (nom dans la bibliothèque), zone, parametres
- media : ressource (id du manifeste), plein_ecran (oui/non), consigne, attendre ("clic_termine")
- prediction : question, choix[], justifier (oui/non),
               branches (une courte réaction orale par choix, avec son audio et sa durée)
- pause : duree_s
- nouveau_tableau : titre
Couleur : par défaut, déduite du style ou du type d'action (config/tableau.json) ;
si elle est donnée, c'est un nom de la palette, jamais un code couleur.
Jamais d'effacement : la trace écrite reste.

## Recherche et données
- Dès l'accueil, le nom de l'élève est remplacé par un pseudonyme (E001, E002...).
  La correspondance nom <-> pseudonyme est stockée à part. Le nom n'est jamais envoyé à une API.
- L'accueil indique clairement que le professeur, sa voix et ses écrits sont produits par une IA.
- Événements enregistrés avec horodatage : réponses au QCM (choix, justification, certitude, temps),
  prédictions, ouverture d'un média, plein écran, durée de manipulation, questions et réponses,
  retours aux anciens tableaux, fin de chaque partie, post-test.
- Chaque partition jouée est conservée avec le pseudonyme de l'élève : on sait exactement ce qu'il
  a vu et entendu, avec quels modèles, quelle voix et quelle version des prompts (bloc generation).
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
  Respecte la section Design de CLAUDE.md ; toutes les valeurs visuelles vont dans client/css/theme.css.
- Crée .env.exemple (noms des clés, sans valeurs), requirements.txt et un README court :
  installer, lancer, arrêter.
- Crée outils/verifier_structure.py : il liste les fichiers de code de plus de 150 lignes
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
- Écris schemas/partition.schema.json d'après le résumé de CLAUDE.md, ancres et ton compris.
  Explique chaque champ en une ligne.
- Écris outils/valider_partition.py : il vérifie une partition (schéma, puis chaque ancre présente
  dans le texte_dit de son beat, dans l'ordre des actions) et affiche les erreurs en français.
- Lis contenu/cours/[nom du fichier] et propose un BROUILLON de partie 1 dans
  sorties/valide/partie_1.json : 8 à 12 beats, démarche POE, ressources prises dans le manifeste,
  une ancre par action. Pas encore d'audio.
Je corrigerai ce brouillon moi-même : il servira d'exemple aux agents.
```

Test attendu : le validateur affiche que partie\_1.json est valide. Relisez ensuite le brouillon et corrigez vous-même le contenu scientifique, la démarche, la trace écrite et la place des ancres : chaque écrit doit commencer sur le bon mot.

### Étape 3 — Le tableau : texte, formules, onglets

```text
Étape 3 — Le tableau qui écrit. Respecte toutes les règles de CLAUDE.md.
Objectif : jouer la partition modèle au tableau, sans voix.
À faire :
- Tableau SVG fond vert foncé. Zones définies dans config/tableau.json : titre, gauche, droite,
  a_retenir, cadre_media. Palette de craie nommée dans config/tableau.json : titres jaunes,
  texte blanc, à retenir rouge, schémas bleu clair. La couleur se déduit du style.
- Écriture manuscrite animée pour l'action ecrire. Essaie Vara.js et montre-moi le rendu
  de é, è, à, ç, ô. Sinon, police manuscrite révélée progressivement.
  Vitesse d'écriture réaliste, réglable dans config/tableau.json.
- Formules KaTeX + mhchem révélées de gauche à droite.
- Onglets Tableau 1, 2, 3... : nouveau_tableau crée un onglet ; les anciens restent consultables.
- Si une zone est pleine, signale-le dans la console. Jamais de chevauchement.
- Page client/demo_tableau.html avec boutons Lecture, Pause, Beat suivant, qui joue
  sorties/valide/partie_1.json avec une durée fixe de 4 secondes par beat. Sans audio, les actions
  d'un beat sont réparties dans l'ordre sur ces 4 secondes ; si l'écriture dure plus longtemps,
  le beat suivant attend.
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
Objectif : le prof parle et écrit en même temps, chaque écrit commençant sur le bon mot.
À faire :
- Lis d'abord la documentation à jour :
  Gemini TTS : https://ai.google.dev/gemini-api/docs/speech-generation
  ElevenLabs : https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
- serveur/voix/synthese.py : interface (texte, ton, texte avant et après facultatifs
  -> fichier audio + durée + temps des mots si disponibles). Elle contrôle le débit de l'audio
  et le régénère s'il sort de la plage de config/voix.json (2 fois au maximum).
- serveur/voix/gemini_tts.py : gemini-3.8-flash-tts. Le ton devient une consigne de style.
- serveur/voix/elevenlabs_tts.py : modèle Eleven v4, avec le temps de chaque caractère
  et l'enchaînement avec le beat précédent et le beat suivant. Seulement si une clé ElevenLabs
  est présente dans .env ; sinon, ne le crée pas et dis-le-moi.
- serveur/voix/cache_audio.py : un même texte, avec la même voix et le même ton, n'est généré qu'une fois.
- serveur/voix/ancrage.py : calcule debut_s de chaque action à partir de son ancre
  (temps réels des mots, ou estimation proportionnelle au nombre de caractères).
- outils/generer_audio.py : génère l'audio de chaque beat et de chaque branche de prédiction,
  enregistre fichier, durée et debut_s dans la partition, puis affiche le coût estimé.
- Lecteur : chaque action démarre à son debut_s, et l'écriture avance à la vitesse de
  config/tableau.json. Le beat suivant démarre quand l'audio ET l'écriture sont terminés,
  après une courte pause réglable.
- Comparaison à l'aveugle : génère le même passage de 3 beats consécutifs avec 2 voix Gemini
  et 2 voix ElevenLabs (si la clé existe) dans sorties/comparaison_voix/, sous des noms neutres
  (A, B, C, D). La correspondance entre lettre et voix est dans un fichier à part.
```

Test attendu : la partie 1 est jouée avec la voix, et chaque formule commence à s'écrire quand le prof la prononce. Faites écouter A, B, C, D à 2 ou 3 élèves sans leur dire qui est qui : la voix est-elle naturelle, claire, identique d'un beat à l'autre ? Notez le fournisseur et la voix retenus dans config/voix.json.

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
  (serveur/eleve/pseudonymes.py). Un court message indique que le professeur, sa voix
  et ses écrits sont produits par une IA.
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
- Lis d'abord la documentation à jour des sorties structurées et du cache de prompt :
  https://platform.claude.com/docs/en/build-with-claude/structured-outputs
  https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- appel_ia.py : seul point d'appel à l'API. Modèle et effort lus dans config/modeles.json,
  contexte stable mis en cache, sortie validée par un schéma, 2 nouvelles tentatives en cas d'erreur,
  refus journalisés.
- Un fichier par agent dans serveur/agents/. Chaque agent lit son prompt dans prompts/ et reçoit
  la partition modèle (sorties/valide/partie_1.json) comme exemple.
- Rédige un premier brouillon de chaque fichier de prompts/ ; je les relirai et les corrigerai.
- orchestrateur.py : pedagogique -> voix -> ecriture -> architecture -> chef
  -> corrections (2 tours maximum) -> validation par le schéma -> audio (plusieurs beats à la fois,
  nombre maximal dans config/application.json) -> ancrage -> validation finale.
  La partition reçoit son bloc generation (modèles, empreinte des prompts, fournisseur et voix, date).
- outils/generer_partie.py (numéro de la partie en paramètre) : lance toute la chaîne en ligne de commande
  et affiche la durée et le coût estimé de chaque agent et de la voix.
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
- Réponse orale avec le modèle rapide de config/voix.json (gemini-3.8-flash-lite-tts, ou son
  équivalent si un autre fournisseur a été retenu) et la même voix que le cours,
  + écriture courte dans une zone « brouillon », séparée de la trace écrite.
- Question hors programme : réponse courte et bienveillante, puis retour au cours.
```

Test attendu : une question posée pendant la partie est traitée après l'explication, avec la même voix que le cours et une écriture dans la zone brouillon.

### Étape 11 — Journal de recherche et post-test

```text
Étape 11 — Journal de recherche et post-test. Respecte toutes les règles de CLAUDE.md.
Objectif : recueillir les données de recherche.
À faire :
- journal_recherche.py : enregistre dans SQLite tous les événements listés dans CLAUDE.md,
  avec le pseudonyme et l'horodatage.
- À la fin du cours, pose le post-test : contenu/qcm/qcm_post.json
  [mêmes questions que le diagnostic, ou version parallèle].
- outils/exporter_donnees.py : exporte en CSV, un fichier par type d'événement, plus un fichier
  qui relie chaque élève aux partitions qu'il a suivies (bloc generation), prêt pour l'analyse statistique.
```

Test attendu : après un parcours complet, les fichiers CSV contiennent vos données, sans aucun nom réel, et vous savez quelle version des prompts et quelle voix chaque élève a eues.

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

Le dernier prompt est important pour votre recherche : la plupart des réglages pédagogiques (ton du prof, longueur des explications, place de la prédiction, voix, vitesse d'écriture) se trouvent dans prompts/ et config/, que vous pouvez modifier sans toucher au code.

## Ce qui change dans la version 2

- **Design (2.1).** Nouvelle section « Design de l'interface » dans le prompt maître : interface sobre, une seule couleur d'accent (le vert du tableau), polices du système, et une liste d'interdits (dégradés, ombres, emoji, icônes décoratives, slogans) pour éviter l'aspect générique des interfaces faites par IA.

- **Voix.** Gemini 3.8 Flash TTS est conservé : il est stable depuis le 22 septembre 2026, compte parmi les meilleures voix du moment et reste peu coûteux. Il a cependant une limite pour ce projet : il ne donne pas le moment où chaque mot est prononcé.
- **Synchronisation au mot.** Chaque action porte une ancre (un mot du texte dit) au lieu de démarrer au début du beat. Le code calcule l'instant exact si le fournisseur le donne, sinon il l'estime. L'écriture garde une vitesse réaliste ; si elle est plus longue que la parole, le beat suivant attend la fin de l'écriture.
- **ElevenLabs Eleven v4 en option.** Il donne le temps de chaque caractère et enchaîne l'intonation d'un beat à l'autre, mais coûte environ dix fois plus cher (ordre de grandeur). L'étape 5 compare les deux à l'aveugle avec des élèves ; le choix se fait ensuite dans config/voix.json, sans toucher au code.
- **Voix plus vivante et plus fiable.** Ajout d'un ton par beat, d'un cache audio, d'un contrôle du débit et de la même voix pour le répondeur.
- **Tableau.** La couleur est déduite du style, ce qui garde une trace écrite cohérente (titres jaunes, à retenir en rouge).
- **Claude.** Ajout de l'effort réglable par agent, du cache de prompt sur le contexte commun et de la gestion des refus.
- **Recherche.** Chaque partition jouée garde la trace des modèles, de la voix et de la version des prompts utilisés, et les élèves sont informés que le professeur est une IA.
- **Structure.** La limite de 150 lignes ne s'applique qu'au code, pas aux schémas JSON ni aux prompts.
