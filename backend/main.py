from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import router
from backend import models
from backend.database import engine

# Crée les tables SQLite au démarrage
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Autoriser les appels du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # autorise toutes les origines (à restreindre en prod)
    allow_methods=["*"],
    allow_headers=["*"]
)

# Monter les routes
app.include_router(router)
