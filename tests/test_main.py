from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_accueil():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bienvenue sur BudgetWise API"}

def test_post_transaction():
    data = {
        "type": "revenu",
        "montant": 1500.0,
        "categorie": "Salaire",
        "date": "2025-06-14",
        "description": "Revenu mensuel",
        "tags": ["récurrent"]
    }
    response = client.post("/transactions", json=data)
    assert response.status_code == 200
    json_data = response.json()
    assert "id" in json_data
    assert json_data["message"] == "Transaction enregistrée"

def test_get_transactions():
    response = client.get("/transactions")
    assert response.status_code == 200
    transactions = response.json()
    assert isinstance(transactions, list)
    assert all("id" in t for t in transactions)
