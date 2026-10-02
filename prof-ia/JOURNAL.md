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
