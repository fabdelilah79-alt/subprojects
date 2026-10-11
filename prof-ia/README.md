# Professeur IA de physique-chimie

Application web : un professeur IA enseigne un cours de physique-chimie au tableau, à un élève à la fois.
Les règles du projet sont dans CLAUDE.md, la carte des fichiers dans ARCHITECTURE.md.

## Installer (une seule fois)

Il faut Python 3.11 ou plus récent. Ouvrez un terminal dans le dossier `prof-ia`.

Windows :

```
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.exemple .env
```

macOS ou Linux :

```
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.exemple .env
```

L'application fonctionne sans clé (mode figé, voix d'essai muette). Les clés s'ajoutent plus tard : voir « Ajouter les clés ».

## Lancer

À chaque nouveau terminal, réactivez d'abord l'environnement (`.venv\Scripts\activate` sous Windows, `source .venv/bin/activate` sinon), puis :

```
python -m serveur.main
```

Ouvrez http://127.0.0.1:8000 dans le navigateur : accueil, questionnaire, attente, cours au tableau, questionnaire de fin.

Pour seulement regarder une partie au tableau (avec « Beat suivant ») : http://127.0.0.1:8000/demo_tableau.html?partie=2

## Arrêter

Ctrl + C dans le terminal où tourne le serveur.

## Générer la voix des parties

```
python -m outils.generer_audio sorties/valide/partie_1.json
```

(Puis la même chose avec partie_2.json et partie_3.json.) Sans clé, la voix « essai » produit des fichiers muets
de la bonne durée : tout se synchronise, le professeur se tait.

## Ajouter les clés (plus tard)

1. Ouvrez `.env` et collez vos clés après `ANTHROPIC_API_KEY=` (agents Claude) et `GEMINI_API_KEY=` (voix).
2. Voix réelle : dans config/voix.json, mettez `"fournisseur": "gemini"`, puis régénérez la voix des trois parties
   (commande ci-dessus). Écoutez : si la voix ne convient pas, changez `gemini.voix` et recommencez.
3. Parties adaptées à chaque élève : dans config/application.json, mettez `"mode": "adaptatif"`, puis relancez le serveur.
   Pour essayer d'abord une partie depuis le terminal : `python -m outils.generer_partie 2`
   (résultat dans sorties/valide/partie_2_proposee.json, avec son coût dans partie_2_proposee_bilan.json).

Sans clé ANTHROPIC_API_KEY, le mode adaptatif sert les parties validées : le cours ne s'arrête jamais.

## Exporter les données de recherche

```
python -m outils.exporter_donnees
```

Fichiers CSV dans sorties/journaux/exports/ (aucun nom d'élève). La correspondance nom ↔ pseudonyme reste
dans sorties/prive/ : ne la partagez pas.

## Vérifier

```
python -m outils.verifier_structure
python -m pytest
```

La première commande signale les fichiers et fonctions trop longs ; la seconde lance les tests.
