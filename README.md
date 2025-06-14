# 💰 BudgetWise – Gestionnaire de Budget Personnel

BudgetWise est une application web permettant à un utilisateur de :
- Gérer son budget mensuel
- Suivre ses revenus et ses dépenses
- Visualiser des statistiques financières en temps réel

---

## 🚀 Liens utiles

- 🔗 **App déployée (Render)** : [BudgetWise Render](https://dashboard.render.com/web/srv-d16bak8dl3ps739732p0)
- 💻 **Code source GitHub** : [github.com/Syguil/BudgetWise](https://github.com/Syguil/BudgetWise)

---

## 📦 Fonctionnalités principales

- ✅ Définir un **budget mensuel**
- ✅ Ajouter, modifier et supprimer des **revenus et dépenses**
- ✅ Suivre le **solde disponible** en temps réel
- ✅ Voir des **graphiques dynamiques** :
  - Répartition par catégorie
  - Évolution mensuelle
  - Revenus vs dépenses
- ✅ Ajouter des **tags personnalisés** (ex : “Urgent”, “Récurrent”)
- ✅ **Filtrer par période personnalisée** (ex : du 5 avril au 12 mai)
- ✅ CI/CD avec **GitHub Actions** et tests `pytest`

---

## 🧑‍💻 Technologies utilisées

### Frontend
- HTML, CSS (responsive & moderne)
- JavaScript vanilla
- Chart.js

### Backend
- FastAPI
- SQLite
- SQLAlchemy
- Uvicorn

### DevOps
- GitHub Actions (CI)
- Render.com (déploiement automatique)

---

## 🧪 Tests

Des tests unitaires ont été écrits avec `pytest`.  
Lancement local :

```bash
pytest

Backend

cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload
Accessible sur : http://localhost:8000/docs"# CI Trigger" 
