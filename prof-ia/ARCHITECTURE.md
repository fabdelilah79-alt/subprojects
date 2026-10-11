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
| contenu/manifeste.json | Une fiche par ressource (documents, animation, enregistrement). |
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
| serveur/agents/commun.py | Contexte stable partagé par les agents (règles, cours, manifeste, partition modèle) et appel d'un agent. |
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

Les fichiers `__init__.py` signalent à Python qu'un dossier contient du code ; ils sont vides.
Les dossiers encore vides contiennent un fichier `.gitkeep`, pour que git les garde.

## Réglages

### config/application.json

| Réglage | Rôle | Valeur de départ |
|---|---|---|
| mode | « fige » : parties validées, aucun appel à l'IA. « adaptatif » : parties générées pour chaque élève. | fige, pour qu'aucun appel payant ne parte par erreur |
| serveur.hote | Adresse du serveur. 127.0.0.1 = accessible depuis cet ordinateur seulement. | 127.0.0.1 |
| serveur.port | Numéro de port : l'adresse devient http://127.0.0.1:8000. | 8000 |
| cours | Cours proposés à l'accueil : un identifiant, le titre affiché et le nombre de parties. | rotation d'un solide autour d'un axe fixe, 3 parties |
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
