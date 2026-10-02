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

Ouvrez ensuite le fichier `.env` et collez vos clés d'API après les signes `=`.

## Lancer

À chaque nouveau terminal, réactivez d'abord l'environnement (`.venv\Scripts\activate` sous Windows, `source .venv/bin/activate` sinon), puis :

```
python -m serveur.main
```

Ouvrez http://127.0.0.1:8000 dans le navigateur.

## Arrêter

Ctrl + C dans le terminal où tourne le serveur.

## Générer la voix d'une partie

```
python -m outils.generer_audio sorties/valide/partie_1.json
```

Sans clé d'API, la voix « essai » produit des fichiers muets de la bonne durée : tout se synchronise, le professeur se tait.
Avec une clé, changez « fournisseur » dans config/voix.json, puis relancez la commande.

## Vérifier

```
python -m outils.verifier_structure
python -m pytest
```

La première commande signale les fichiers et fonctions trop longs ; la seconde lance les tests.
