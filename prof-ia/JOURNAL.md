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
