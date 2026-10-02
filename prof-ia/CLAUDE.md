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
