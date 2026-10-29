# Architecture

Carte des fichiers du projet et explication des réglages. Mise à jour à la fin de chaque étape.

## Fichiers

| Fichier | Rôle |
|---|---|
| CLAUDE.md | Règles du projet (prompt maître), relues par Claude Code à chaque session. |
| ARCHITECTURE.md | Cette carte des fichiers et l'explication des réglages. |
| JOURNAL.md | Suivi du travail, étape par étape. |
| README.md | Installer, lancer, arrêter, vérifier. |
| requirements.txt | Bibliothèques Python, avec des versions fixées (jsonschema pour les schémas ; anthropic et google-genai pour les agents et la voix, utilisées seulement avec les clés). |
| .env.exemple | Noms des clés d'API, sans valeurs. À copier sous le nom .env. |
| .gitignore | Ce qui n'est jamais envoyé dans git : clés d'API, données des élèves, fichiers générés. |
| config/application.json | Réglages généraux (mode, serveur, cours, classes, chemins, limites de structure). |
| config/modeles.json | Modèle Claude, effort, longueur maximale et repli de chaque agent ; nouveaux essais ; prix pour le coût estimé. |
| config/tableau.json | Couleurs du tableau, zones, vitesse d'écriture. |
| config/voix.json | Fournisseur de voix, modèles, style, tons, contrôle du débit. |
| serveur/main.py | Démarre le serveur web, branche les routes et sert contenu/ressources/ à l'adresse /ressources. |
| serveur/configuration.py | Lit les fichiers de config/. Ajouté à l'étape 1 (absent de l'arborescence d'origine). |
| serveur/routes/eleve.py | Routes /api/accueil, /api/eleve (inscription, pseudonyme) et /api/evenements (enregistrés dans le journal de recherche). |
| serveur/tests/test_main.py | Teste la page d'accueil et la route /api/accueil. |
| serveur/tests/test_configuration.py | Teste la lecture des réglages. |
| serveur/tests/test_verifier_structure.py | Teste l'outil de vérification de la structure. |
| contenu/cours/mouvement_rotation.docx | Le cours de l'enseignant (fait foi). |
| contenu/cours/mouvement_rotation.md | Version texte du cours, extraite automatiquement, lisible par les agents. |
| contenu/manifeste.json | Une fiche par ressource (documents, animations, enregistrements, laboratoires virtuels) : chapitre, activité et objectifs officiels, missions. |
| schemas/manifeste.schema.json | Format du manifeste. |
| schemas/partition.schema.json | Format de la partition : le contrat entre les agents et le lecteur. |
| sorties/valide/partie_1.json, partie_2.json, partie_3.json | Les trois parties (brouillons à relire par l'enseignant) : servies en mode figé, et en repli en mode adaptatif. La partie 1 sert aussi de modèle aux agents. |
| outils/valider_partition.py | Vérifie une partition (schéma + contrôles) et affiche les erreurs en français. |
| outils/controles_partition.py | Contrôles hors schéma : ancres, zones, couleurs, tons, ressources, chiffres dits. Ajouté à l'étape 2. |
| serveur/tests/test_valider_partition.py | Teste la validation des partitions. |
| outils/verifier_structure.py | Signale les fichiers de code de plus de 150 lignes et les fonctions de plus de 30 lignes. |
| client/index.html | Page d'accueil : nom, classe, cours ; message sur l'IA. |
| client/css/theme.css | Réglages visuels de l'interface : couleurs, polices, tailles, espaces. |
| client/css/base.css | Mise en page commune : bandeau, colonne de lecture, parcours de l'élève. |
| client/css/formulaire.css | Champs, listes, bouton, message, focus clavier. |
| client/js/api.js | Seul fichier qui parle au serveur depuis le navigateur. |
| client/demo_tableau.html | Pour l'enseignant : joue une partition validée (?partie=2), avec Lecture, Pause, Beat suivant. |
| client/css/tableau.css | Style du tableau, des onglets et des boutons de lecture ; déclare la police Caveat. |
| client/js/demo_tableau.js | Fait fonctionner la démonstration : boutons, état, texte dit, actions pas encore gérées. |
| client/js/lecteur/lecteur.js | Joue une partition beat par beat ; une seule écriture à la fois. |
| client/js/lecteur/horloge.js | Horloge de lecture : pause, reprise, accélération (« Beat suivant »). Ajoutée à l'étape 3. |
| client/js/tableau/tableau.js | Le tableau : une page par onglet, exécute les actions ecrire, formule, nouveau_tableau. |
| client/js/tableau/zones.js | Calcule les zones et y réserve la place ; signale une zone pleine dans la console. |
| client/js/tableau/ecriture.js | Écrit un texte en police manuscrite, révélé de gauche à droite, ligne par ligne. |
| client/js/tableau/formule.js | Écrit une formule KaTeX (et mhchem), révélée de gauche à droite. |
| client/js/tableau/onglets.js | Liens « Tableau 1, 2… » ; les anciens tableaux restent consultables. |
| client/bibliotheques/ | KaTeX, mhchem, Rough.js et la police Caveat, copiés dans le projet (voir LISEZMOI.md). |
| client/js/tableau/dessin.js | Dessine un schéma trait par trait dans un carré réservé de la zone. |
| client/js/tableau/crayon.js | Outils de dessin à la craie (Rough.js) : ligne, cercle, arc, point, étiquette, flèche. Ajouté à l'étape 4. |
| client/js/tableau/catalogue.js | Bouton « Tous les éléments » : dessine toute la bibliothèque sur un onglet à part. Ajouté à l'étape 4. |
| client/js/tableau/elements/*.js | Un fichier par élément : point, segment, fleche, cercle, angle, axe_rotation, repere_cercle, disque_points ; index.js les liste. |
| serveur/voix/synthese.py | Interface unique de la voix : texte + ton -> audio + durée (+ temps des mots) ; contrôle du débit. |
| serveur/voix/voix_essai.py | Voix d'essai sans clé : WAV muet de la durée de la parole. Ajoutée à l'étape 5 (en attendant la clé). |
| serveur/voix/cache_audio.py | Un même audio n'est produit qu'une fois (sorties/cache_audio/, servi à /audio). |
| serveur/voix/ancrage.py | Calcule debut_s de chaque action (temps des mots, ou estimation proportionnelle). |
| outils/generer_audio.py | Produit l'audio d'une partition (beats et réactions), calcule debut_s, vérifie, affiche le coût. |
| serveur/tests/test_voix.py | Teste la voix d'essai, le cache et l'ancrage. |
| client/js/lecteur/audio.js | Fait parler le prof : joue l'audio en suivant l'horloge ; silence de la bonne durée si le fichier manque. |
| client/js/interaction/prediction.js | Pose la question de prédiction (choix + justification), signale la réponse, joue la réaction prévue. |
| client/css/interaction.css | Style du panneau de prédiction. |
| contenu/qcm/qcm.json | QCM diagnostique (brouillon) : 9 questions, 3 par partie ; chaque mauvais choix renvoie à une conception. |
| schemas/qcm.schema.json | Format du QCM. |
| serveur/eleve/pseudonymes.py | Remplace le nom par un pseudonyme (E001…) ; correspondance gardée dans sorties/prive/. |
| serveur/eleve/profil.py | Calcule le profil sans IA : réussites par partie, conceptions détectées et leur solidité (selon la certitude). |
| serveur/donnees/stockage.py | Range les fichiers de chaque élève dans sorties/parties/<pseudonyme>/ ; refuse tout pseudonyme mal formé. |
| serveur/routes/qcm.py | /api/qcm?test=pre|post (sans les bonnes réponses) et /api/qcm/reponses (réponses, profil, journal ; lance la préparation de la partie 1). |
| serveur/tests/test_qcm.py + conftest.py | Testent le QCM, le pseudonyme et le profil ; les tests écrivent dans un dossier temporaire. |
| client/qcm.html + js/interaction/qcm.js + qcm_question.js | Le questionnaire (départ, ou fin avec ?test=post), une question à la fois : choix, justification, certitude, temps. Au départ, les réponses de la partie 1 partent dès la 3e question. |
| client/attente.html + js/attente.js | Page d'attente : suit la vraie préparation de la partie 1, puis « Entrer en classe ». |
| client/js/session_eleve.js | Garde le pseudonyme pendant la séance (sessionStorage). |
| client/css/parcours.css | Style du QCM et de la page d'attente. |
| client/js/medias/cadre_media.js | Ouvre une ressource (simulation, image, vidéo, document) dans un cadre sur le tableau ; Plein écran ; attend « J'ai terminé ». |
| client/css/medias.css | Style du cadre des médias. |
| contenu/ressources/animations/ | Simulations interactives : grande_roue, reperage, coussin_air, rotation_uniforme (+ commun/style.css, commun/outils.js, LISEZMOI.md). |
| serveur/routes/parties.py | Routes /api/tableau (réglages du tableau), /api/manifeste et /api/parties/<n> (partition validée). |
| serveur/tests/test_parties.py | Teste ces deux routes. |
| client/js/accueil.js | Remplit les listes de l'accueil ; à l'envoi, inscrit l'élève (pseudonyme) et ouvre le questionnaire. |
| serveur/cles.py | Lit les clés d'API dans .env (jamais dans le code) ; dit si une clé est présente ; message clair si elle manque. |
| serveur/agents/appel_ia.py | Seul fichier qui parle à l'API Claude : contexte en cache, sortie JSON imposée par un schéma, effort, repli, nouveaux essais, coût. |
| serveur/agents/commun.py | Contexte stable partagé par les agents (règles, cours, ressources du chapitre du cours, partition modèle) et appel d'un agent. |
| serveur/agents/pedagogique.py, voix.py, ecriture.py, architecture.py, chef.py, repondeur.py | Les six agents : chacun lit son prompt (prompts/<nom>.md) et répond au format de schemas/agents/<nom>.schema.json. |
| prompts/commun.md + prompts/<agent>.md | Les consignes des agents, en français. Seul endroit où elles sont écrites. |
| schemas/plan_pedagogique.schema.json, schemas/agents/*.schema.json | Format imposé à la réponse de chaque agent. |
| serveur/pipeline/assemblage.py | Construit la partition à partir des réponses des agents (le code, pas l'IA, écrit la partition). |
| serveur/pipeline/orchestrateur.py | Enchaîne les agents, la relecture du chef (deux tours de corrections au plus), la validation et la voix. |
| serveur/pipeline/donnees_eleve.py | Ce que l'agent pédagogique sait de l'élève : réponses au QCM de la partie, profil, partie précédente, prédictions et questions. Jamais le nom. |
| serveur/pipeline/file_attente.py | Prépare les parties de chaque élève en arrière-plan (N, puis N+1 pendant qu'il suit N) ; repli sur la partie validée. |
| serveur/routes/classe.py | /api/eleve/<pseudonyme>/etat (préparation des parties) et /api/eleve/<pseudonyme>/parties/<n> (partition servie, notée au journal). |
| serveur/routes/questions.py | /api/questions : main levée ; réponse de l'agent répondeur, dite par la voix du professeur ; message prévu sans clé. |
| serveur/donnees/journal_recherche.py | Journal de recherche SQLite (sorties/journaux/journal.sqlite) : un événement par ligne, sous pseudonyme, heure du navigateur et du serveur. |
| serveur/voix/gemini_tts.py | Voix Gemini (clé GEMINI_API_KEY) : seul fichier qui parle à ce fournisseur. |
| serveur/voix/audio_partition.py | Produit tous les audios d'une partition (plusieurs à la fois), puis les instants debut_s. |
| outils/generer_partie.py | Fait produire une partie par les agents depuis le terminal (pour l'enseignant, ou pour un élève avec --eleve). |
| outils/exporter_donnees.py | Exporte les données de recherche en CSV (eleves, qcm, profils, conceptions, un fichier par type d'événement). Ne lit jamais la correspondance des noms. |
| contenu/qcm/qcm_post.json | Questionnaire de fin (pour l'instant : mêmes questions que celui de départ, à valider). |
| client/classe.html + js/classe.js | La classe : les parties de l'élève l'une après l'autre ; Pause ; main levée ; questionnaire de fin. |
| client/js/classe_attente.js | Entre deux parties, si la suivante n'est pas prête : « à retenir » de la partie précédente, à recopier, et message d'avancement. |
| client/js/interaction/main_levee.js | Lever la main : la question est notée, le professeur répond à la fin de sa phrase, à voix haute et au brouillon. |
| client/css/classe.css | Mise en page de la classe (tableau + colonne de l'élève), brouillon, panneau d'attente. |
| client/fin.html | Remerciement à la fin de la séance. |
| serveur/tests/faux_claude.py | Faux client Claude pour les tests : jamais d'appel réel ni de clé. |
| serveur/tests/test_agents.py, test_classe.py, test_questions.py, test_export.py | Testent agents et orchestrateur, file d'attente et classe, main levée, export. |

| contenu/orientations/instructionsPC lycee.pdf | Document officiel (2007, en arabe) : orientations pédagogiques et programmes de physique-chimie du lycée. |
| contenu/orientations/index.json | Niveaux, filières, horaires annuels et liste des 63 chapitres. |
| contenu/orientations/general.json | Règles générales : finalités, démarche, écriture scientifique, cahier de l'élève. |
| contenu/orientations/<niveau>/<chapitre>.json | Une fiche par chapitre (tronc_commun, 1bac, 2bac) : contenus, objectifs O1…, activités, orientations, hors programme, ajouts par filière. |
| schemas/orientations_chapitre.schema.json | Format d'une fiche de chapitre. |
| serveur/orientations.py | Lit les fiches, adapte celle du cours à la filière, prépare le texte compact donné aux agents et les objectifs de chaque partie. |
| outils/couverture_orientations.py | Tableau pour l'enseignant : quels objectifs officiels sont traités par quelles parties. |
| serveur/tests/test_orientations.py | Vérifie les 63 fiches, l'index, l'adaptation par filière et le lien avec le cours. |

Les fichiers `__init__.py` signalent à Python qu'un dossier contient du code ; ils sont vides.
Les dossiers encore vides contiennent un fichier `.gitkeep`, pour que git les garde.

## Réglages

### config/application.json

| Réglage | Rôle | Valeur de départ |
|---|---|---|
| mode | « fige » : parties validées, aucun appel à l'IA. « adaptatif » : parties générées pour chaque élève. | fige, pour qu'aucun appel payant ne parte par erreur |
| serveur.hote | Adresse du serveur. 127.0.0.1 = accessible depuis cet ordinateur seulement. | 127.0.0.1 |
| serveur.port | Numéro de port : l'adresse devient http://127.0.0.1:8000. | 8000 |
| cours | Cours proposés à l'accueil : identifiant, titre affiché, nombre de parties. | rotation d'un solide autour d'un axe fixe, 3 parties |
| cours.orientations | Fiche du programme officiel du chapitre (contenu/orientations/<niveau>/<chapitre>). | 1bac/meca1_rotation |
| cours.filiere | Filière de la classe : elle choisit les ajouts propres à la filière (codes dans contenu/orientations/index.json). | SE |
| cours.objectifs_par_partie | Objectifs officiels (O1, O2…) attribués à chaque partie : l'agent pédagogique les reçoit. | 1 : O1, O2 ; 2 : O3, O4 ; 3 : O5, O6 |
| classes | Classes proposées à l'accueil. Une liste évite les fautes de frappe dans les données. | à remplacer par vos classes |
| pseudonymes.prefixe / chiffres | Forme des pseudonymes : E001, E002… | E / 3 |
| chemins | Dossiers et fichiers du projet, relatifs au dossier prof-ia (dont le journal SQLite et le dossier des exports). | voir le fichier |
| generation.audios_en_parallele | Nombre d'audios générés en même temps. | 4 |
| generation.agents_en_parallele | Nombre de parties préparées en même temps par les agents (tous élèves confondus). | 2 |
| generation.intervalle_suivi_s | Toutes les combien de secondes les pages d'attente et de classe relisent l'état de préparation. | 2 |
| main_levee.longueur_max_question | Longueur maximale d'une question (caractères). | 400 |
| main_levee.beats_deja_dits_max | Nombre de phrases déjà dites envoyées au répondeur comme contexte. | 12 |
| main_levee.ton_reponse | Ton de la voix pour les réponses. | encourageant |
| main_levee.message_sans_cle / message_erreur | Ce que dit le professeur quand il ne peut pas répondre (pas de clé, ou échec). | voir le fichier |
| structure.lignes_max_fichier | Longueur maximale d'un fichier de code. | 150 |
| structure.lignes_max_fonction | Longueur maximale d'une fonction. | 30 |
| structure.extensions_code | Types de fichiers considérés comme du code. | .py, .js, .html, .css |
| structure.dossiers_ignores | Dossiers non vérifiés : outils techniques, vos ressources (contenu), fichiers générés (sorties), bibliothèques externes. | voir le fichier |

### config/modeles.json

| Réglage | Rôle | Valeur de départ |
|---|---|---|
| agents.<nom>.modele | Modèle Claude utilisé par l'agent. | Opus 5.5 pour pedagogique et chef, Sonnet 5.5 pour voix, ecriture, architecture, Haiku 4.5 pour repondeur |
| agents.<nom>.effort | Profondeur de réflexion : low, medium, high, xhigh, max. Plus haut = meilleur, mais plus lent et plus cher. Haiku 4.5 n'a pas ce réglage. | high pour pedagogique et chef, medium pour les autres |
| nouvelles_tentatives_max | Nouveaux essais si un appel échoue. | 2 |
| tours_de_correction_max | Allers-retours entre l'agent chef et les autres agents. | 2 |
| agents.<nom>.max_tokens | Longueur maximale d'une réponse. | 32000 (Opus), 24000 (Sonnet), 4000 (Haiku) |
| agents.<nom>.repli | Si le modèle refuse de répondre, l'API essaie automatiquement un autre modèle. | true sauf pour le répondeur |
| beta_repli | Nom technique de cette option de repli dans l'API. | server-side-fallback-2026-07-01 |
| attente_entre_tentatives_s | Attente avant un nouvel essai (multipliée par le numéro de l'essai). | 5 s |
| prix_par_million_de_jetons | Prix de chaque modèle (entrée, sortie, cache), pour le coût estimé de chaque partie. | à vérifier sur la page des prix d'Anthropic |

### config/tableau.json

| Réglage | Rôle | Valeur de départ |
|---|---|---|
| dimensions | Taille du tableau en unités de dessin (il s'adapte ensuite à l'écran). | 1600 × 900 |
| fond | Couleur du tableau. | vert foncé |
| palette | Craies disponibles, avec un nom chacune. | jaune, blanc, rouge, bleu_clair |
| couleur_par_style | Craie utilisée selon le style de l'écrit. | titre jaune, normal blanc, a_retenir rouge, formule blanc, schema bleu_clair |
| zones | Zones du tableau, en fractions de sa largeur et de sa hauteur (x = 0.03 : à 3 % du bord gauche). | titre, gauche, droite, a_retenir, cadre_media |
| ecriture.vitesse_caracteres_par_s | Vitesse d'écriture à la craie. | 14 caractères par seconde |
| ecriture.pause_entre_beats_s | Courte pause entre deux beats. | 0,4 s |
| police.famille | Police de l'écriture à la craie. | Caveat |
| police.taille_titre / taille_texte / taille_formule | Tailles d'écriture, en unités du tableau. | 54 / 38 / 30 |
| police.interligne | Espace entre deux lignes (1,2 = 20 % de la hauteur des lettres). | 1,2 |
| marge_zone | Marge intérieure de chaque zone. | 14 |
| espace_entre_ecrits | Espace entre deux écrits d'une même zone. | 6 |
| dessin.vitesse_trait_par_s | Vitesse du trait de craie pour les schémas. | 700 |
| dessin.rugosite / epaisseur / graine | Aspect fait main (0 = règle parfaite), épaisseur du trait, graine (même dessin à chaque fois). | 1,1 / 3 / 7 |
| dessin.taille_etiquette | Taille des noms de points et d'angles. | 36 |
| dessin.taille_min / taille_max | Côté minimal et maximal du carré d'un schéma. | 180 / 440 |
| demo.duree_beat_s | Durée d'un beat dans la démonstration sans voix (étape 3). | 4 s |

Zones agrandies à l'étape 3 (titre, a_retenir) pour que la partie 1 tienne. cadre_media couvre la droite du tableau (62 % de la largeur) : le cadre d'une simulation se pose par-dessus le tableau, puis se ferme sans rien effacer.

### config/voix.json

| Réglage | Rôle | Valeur de départ |
|---|---|---|
| fournisseur | Voix utilisée : essai (sans clé, muette), gemini ou elevenlabs. | essai, en attendant la clé |
| essai.debit_caracteres_par_s / frequence_hz / marge_s | Durée simulée de la parole (14 caractères par seconde) et format du fichier muet. | 14 / 8000 / 0,3 |
| <fournisseur>.cout_par_million_caracteres | Prix, pour le coût estimé affiché par generer_audio. | 0 pour essai |
| gemini.modele_cours / modele_repondeur | Modèles de voix pour le cours et pour les réponses. | gemini-3.8-flash-tts / gemini-3.8-flash-lite-tts |
| gemini.voix | Nom de la voix Gemini. | Charon (à écouter et changer si besoin) |
| gemini.frequence_hz | Format du son renvoyé par Gemini. | 24000 |
| gemini.gabarit_demande | Phrase envoyée à Gemini : la consigne de style, puis le texte à lire tel quel. | voir le fichier |
| elevenlabs.* | Mêmes réglages pour ElevenLabs. Noms des modèles à confirmer dans la documentation à l'étape 5. | eleven_v4 / eleven_v4_turbo |
| consigne_style | Description de la voix du professeur, envoyée au modèle de voix. | professeur chaleureux et posé |
| tons | Traduction de chaque ton (choisi par l'agent voix) en consigne de jeu. | neutre, enthousiaste, interrogatif, lent_et_clair, encourageant |
| debit_caracteres_par_s | Plage de débit normale. En dehors, l'audio est régénéré. | 8 à 22 |
| nouvelles_tentatives_max | Nouveaux essais pour un audio anormal. | 2 |

## Design

Les règles sont dans la section « Design de l'interface » de CLAUDE.md. En bref : fond papier, encre presque noire, une seule couleur d'accent (le vert du tableau), polices du système, aucun effet décoratif. Toutes les valeurs visuelles sont dans client/css/theme.css.

## Partition : lire et vérifier

Une partition est un fichier JSON par partie. Chaque beat contient ce que dit le prof (`texte_dit`, tout en lettres), son ton et ses actions au tableau. Chaque action porte une `ancre`, un morceau de `texte_dit` : l'action démarre quand ce morceau est prononcé.

Pour vérifier une partition :

```
python -m outils.valider_partition sorties/valide/partie_1.json
```

Erreurs (bloquantes) : champ manquant ou inconnu, ancre absente de `texte_dit` ou dans le désordre, zone, couleur, ton ou ressource inconnus, choix de prédiction sans réaction.
Avertissements : chiffre ou symbole dans un texte dit, fichier de ressource pas encore fourni.

## Les deux modes

- **figé** (`"mode": "fige"` dans config/application.json) : chaque élève reçoit les parties de sorties/valide/. Aucun appel à l'IA, aucune clé nécessaire. La main levée note la question et répond par le message prévu.
- **adaptatif** (`"mode": "adaptatif"`) : avec la clé ANTHROPIC_API_KEY dans .env, les agents préparent chaque partie pour l'élève (son QCM, son profil, ses prédictions). Sans clé, ou si les agents échouent, l'élève reçoit la partie validée : le cours ne s'arrête jamais.

Chaîne des agents pour une partie : pédagogique (plan POE) → voix (texte dit) → écriture (tableau) → architecture (zones, médias, prédiction) → assemblage par le code → validation → chef (relecture ; corrections renvoyées à l'agent concerné, deux tours au plus) → voix (audio) → validation finale. Bilan (jetons, durée, coût) dans sorties/parties/<pseudonyme>/partie_<n>_bilan.json.

## Données de recherche

Tout est sous pseudonyme. La correspondance nom ↔ pseudonyme est seulement dans sorties/prive/ (jamais dans git, jamais envoyée à une API, jamais exportée).

| Où | Quoi |
|---|---|
| sorties/parties/<pseudonyme>/ | eleve.json, reponses_qcm.json, profil.json, reponses_qcm_post.json, profil_post.json, partie_<n>.json (et leur bilan). |
| sorties/journaux/journal.sqlite | Un événement par ligne : inscription, qcm_pre, qcm_post, prediction, media_ouvert, plein_ecran, media_termine, partie_servie, partie_commencee, partie_terminee, retour_onglet, main_levee, question_posee, reponse_donnee, generation, generation_erreur. |
| sorties/journaux/exports/ | Les CSV produits par `python -m outils.exporter_donnees` (séparateur ;, ouverts directement par un tableur). |

## Programme officiel

Les orientations pédagogiques nationales (PDF officiel) sont résumées en fiches JSON courtes, une par chapitre
et par niveau. L'application n'en lit qu'une : celle du cours, adaptée à la filière de la classe.
Elle est placée dans le contexte de tous les agents (environ 1 300 jetons, mis en cache) avec des règles strictes
(prompts/commun.md) : objectifs à servir, hors programme interdit, orientations à suivre à la lettre.
Chaque partie déclare les objectifs qu'elle traite (generation.objectifs_officiels) ; la validation refuse un
objectif inconnu, et `python -m outils.couverture_orientations` montre ce qui est couvert.
Codes des filières : TCS, TCT (tronc commun) ; SE, ST, SM (1re année) ; SVT, SA, STM, STE, PC, SMA, SMB (2e année).

## Laboratoires virtuels (une simulation par activité du programme)

| Fichier | Rôle |
|---|---|
| contenu/ressources/laboratoires/LISEZMOI.md | Mode d'emploi, et tableau activités / objectifs officiels -> simulations. |
| contenu/ressources/laboratoires/<nom>.html | Simulation autonome (un seul fichier), produite par outils/assembler_laboratoire.py. |
| contenu/ressources/laboratoires/commun/base.js | Espace de noms Labo : éléments SVG et HTML, nombres à la française, écriture scientifique, annonces, animations. |
| contenu/ressources/laboratoires/commun/scene.js | Scène fixe 1024 × 640 mise à l'échelle ; zoom à deux doigts jusqu'à 5×, molette, double-tap. |
| contenu/ressources/laboratoires/commun/glisser.js | Glisser-déposer réaliste (objet soulevé, ombre), toucher bref, chute. |
| contenu/ressources/laboratoires/commun/materiaux.js | Matières 2,5D (métal, laiton, verre, eau, bois, mousse, brique, astres), ombres, flèches, tiges métalliques. |
| contenu/ressources/laboratoires/commun/decor.js | Mur, carrelage, paillasse, placards, étagère de verrerie, pense-bête. |
| contenu/ressources/laboratoires/commun/espace.js | Ciel étoilé, Soleil, Terre et Lune réalistes (nuit du côté opposé au Soleil). |
| contenu/ressources/laboratoires/commun/continents.js | Contours des continents (latitude, longitude) et projection de la Terre vue de l'espace. |
| contenu/ressources/laboratoires/commun/sonde.js | Sonde spatiale et afficheur de son capteur. |
| contenu/ressources/laboratoires/commun/formules.js | Calcul sûr des formules du tableur (=B2/A2, ^, RACINE, ABS, PI, COS, SIN, LN, EXP, recopie). |
| contenu/ressources/laboratoires/commun/tableur.js | Feuille de calcul de la tablette (une par mission). |
| contenu/ressources/laboratoires/commun/courbe.js | Application Graphique : points qui se dessinent, modélisation par une droite. |
| contenu/ressources/laboratoires/commun/tablette.js | Tablette posée / prise en main, applications Tableur et Graphique. |
| contenu/ressources/laboratoires/commun/carnet.js | Carnet de laboratoire : missions, étapes cochées, questions, données, tampon. |
| contenu/ressources/laboratoires/commun/missions.js | Moteur des missions : vérifications automatiques, réponses, passage d'une mission à l'autre, postMessage. |
| contenu/ressources/laboratoires/commun/tri.js | Tableau magnétique : étiquettes à classer dans des colonnes (nombre d'étiquettes par ligne réglable). |
| contenu/ressources/laboratoires/commun/bouton.js | Bouton-poussoir lumineux (par exemple « Pause / Lecture » du temps), au doigt, à la souris et au clavier. |
| contenu/ressources/laboratoires/commun/coussin_air.js | Table à coussin d'air en perspective, clou central, mobile lancé d'un geste, fil à accrocher. |
| contenu/ressources/laboratoires/commun/coussin_air_mouvement.js | Mouvement du mobile image par image : glissement, pente, rotation autour du clou, rebonds. |
| contenu/ressources/laboratoires/commun/eclateur.js | Éclateur : durée τ, bouton « Enregistrer », un point toutes les τ (30 au plus). |
| contenu/ressources/laboratoires/commun/feuille_enregistrement.js | Feuille d'enregistrement : points sur la table, feuille relevée à l'échelle, numéros Mi. |
| contenu/ressources/laboratoires/commun/outils_mesure.js | Transparent millimétré (origine du repère) et règle graduée qui pivote. |
| contenu/ressources/laboratoires/commun/vecteurs_vitesse.js | Flèches-vecteurs vitesse à tracer sur la feuille, et leur vérification. |
| contenu/ressources/laboratoires/commun/verif_enregistrement.js | Calculs de vérification sur un enregistrement : alignement, coordonnées, vitesse, distance. |
| contenu/ressources/laboratoires/commun/soufflerie.js | Soufflerie de la table à coussin d'air : air en marche ou coupé (frottement), observation du palet. |
| contenu/ressources/laboratoires/commun/dessin_palet.js | Dessin d'un palet autoporteur (surcharge, lettre, câble) pour les systèmes de plusieurs mobiles. |
| contenu/ressources/laboratoires/commun/surcharge.js | Surcharge en laiton à poser sur un mobile ou à retirer, par glisser-déposer. |
| contenu/ressources/laboratoires/commun/dynamometre.js | Dynamomètre à ressort réglable (calibre, graduations), oscillation amortie. |
| contenu/ressources/laboratoires/commun/masses.js | Masses marquées et caillou, dessinés debout ou suspendus. |
| contenu/ressources/laboratoires/commun/accrochage.js | Accrocher des masses en chaîne sous un dynamomètre ou un ressort ; mesures notées. |
| contenu/ressources/laboratoires/commun/potence.js | Potence de laboratoire et coffret de masses marquées. |
| contenu/ressources/laboratoires/commun/circuit_solveur.js | Calcul des potentiels et des courants d'un circuit continu (méthode des nœuds, DEL et limitation itérées, sources commandées par une tension pour le transistor et l'AO). |
| contenu/ressources/laboratoires/commun/circuit.js | Circuit d'une paillasse : composants, bornes, fils ; recalcul et distribution des courants à chaque changement. |
| contenu/ressources/laboratoires/commun/circuit_fils.js | Fils de connexion : tirer d'une borne à l'autre, débrancher, fiches banane empilées, câble souple. |
| contenu/ressources/laboratoires/commun/circuit_decor.js | Paillasse d'électricité vue de haut (mur, bloc de prises, plan de travail), boîtiers, cordons secteur. |
| contenu/ressources/laboratoires/commun/circuit_generateur.js | Générateur de tension continue : afficheur, Marche/Arrêt, limitation de courant, cordon et fiche secteur ; touches de réglage sur le dessus. |
| contenu/ressources/laboratoires/commun/circuit_recepteurs.js | Lampe (éclat selon la puissance), DEL avec résistance de protection, interrupteur à couteau. |
| contenu/ressources/laboratoires/commun/multimetre.js | Multimètre : commutateur à 16 positions (V⎓, V~ 2 et 20 V, A~ 20 et 200 mA, A⎓ 2 mA à 10 A, Ω), quatre bornes, afficheur, fusible de la borne mA. |
| contenu/ressources/laboratoires/commun/multimetre_mesure.js | Ce que mesure le multimètre selon le calibre : valeur, résolution, dépassement, précision de la notice, TRMS (tension et intensité alternatives). |
| contenu/ressources/laboratoires/commun/mesure_tension.js | Reconnaît la tension U_XY mesurée par un voltmètre entre deux points nommés. |
| contenu/ressources/laboratoires/commun/circuit_resistances.js | Résistances au vrai code des couleurs (support, plaquette), planche de fils résistants. |
| contenu/ressources/laboratoires/commun/circuit_pile.js | Pile plate de 4,5 V dans un boîtier à bornes. |
| contenu/ressources/laboratoires/commun/gbf.js | Générateur basse fréquence : formes sinus, triangle, carré ; fréquence affichée ; amplitude réglable. |
| contenu/ressources/laboratoires/commun/oscilloscope.js | Oscilloscope à une ou deux voies : réglages Sv (par voie) et b, entrées Y1, Y2 et masse commune, cordon secteur. |
| contenu/ressources/laboratoires/commun/oscilloscope_ecran.js | Écran de l'oscilloscope : quadrillage 10 × 8, repère de masse de chaque voie, une ou deux traces déclenchées sur front montant. |
| contenu/ressources/laboratoires/commun/circuit_semiconducteurs.js | Diode 1N4007 et diode Zener 5,1 V sur support (caractéristiques exponentielles, symbole, bague de cathode). |
| contenu/ressources/laboratoires/commun/thermistance.js | Thermistance CTN : sonde à plonger dans des béchers, température qui évolue, R(T). |
| contenu/ressources/laboratoires/commun/photoresistance.js | Photorésistance : éclairement par une lampe de poche déplaçable, cache noir, R(E). |
| contenu/ressources/laboratoires/commun/rheostat.js | Rhéostat à curseur (bornes A, B, C), résistance variable. |
| contenu/ressources/laboratoires/commun/electrolyseur.js | Électrolyseur : récepteur E', r' (coude arrondi), bulles plus abondantes à la cathode. |
| contenu/ressources/laboratoires/commun/caracteristique.js | Relevé des points (I, U) d'un dipôle quand les appareils sont bien branchés ; vérification du tableur. |
| contenu/ressources/laboratoires/commun/transistor.js | Transistor NPN BC547 sur support (modèle d'Ebers-Moll) : régimes bloqué, linéaire, saturé ; courants I_B, I_C, I_E. |
| contenu/ressources/laboratoires/commun/amplificateur_operationnel.js | Alimentation symétrique ±15 V et AO 741 sur plaquette : régime linéaire ou saturé (±13,5 V), choisi de façon cohérente. |
| contenu/ressources/laboratoires/commun/chimie_melange.js | Contenu d'un récipient de chimie (produits, réactifs, solides) et règles des tests : pH, phénolphtaléine, eau iodée, Fehling, sulfate de cuivre anhydre. |
| contenu/ressources/laboratoires/commun/chimie_verrerie.js | Dessin de la verrerie : tube à essai, bécher, verre de montre, flacon compte-gouttes, pipette, porte-tubes. |
| contenu/ressources/laboratoires/commun/chimie_gouttes.js | Paillasse de chimie (plans de dessin, cibles) et pipette compte-gouttes : les gouttes tombent une à une. |
| contenu/ressources/laboratoires/commun/chimie_objets.js | Tube à essai déplaçable, verre de montre, bécher d'échantillon avec sa pipette, flacon de réactif. |
| contenu/ressources/laboratoires/commun/chimie_poudre.js | Pot de sulfate de cuivre anhydre (pictogrammes) et spatule. |
| contenu/ressources/laboratoires/commun/chimie_chauffage.js | Bain-marie à 80 °C (plaque chauffante, bécher, thermomètre) ; les tubes plongés chauffent. |
| contenu/ressources/laboratoires/commun/chimie_decor.js | Affiche de sécurité du laboratoire de chimie (lunettes, blouse, ne jamais goûter). |
| contenu/ressources/laboratoires/commun/chimie_plaque.js | Plaque chauffante (dessin, et version avec touche Marche/Arrêt). |
| contenu/ressources/laboratoires/commun/documents_mur.js | Documents affichés au mur, qui s'agrandissent quand on les touche. |
| contenu/ressources/laboratoires/commun/chronometre.js | Chronomètre de paillasse (temps accéléré) pour les extractions. |
| contenu/ressources/laboratoires/commun/liquide_geometrie.js | Géométrie des liquides : aire d'un polygone, découpe par une droite, niveau d'une surface libre. |
| contenu/ressources/laboratoires/commun/liquide_contenu.js | Contenu liquide en phases (miscibles ou non, rangées par densité), espèces dissoutes, émulsion, partage, couleurs. |
| contenu/ressources/laboratoires/commun/chimie_reactions.js | Réactifs et échantillons des tests (jus, vinaigre, Fehling...), pH d'une phase, phénolphtaléine, réaction de Fehling quand on chauffe. |
| contenu/ressources/laboratoires/commun/verrerie_profils.js | Verrerie aux vraies dimensions (mm) : béchers 50 à 600 mL, tube, éprouvette, erlenmeyer, ampoule, ballon ; volume ↔ hauteur. |
| contenu/ressources/laboratoires/commun/verrerie_rendu.js | Dessin réaliste d'une pièce de verrerie et de son liquide (phases, surface, graduations, reflets). |
| contenu/ressources/laboratoires/commun/verrerie_accessoires.js | Robinet, bouchon, tige, pied, étiquette, col rodé dessinés avec la verrerie. |
| contenu/ressources/laboratoires/commun/recipient_physique.js | Récipient qui respecte la physique : surface horizontale, ballottement, débordement, robinet (Torricelli). |
| contenu/ressources/laboratoires/commun/ecoulement.js | Chute libre du liquide qui sort d'un récipient : il entre dans un récipient ou une cible, ou fait une flaque. |
| contenu/ressources/laboratoires/commun/recipient_gestes.js | Prendre, secouer, poser un récipient, le mettre sur un support, verser en l'inclinant. |
| contenu/ressources/laboratoires/commun/pipette_physique.js | Flacon compte-gouttes et pipette Pasteur : gouttes de 0,05 mL qui tombent là où on tient la pipette. |
| contenu/ressources/laboratoires/commun/verre_montre.js | Verre de montre (60 ou 80 mm) : échantillon solide, papier pH, sulfate de cuivre ; taches des gouttes. |
| contenu/ressources/laboratoires/commun/porte_tubes.js | Porte-tubes en plastique (plateau percé devant les tubes) et ses places. |
| contenu/ressources/laboratoires/commun/bain_marie_physique.js | Bain-marie à taille réelle (plaque, bécher de 600 mL, thermomètre) ; les tubes plongés chauffent. |
| contenu/ressources/laboratoires/commun/plaque_ccm.js | Plaque de chromatographie (5 × 10 cm) : ligne, dépôts, montée du front, taches selon Rf, révélation UV et diiode. |
| contenu/ressources/laboratoires/commun/pictogrammes.js | Pictogrammes de danger SGH (flamme, corrosion, point d'exclamation, environnement). |
| contenu/ressources/laboratoires/commun/equipement.js | Lunettes et gants accrochés au mur, à mettre avant de manipuler un produit corrosif. |
| contenu/ressources/laboratoires/commun/chauffe_ballon.js | Chauffe-ballon de 250 mL (cuvette, commandes, voyant). |
| contenu/ressources/laboratoires/commun/pierre_ponce.js | Flacon de pierre ponce et pincée de grains à lâcher dans un ballon. |
| contenu/ressources/laboratoires/commun/refrigerant_boules.js | Réfrigérant à boules (eau du manchon, gouttes du reflux) et position de ses embouts. |
| contenu/ressources/laboratoires/commun/montage_reflux.js | Montage à reflux : ballon, chauffe, ébullition, reflux ou perte des vapeurs, avancement de la réaction. |
| contenu/ressources/laboratoires/commun/reflux_gestes.js | Gestes du reflux : entonnoir, réfrigérant à poser, robinet, chauffe, tuyaux qui suivent. |
| contenu/ressources/laboratoires/commun/poste_synthese.js | Paillasse de synthèse au reflux : équipement, réactifs, catalyseur, montage, récepteur. |
| contenu/ressources/laboratoires/commun/buchner.js | Dessins de la filtration sous vide : Büchner, trompe, tuyau à vide, pissette, papiers. |
| contenu/ressources/laboratoires/commun/buchner_poste.js | Paillasse de filtration sous vide (papier mouillé, vide, versement, ordre d'arrêt). |
| contenu/ressources/laboratoires/commun/ampoule_support.js | Ampoule à décanter sur son anneau : boucher, secouer, dégazer, robinet. |
| contenu/ressources/laboratoires/commun/ccm_materiel.js | Petit matériel de la CCM : crayon, capillaires, règle, couvercle, lampe UV, bocal de diiode, bidon. |
| contenu/ressources/laboratoires/commun/ccm_gestes.js | Gestes de la CCM : ligne, dépôts, plaque dans la cuve, front, cercles sous UV. |
| contenu/ressources/laboratoires/commun/ccm_poste.js | Paillasse de chromatographie (cuve, éluant, plaque, chronomètre, faits notés). |
| contenu/ressources/laboratoires/commun/ccm_missions.js | Étapes communes des missions de CCM et vérification des Rf au tableur. |
| contenu/ressources/laboratoires/commun/balance_electronique.js | Balance électronique au centième (200 g) : plateau, afficheur qui se stabilise, Marche/Arrêt, tare. |
| contenu/ressources/laboratoires/commun/echantillons_metal.js | Cylindres de métal de même volume (cuivre, aluminium, fer, zinc) à poser sur la balance. |
| contenu/ressources/laboratoires/commun/spatule_physique.js | Pot de poudre et microspatule plantée dedans : une pointe de poudre versée dans un récipient. |
| contenu/ressources/laboratoires/commun/bec_bunsen.js | Bec Bunsen : robinet de gaz, allume-gaz, virole (flamme bleue ou jaune), température de la flamme. |
| contenu/ressources/laboratoires/sources/tc_chim4_a1_rutherford/ | Histoire du modèle de l'atome et expérience de Rutherford (chambre de diffusion, pompe, compteur). |
| contenu/ressources/laboratoires/sources/tc_chim4_a2_masse/ | Constituants de l'atome (tableau de l'atome : Z, A, ions, couches K L M), masse des atomes, pesée du cuivre. |
| contenu/ressources/laboratoires/sources/tc_chim4_a3_cuivre/ | Cycle du cuivre dans un tube, sous la hotte : conservation de l'élément cuivre. |
| contenu/ressources/laboratoires/sources/tc_chim4_a4_carbone/ | Combustion du carbone dans le dioxygène, eau de chaux ; cycle du carbone, abondance des éléments. |
| contenu/ressources/laboratoires/commun/tableau_atome.js | Tableau magnétique de l'atome (noyau, couches K, L, M, aimants protons, neutrons, électrons). |
| contenu/ressources/laboratoires/commun/lewis_regles.js | Règles de Lewis : duet, octet, nombre de liaisons, formule brute, signature des isomères. |
| contenu/ressources/laboratoires/commun/lewis_dessin.js | Dessins du tableau de Lewis : aimants d'atomes, doublets liants et non liants, réserve, bouton texte. |
| contenu/ressources/laboratoires/commun/tableau_lewis.js | Tableau magnétique de Lewis : poser des atomes, des liaisons simples, doubles, triples, des doublets non liants. |
| contenu/ressources/laboratoires/commun/molecule_3d.js | Géométrie d'un modèle moléculaire par répulsion des doublets (180°, 120°, 109,5°, 107°, 104,5°). |
| contenu/ressources/laboratoires/commun/modele_dessin.js | Rendu 3D des boules et bâtonnets (profondeur, perspective, trous libres). |
| contenu/ressources/laboratoires/commun/modele_atelier.js | Atelier d'assemblage : accrocher, tourner, liaison double, démonter ; bilan de géométrie. |
| contenu/ressources/laboratoires/commun/boite_modeles.js | Boîte de modèles moléculaires (casiers C, H, O, N) reliée à l'atelier. |
| contenu/ressources/laboratoires/sources/tc_chim5_a1_lewis/ | Ions stables (duet, octet), représentation de Lewis, formules et isomères. |
| contenu/ressources/laboratoires/sources/tc_chim5_a2_cram/ | Modèles moléculaires en 3D, géométrie des molécules, représentation de Cram du méthane. |
| contenu/ressources/laboratoires/commun/tableau_cartes.js | Tableau magnétique quadrillé et cartes aimantées à ranger (classification des éléments). |
| contenu/ressources/laboratoires/commun/lewis_verif.js | Vérifications des missions sur les molécules : ions, molécule de Lewis, isomères. |
| contenu/ressources/laboratoires/sources/tc_chim6_a1_familles/ | Méthode de Mendeleïev (cartes, documents), alcalins dans l'eau, halogénures et ions argent. |
| contenu/ressources/laboratoires/sources/tc_chim6_a2_tableau/ | Tableau périodique à remplir, liaisons et ions selon la colonne, formules de Lewis. |
| contenu/ressources/laboratoires/commun/pesee_poudre.js | Pesée d'une poudre : pots et spatules, coupelles de pesée, poudre qui coule de la spatule sur la balance. |
| contenu/ressources/laboratoires/commun/coupelle_versement.js | Verser la poudre d'une coupelle dans un récipient ou un entonnoir ; rinçage de la coupelle à la pissette. |
| contenu/ressources/laboratoires/commun/pipette_graduee.js | Pipette graduée de 10 mL et pipeteur à molette : aspirer, lire, délivrer un volume. |
| contenu/ressources/laboratoires/commun/dissolution.js | Dissolution des solides moléculaires (saccharose, glucose, diiode) : vitesse, agitation, solubilité selon le solvant, cristaux. |
| contenu/ressources/laboratoires/commun/agitateur.js | Agitateur en verre : remuer un liquide (agitation, ballottement). |
| contenu/ressources/laboratoires/commun/pissette.js | Pissette d'eau distillée : tenue, bec vers le bas, jet tant qu'on appuie. |
| contenu/ressources/laboratoires/commun/fiole_accessoires.js | Entonnoir à solide et bouchon d'une fiole jaugée. |
| contenu/ressources/laboratoires/commun/fiole_jaugee.js | Fiole jaugée avec accessoires, loupe sur le trait de jauge, suivi de l'homogénéisation. |
| contenu/ressources/laboratoires/sources/tc_chim7_a1_mole/ | Masses molaires au tableur, pesée de 0,010 mol de solides, éthanol à la pipette graduée, volume molaire. |
| contenu/ressources/laboratoires/sources/tc_chim7_a2_solutions/ | Dissolution (saccharose, diiode, éthanol), solution de glucose en fiole jaugée, dilution d'une eau iodée. |
| contenu/ressources/laboratoires/commun/ions_metaux.js | Métaux et ions en solution (Cu + Ag⁺, Fe + Cu²⁺), précipités à la soude (Cu(OH)₂, Fe(OH)₂, Ag₂O). |
| contenu/ressources/laboratoires/commun/metal_tube.js | Fil de cuivre et clou en fer à plonger dans un tube ; dépôts d'argent et de cuivre dessinés. |
| contenu/ressources/laboratoires/commun/flacon_gaz.js | Flacon de dioxygène ou de dichlore à plaque de verre : gaz restant, produits, fumée, dépôts. |
| contenu/ressources/laboratoires/commun/cuillere_combustion.js | Têt à combustion et réactifs (soufre, laine de fer, sodium) : chauffage, combustion selon le gaz. |
| contenu/ressources/laboratoires/commun/equation_regles.js | Composition d'une formule, écriture, bilan des éléments et des charges, vérification d'une équation. |
| contenu/ressources/laboratoires/commun/tableau_equation.js | Tableau magnétique : aimants des espèces, cases réactifs et produits, coefficients, bilan en direct. |
| contenu/ressources/laboratoires/commun/degagement_gaz.js | Acide éthanoïque et hydrogénocarbonate de sodium : réactif limitant, effervescence. |
| contenu/ressources/laboratoires/commun/recueil_gaz.js | Cuve à eau et éprouvette à gaz graduée : volume de gaz recueilli, bulles. |
| contenu/ressources/laboratoires/sources/tc_chim8_a1_transformations/ | Métaux et ions, précipitation, combustions (soufre, fer, sodium), écriture et ajustement des équations. |
| contenu/ressources/laboratoires/sources/tc_chim8_a2_avancement/ | Vinaigre et hydrogénocarbonate : volume de CO₂, avancement maximal, tableau d'avancement. |
| contenu/ressources/laboratoires/commun/bouton_reglage.js | Bouton rotatif d'un appareil avec afficheur et touches + et − (alimentation, stroboscope). |
| contenu/ressources/laboratoires/commun/rapporteur.js | Rapporteur 360° à poser sur la feuille d'enregistrement, avec fil de visée, centré sur l'axe. |
| contenu/ressources/laboratoires/sources/b1_meca1_a1_rotation/ | Grande roue et chronophotographie : rotation et translation circulaire ; tri de mouvements du vécu. |
| contenu/ressources/laboratoires/sources/b1_meca1_a2_enregistrement/ | Solide pivotant sur la table à coussin d'air : θ, s = R·θ, ω, v = R·ω. |
| contenu/ressources/laboratoires/sources/b1_meca1_a3_uniforme/ | Disque et moteur, stroboscope, capteur à fourche : f, T, ω = 2πf, v = R·ω. |
| contenu/ressources/laboratoires/commun/dynamometre_traction.js | Dynamomètre tenu par son anneau et tiré dans n'importe quelle direction (cordelette, tige, corps gradué). |
| contenu/ressources/laboratoires/sources/b1_meca2_a1_translation/ | Pavé tiré (W = F·AB·cos α), tri moteur/résistant/nul, plan incliné et niveau laser (travail du poids). |
| contenu/ressources/laboratoires/sources/b1_meca2_a1_rotation/ | Poulie à deux gorges (W = M·Δθ), treuil électrique : couple moteur, puissance P = W/Δt = M·ω. |
| contenu/ressources/laboratoires/commun/chute_dessin.js | Dessin de l'appareil de chute libre : potence, électroaimant, règle, cellules, chronomètre à deux voies. |
| contenu/ressources/laboratoires/commun/chute_libre.js | Chute libre d'une bille lâchée par un électroaimant ; durées d'occultation de deux cellules déplaçables. |
| contenu/ressources/laboratoires/sources/b1_meca3_a1_cinetique/ | Banc à coussin d'air et curseur à frottement (d ∝ m·v²) ; volant d'inertie freiné (n ∝ J·ω²). |
| contenu/ressources/laboratoires/sources/b1_meca3_a2_theoreme/ | Table à coussin d'air inclinée : ΔEc = W(P), théorème de l'énergie cinétique. |
| contenu/ressources/laboratoires/sources/b1_meca3_a3_potentielle/ | Chute libre : ΔEc = −Δ(m·g·z), énergie potentielle de pesanteur, état de référence. |
| contenu/ressources/laboratoires/sources/b1_meca3_a4_mecanique/ | Chute libre (Em constante) ; rail incliné à débit d'air faible : ΔEm = −Q. |
| contenu/ressources/laboratoires/sources/b1_meca4_a1_energie_interne/ | Tube à grenaille (ΔU = m·c·ΔT), effets du travail, seringue à gaz : W = p·(V1 − V2), ΔU = W + Q. |
| contenu/ressources/laboratoires/commun/vase_modele.js | Modèle thermique d'un vase : liquides versés, solide plongé, glace qui fond, chauffage, équilibre (Σ Q = 0). |
| contenu/ressources/laboratoires/commun/vase_dessin.js | Calorimètre ou gobelet et son contenu, barrette, sonde et afficheur du thermomètre, agitateur. |
| contenu/ressources/laboratoires/commun/becher_verseur.js | Bécher de liquide de masse et température connues, que l'on vide dans un vase. |
| contenu/ressources/laboratoires/sources/b1_meca5_a1_parametres/ | Gobelet et thermoplongeur de 100 W : Q = P·t, Q = m·c·Δθ (eau, huile). |
| contenu/ressources/laboratoires/sources/b1_meca5_a2_calorimetrie/ | Calorimètre : capacité thermique, chaleur massique d'un métal, chaleur latente de fusion de la glace. |
| contenu/ressources/laboratoires/sources/b1_meca5_a3_rayonnement/ | Lampe et plaques noire et brillante (rayonnement) ; modes de transfert thermique. |
| contenu/ressources/laboratoires/sources/b1_elec1_a1_electrisation/ | Pendule électrostatique, électroscope à feuilles d'or, support isolant (baguettes de tc_elec1_a1 réutilisées). |
| contenu/ressources/laboratoires/sources/b1_elec1_a2_champ/ | Balance de Coulomb (F = k·qA·qB/d²) ; semoule dans l'huile de ricin : lignes de champ. |
| contenu/ressources/laboratoires/sources/b1_elec1_a3_potentiel/ | Cuve rhéographique : V(x), E = U/d, équipotentielles, W = q·(VA − VB), Epe. |
| contenu/ressources/laboratoires/commun/moteur_treuil.js | Moteur à courant continu en treuil (f.c.é.m. k·ω, r' = 25 Ω) qui monte 200 g ; cellules et chronomètre de montée (40 cm). |
| contenu/ressources/laboratoires/sources/b1_elec2_a1_transferts/ | Lampe, moteur à treuil, électrolyseur sur un générateur ; tri des appareils selon l'énergie utile. |
| contenu/ressources/laboratoires/sources/b1_elec2_a2_puissance/ | Moteur à treuil, ampèremètre, voltmètre : W = U·I·Δt, P = U·I, W_u, Q, rendement à trois tensions. |
| contenu/ressources/laboratoires/sources/b1_elec2_a3_joule/ | Résistance chauffante dans un calorimètre : Q = R·I²·Δt ; tri effet Joule utile ou nuisible. |
| contenu/ressources/laboratoires/sources/b1_elec2_a4_generateur/ | Deux piles, deux résistances : E·I = U·I + r·I², rendement U/E, I = E/(R + r), piles en série. |
| contenu/ressources/laboratoires/commun/champ_magnetique.js | Champ B par superposition : champ terrestre, pôles d'aimants, segments de courant (Biot et Savart) ; barreau, aimant en U, fil, spire, bobine. |
| contenu/ressources/laboratoires/commun/plan_magnetique.js | Feuille ou plaque vue un peu d'en haut : passage plan ↔ écran, dessin, rose des vents. |
| contenu/ressources/laboratoires/commun/aimant_dessin.js | Barreau aimanté sur la feuille (entier ou cassé) et ses sources de champ. |
| contenu/ressources/laboratoires/commun/boussole.js | Boussole que l'on fait glisser ; aiguille amortie orientée par le champ horizontal. |
| contenu/ressources/laboratoires/commun/limaille.js | Limaille de fer qui dessine les lignes de champ quand on tapote la feuille. |
| contenu/ressources/laboratoires/commun/teslametre.js | Teslamètre à sonde de Hall : composante horizontale ou verticale, touche zéro, sonde déplaçable. |
| contenu/ressources/laboratoires/commun/generateur_courant.js | Générateur de courant réglable : intensité, interrupteur, inverseur, deux bornes. |
| contenu/ressources/laboratoires/sources/b1_elec3_a1_champ/ | Barreau aimanté (boussole, limaille, teslamètre), aimant brisé, superposition, champ terrestre, Œrsted. |
| contenu/ressources/laboratoires/sources/b1_elec3_a2_courants/ | Champ d'un fil rectiligne, d'une spire, d'une bobine ; B ∝ I, B = 2×10⁻⁷·I/d, μ0·N·I/2R, μ0·n·I. |
| contenu/ressources/laboratoires/sources/b1_elec3_a3_laplace/ | Rails et balance de Laplace, courants parallèles, faisceau d'électrons, haut-parleur, moteur, induction. |
| contenu/ressources/laboratoires/commun/rayon_lumineux.js | Rayon de lumière : ligne brisée avec halo et flèches du sens de propagation. |
| contenu/ressources/laboratoires/commun/optique_materiel.js | Pied et noix, lampe sur douille, module laser, écran de carton percé (en volume). |
| contenu/ressources/laboratoires/commun/objets_scene.js | Lampe d'architecte, livre à plat, élève assis de profil. |
| contenu/ressources/laboratoires/sources/b1_opt1_a1_vision/ | Laser dans la fumée, conditions de vision, écrans percés, sources et objets diffusants, illusions. |
| contenu/ressources/laboratoires/sources/b1_opt1_a2_lois/ | Disque optique gradué : réflexion (r = i, retour inverse), réfraction (n = 1,50, angle limite). |
| contenu/ressources/laboratoires/sources/b1_opt1_a3_lentilles/ | Tableau magnétique, boîte à rayons, lentilles profil (tracé exact), foyer, f' ; loupes. |
| contenu/ressources/laboratoires/commun/banc_optique.js | Banc d'optique gradué sur pieds, cavaliers, lanterne avec l'objet « F » (taille réglable), lentille dans sa bague, oculaire, écran quadrillé. |
| contenu/ressources/laboratoires/commun/image_banc.js | Conjugaison, grandissement, image nette ou floue sur l'écran, faisceau visible du banc. |
| contenu/ressources/laboratoires/sources/b1_opt2_a1_miroir/ | Deux bougies et vitre (bougie.js, poste_bougies.js), champ de vision d'un miroir vu de dessus (poste_champ.js). |
| contenu/ressources/laboratoires/sources/b1_opt2_a2_lentille/ | Banc : foyer, f', vergence, diaphragme, images (poste_focale.js) ; planche à dessin et rayons particuliers (construction_rayons.js, poste_construction.js). |
| contenu/ressources/laboratoires/sources/b1_opt2_a3_conjugaison/ | Banc et vue rapprochée de l'écran : conjugaison, grandissement (poste_conjugaison.js) ; loupe, ce que voit l'œil (vue_loupe.js, poste_observation_loupe.js). |
| contenu/ressources/laboratoires/commun/instrument_optique.js | Images successives par plusieurs lentilles, grossissement vu par l'œil, marche de rayons, vue « ce que voit l'œil ». |
| contenu/ressources/laboratoires/sources/b1_opt3_a1_lunette/ | Documents et tri (documents_lunette.js) ; maquette de lunette au banc, Lune, cercle oculaire, faisceau (lunette_banc.js, poste_lunette.js). |
| contenu/ressources/laboratoires/sources/b1_opt3_a2_microscope/ | Microscope en volume (microscope_dessin.js), lames et vue dans l'oculaire (lames.js), documents, gestes (poste_microscope.js) ; modèle au banc (poste_modele_microscope.js). |
| contenu/ressources/laboratoires/sources/b1_chim1_a1_mesure/ | Documents et tri des mesures par domaine (documents_mesure.js) ; bandelettes « nitrates » (poste_bandelettes.js) ; échelle de teintes du colorant E131 (poste_echelle_teintes.js). |
| contenu/ressources/laboratoires/commun/capteurs_numeriques.js | Pressiomètre numérique (embout, écran en hPa) et thermomètre électronique (sonde, écran en °C). |
| contenu/ressources/laboratoires/sources/b1_chim2_a1_gaz/ | Seringue et robinet à trois voies (seringue_gaz.js), loi de Boyle-Mariotte (poste_boyle.js), ballon dans un bain thermostaté (poste_temperature.js). |
| contenu/ressources/laboratoires/sources/b1_chim2_a2_electrolytes/ | Filet d'eau dévié et cristal ionique (poste_polarite.js), solution de sulfate de cuivre (poste_preparation.js), tests de précipitation (poste_tests_ions.js), migration des ions (poste_migration.js). |
| contenu/ressources/laboratoires/sources/b1_chim2_a3_gaz_produit/ | Magnésium et acide chlorhydrique en erlenmeyer bouché relié au pressiomètre (poste_pression_gaz.js). |
| contenu/ressources/laboratoires/commun/conductimetrie.js | Conductivités molaires ioniques, solutions, σ = Σ λ·[X] (corrigée), G = σ·S/L. |
| contenu/ressources/laboratoires/commun/cellule_conductance.js | Cellule à plaques parallèles (L réglable) et son bornier (composant du circuit, conductance G), béchers de 100 mL, support élévateur (S). |
| contenu/ressources/laboratoires/commun/poste_conductance.js | Paillasse de conductance : GBF, deux multimètres, cellule ; vérification du montage câblé par l'élève, mesures U et I lues ; étape « montage et calibres ». |
| contenu/ressources/laboratoires/sources/b1_chim3_a1_conductance/ | Ions indispensables, G = I/U, facteurs L, S, C, conductivité (simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim3_a2_etalonnage/ | Courbe d'étalonnage au chlorure de sodium, sérum physiologique, limite (simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim3_a3_ion_commun/ | Six solutions à 5 mmol/L, conductivités molaires ioniques (simulation.js). |
| contenu/ressources/laboratoires/commun/reactions_totales.js | Réactions totales entre espèces dissoutes (avancement jusqu'au réactif limitant), en mmol ; équations observées. |
| contenu/ressources/laboratoires/commun/acide_base.js | Solutions acides et basiques, réactions de transfert de protons, pH calculé à partir des espèces, BBT et hélianthine. |
| contenu/ressources/laboratoires/commun/oxydoreduction.js | Solutions et réactions d'oxydoréduction (permanganate, fer II, diiode, thiosulfate, Javel, vitamine C), teintes du permanganate, du diiode et de l'amidon. |
| contenu/ressources/laboratoires/commun/burette.js | Burette de 25 mL aux vraies dimensions : graduations, robinet (goutte à goutte, filet), écoulement réel, loupe du ménisque. |
| contenu/ressources/laboratoires/commun/agitateur_magnetique.js | Agitateur magnétique : plateau (support), bouton de vitesse, barreau aimanté vu à travers le verre. |
| contenu/ressources/laboratoires/commun/conductimetre.js | Conductimètre à sonde plongeante : σ = Σ λi·[Xi], temps de réponse selon l'agitation ; sonde dessinée derrière la paroi du bécher. |
| contenu/ressources/laboratoires/commun/poste_titrage.js | Paillasse de titrage (1 px/mm) : burette, agitateur, bécher à titrer, récipients et flacons, conductimètre facultatif ; réactions continues. |
| contenu/ressources/laboratoires/sources/b1_chim4_a1_protons/ | Indicateurs colorés et produits courants ; vinaigre + soude, ammoniaque + acide : transfert de protons (postes_protons.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim4_a2_electrons/ | Fer + ions cuivre II, Javel + iodure, diiode + vitamine C : transfert d'électrons (postes_electrons.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim4_a3_conductimetrique/ | Titrage conductimétrique d'un déboucheur par l'acide chlorhydrique (simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim4_a4_colorimetrique/ | Titrages des ions fer II par le permanganate et du diiode par le thiosulfate (postes_colorimetrie.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim5_a1_organique/ | Documents de la chimie organique, combustion d'une bougie (C et H), modèles de l'éthane, de l'éthène et de l'éthyne (documents_organique.js, poste_bougie.js, simulation.js). |
| contenu/ressources/laboratoires/commun/chimie_organique.js | Espèces organiques (densité, Téb, miscibilité), réactifs des tests (2,4-DNPH, permanganate acidifié), oxydation ménagée de l'éthanol, ébullition au bain-marie. |
| contenu/ressources/laboratoires/commun/nomenclature.js | Nom officiel d'un modèle d'alcane ou d'alcène (chaîne principale, ramifications, indices) et isomérie Z/E lue sur sa géométrie. |
| contenu/ressources/laboratoires/sources/b1_chim6_a1_squelette/ | Solubilité et densité, températures d'ébullition au bain-marie (postes_squelette.js), tests des groupes caractéristiques (poste_groupes.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim6_a2_modeles/ | Isomères de constitution, noms officiels et isomérie Z/E aux modèles ; documents pétrochimie et polymères (documents_petrochimie.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b1_chim6_a3_benzoique/ | Synthèse de l'acide benzoïque : espèces et réactions (especes_benzoique.js), reflux, filtrations, précipitation (postes_benzoique.js), pesée (poste_pesee_benzoique.js), missions (missions_benzoique.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b2_intro_a1_physicien/ | Article d'une physicienne, questions rangées par partie du programme, démarche sur le problème du satellite GPS (documents_physicien.js, simulation.js). |
| contenu/ressources/laboratoires/commun/milieu_1d.js | Milieu à une dimension : élongations calculées pas à pas (pas dx/v : propagation exacte, sans déformation) ; extrémité fixe, libre ou absorbante. |
| contenu/ressources/laboratoires/commun/detecteurs_onde.js | Règle, deux cellules photoélectriques déplaçables et chronomètre électronique START/STOP : retard d'une perturbation entre A et B. |
| contenu/ressources/laboratoires/commun/ressort_long.js | Long ressort de 2 m tenu par une poignée : ondes transversale et longitudinale, spire rouge. |
| contenu/ressources/laboratoires/commun/corde_tendue.js | Corde de 2 m tendue sur une poulie par des masses (T = M·g), trois cordes de masses linéiques différentes, v = √(T/μ) ; coup sec réglable, ralenti × 20, chronophotographie. |
| contenu/ressources/laboratoires/commun/micro_claquoir.js | Claquoir, règle de 1 m et deux microphones déplaçables reliés à l'oscilloscope à mémoire : retard d'un son. |
| contenu/ressources/laboratoires/commun/oscilloscope_memoire.js | Oscilloscope numérique à mémoire, deux voies, monocoup déclenché par la voie 1 ; sensibilités et balayage réglables. |
| contenu/ressources/laboratoires/sources/b2_ondes1_a1_exemples/ | Cuve à vague et bouchon (cuve_vague.js), ressort et documents son/séismes avec tableau de tri (postes_exemples.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b2_ondes1_a2_retard/ | Retard le long du ressort (cellules, chronomètre) et retard d'un son (micros, oscilloscope) ; thermomètre mural (postes_retard.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b2_ondes1_a3_milieu/ | Corde tendue (tension, masse linéique), documents sur le son selon le milieu (postes_milieu.js, simulation.js). |
| contenu/ressources/laboratoires/commun/corde_vibreur.js | Corde, vibreur et GBF, coton absorbant ; lumière ordinaire (bande floue) ou stroboscope (images des éclairs, immobile si f = n·fe) ; règle et curseurs pour λ. |
| contenu/ressources/laboratoires/commun/banc_haut_parleur.js | Haut-parleur et GBF sinusoïdal, deux micros sur une règle de 1 m, oscilloscope à deux voies : points en phase, λ. |
| contenu/ressources/laboratoires/commun/cuve_ondes.js | Cuve à ondes : onde plane, fente ou obstacle de largeur réglable, image calculée (Huygens) dans un canvas, dispersion de la surface de l'eau, curseurs. |
| contenu/ressources/laboratoires/commun/banc_ultrasons.js | Banc de diffraction des ultrasons : émetteur 40 kHz, fente de 10 à 40 mm, récepteur sur bras tournant, rapporteur, amplitude reçue. |
| contenu/ressources/laboratoires/sources/b2_ondes2_a1_sinusoidale/ | Corde au stroboscope, son reçu par deux micros (postes_sinusoidale.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b2_ondes2_a2_diffraction/ | Cuve à ondes, ultrasons, documents et tri sur la diffraction (postes_diffraction.js, simulation.js). |
| contenu/ressources/laboratoires/commun/banc_diffraction.js | Banc de diffraction de la lumière : lasers rouge et vert, lumière blanche, fentes, fils, cheveu, écran mobile, figure calculée vue de face, curseurs. |
| contenu/ressources/laboratoires/commun/goniometre_prisme.js | Goniomètre à prisme (A = 60°, flint) : incidence, lunette, lois de Descartes, déviation, spectre de la lumière blanche ; Labo.indice_flint. |
| contenu/ressources/laboratoires/sources/b2_ondes3_a1_diffraction/ | Diffraction par une fente et un fil, θ = λ / a, lumière blanche, cheveu (simulation.js). |
| contenu/ressources/laboratoires/sources/b2_ondes3_a2_prisme/ | Déviation par un prisme, minimum de déviation, indice pour deux couleurs, spectre (simulation.js). |
| contenu/ressources/laboratoires/commun/reseau_lumiere.js | Physique de la fente et du réseau : objets (fentes, réseaux, CD, DVD), ordres sin θk − sin i = kλ/a, éclat, image de l'écran (taches ou spectres) dans un canvas. |
| contenu/ressources/laboratoires/commun/ecran_reseau.js | Écran de 70 cm vu de face (salle obscure), règle en mm, deux curseurs qui affichent leur position. |
| contenu/ressources/laboratoires/commun/banc_reseau.js | Banc à réseau vu de dessus : source, diapositive sur plateau tournant (incidence i), mètre-ruban, écran mobile, faisceaux diffractés. |
| contenu/ressources/laboratoires/sources/b2_ondes4_a1_reseau/ | Modèles de réseau au microscope (poste_modeles.js), fente et réseau au laser, sin θk = kλ/a, pas d'un CD, nombre de maximums (simulation.js). |
| contenu/ressources/laboratoires/sources/b2_ondes4_a2_incidence/ | Réseau en incidence non normale, spectres de la lumière blanche, λ d'un laser vert (simulation.js). |
| contenu/ressources/laboratoires/commun/compteur_geiger.js | Compteur d'impulsions (durée, série, horloge × 20, relevé au mur, prise du tube) ; comptages aléatoires (loi de Poisson). |
| contenu/ressources/laboratoires/commun/banc_comptage.js | Banc de comptage : tube de Geiger-Müller sur potence, plateau, écrans (papier, aluminium, plomb), coffret de sources et d'échantillons naturels. |
| contenu/ressources/laboratoires/sources/b2_nucl1_a1_becquerel/ | Expérience de Becquerel (poste_becquerel.js, documents_becquerel.js), diagramme (N, Z) des noyaux légers (tableau_nz.js) et de tous les noyaux (affiche_nz.js), équations (simulation.js). |
| contenu/ressources/laboratoires/sources/b2_nucl1_a2_datation/ | Documents et tri des radioéléments (poste_environnement.js), compteur à scintillation et datation au carbone 14 (poste_datation.js, simulation.js). |
| contenu/ressources/laboratoires/sources/b2_nucl1_a3_compteur/ | Générateur Cs 137 / Ba 137m (generateur_baryum.js) ; aléatoire, rayonnements α β γ, décroissance (simulation.js). |
| contenu/ressources/laboratoires/sources/b2_nucl2_a1_energie/ | Masses des noyaux et énergie de liaison (masses_noyaux.js), balance des noyaux (balance_noyaux.js), affiche des masses (affiche_masses.js), documents et tri des applications (poste_applications.js), missions (simulation.js). |
| contenu/ressources/laboratoires/commun/poste_coussin_air.js | Paillasse complète du chapitre « Le mouvement » : table, éclateur, feuille, outils. |
| contenu/ressources/laboratoires/commun/demarrage.js | Démarre une simulation à partir de sa définition (paillasses, missions, place du carnet et de la tablette). |
| contenu/ressources/laboratoires/commun/labo.css, tablette.css, carnet.css | Style de la scène, de la tablette et du carnet (police Caveat dans commun/polices/). |
| contenu/ressources/laboratoires/sources/<nom>/ | page.html, un fichier par appareil, simulation.js (missions). |
| outils/assembler_laboratoire.py | Intègre styles, scripts et polices dans un seul fichier HTML par simulation. |
| serveur/tests/test_assembler_laboratoire.py | Vérifie que chaque simulation assemblée n'appelle aucun fichier externe. |
