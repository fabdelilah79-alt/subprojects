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
