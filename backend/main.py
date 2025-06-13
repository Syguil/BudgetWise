from fastapi import FastAPI
from backend.routes import router
import uvicorn

app = FastAPI(title="BudgetWise API")

# Enregistre les routes (endpoints)
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

from backend.database import Base, engine
from backend import models

models.Base.metadata.create_all(bind=engine)
