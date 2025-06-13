from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_accueil():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"].startswith("Bienvenue")
