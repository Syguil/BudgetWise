from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from backend.routes import router
from backend.database import engine
from backend import models

# Création de la base de données
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Routes API
app.include_router(router)

# Sert le dossier "frontend/" pour l’interface HTML
app.mount("/", StaticFiles(directory="frontend", html=True), name="static")
