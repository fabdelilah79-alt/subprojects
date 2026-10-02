"""
Rôle : démarrer le serveur web et brancher les routes.
Reçoit : l'adresse, le port et les chemins de config/application.json.
Produit : l'application web, qui sert les pages de client/ et les routes /api.
Utilisé par : la commande « python -m serveur.main » et les tests.
"""
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from serveur.configuration import chemin_projet, lire_config
from serveur.routes import eleve


def creer_application():
    """Crée l'application : d'abord les routes /api, puis les pages du client."""
    application = FastAPI(title="Professeur IA")
    application.include_router(eleve.routeur)
    pages = StaticFiles(directory=chemin_projet("client"), html=True)
    application.mount("/", pages, name="client")
    return application


app = creer_application()


def lancer():
    """Lance le serveur à l'adresse et au port fixés dans config/application.json."""
    reglages = lire_config("application")["serveur"]
    uvicorn.run(app, host=reglages["hote"], port=reglages["port"])


if __name__ == "__main__":
    lancer()
