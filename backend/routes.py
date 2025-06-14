from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import datetime
import json

from backend import models
from backend.database import SessionLocal

router = APIRouter()

# Dependency pour gérer la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TransactionCreate(BaseModel):
    type: str
    montant: float
    categorie: str
    date: datetime.date
    description: str = ""
    tags: List[str] = []

@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    db_transactions = db.query(models.Transaction).all()
    return [
        {
            "id": t.id,
            "type": t.type,
            "montant": t.montant,
            "categorie": t.categorie,
            "date": str(t.date),
            "description": t.description,
            "tags": json.loads(t.tags or "[]")
        }
        for t in db_transactions
    ]
@router.get("/")
def accueil():
    return {"message": "Bienvenue sur BudgetWise API"}


@router.post("/transactions")
def add_transaction(t: TransactionCreate, db: Session = Depends(get_db)):
    t_db = models.Transaction(
        type=t.type,
        montant=t.montant,
        categorie=t.categorie,
        date=t.date,
        description=t.description,
        tags=json.dumps(t.tags)
    )
    db.add(t_db)
    db.commit()
    db.refresh(t_db)
    return {"message": "Transaction enregistrée", "id": t_db.id}

from fastapi import HTTPException

@router.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: int, t: TransactionCreate, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction introuvable")

    transaction.type = t.type
    transaction.montant = t.montant
    transaction.categorie = t.categorie
    transaction.date = t.date
    transaction.description = t.description
    transaction.tags = json.dumps(t.tags)

    db.commit()
    return {"message": "Transaction mise à jour avec succès ✅"}

@router.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction introuvable")

    db.delete(transaction)
    db.commit()
    return {"message": "Transaction supprimée 🗑️"}

