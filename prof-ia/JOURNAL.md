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
