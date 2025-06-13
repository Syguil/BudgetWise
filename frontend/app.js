const API_URL = "http://localhost:8000";

async function fetchTransactions() {
  const res = await fetch(`${API_URL}/transactions`);
  const data = await res.json();

  const list = document.getElementById("transactions-list");
  list.innerHTML = "";
  data.forEach(t => {
    const item = document.createElement("li");
    item.textContent = `${t.date} - ${t.type.toUpperCase()} : ${t.montant}€ (${t.categorie})`;
    list.appendChild(item);
  });

  updateChart(data);
}

document.getElementById("transaction-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const montant = parseFloat(document.getElementById("montant").value);
  const type = document.getElementById("type").value;
  const categorie = document.getElementById("categorie").value;
  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;

  const transaction = {
    id: Date.now(),
    type,
    montant,
    categorie,
    date,
    description,
    tags: []
  };

  await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction)
  });

  e.target.reset();
  fetchTransactions();
});

fetchTransactions();

let chart; // Référence globale au graphique

function updateChart(transactions) {
  const depenses = transactions.filter(t => t.type === "depense");
  const parCategorie = {};

  depenses.forEach(t => {
    parCategorie[t.categorie] = (parCategorie[t.categorie] || 0) + t.montant;
  });

  const labels = Object.keys(parCategorie);
  const data = Object.values(parCategorie);

  const config = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Dépenses par catégorie (€)',
        data,
      }]
    }
  };

  if (chart) chart.destroy(); // Supprimer ancien graphe
  chart = new Chart(document.getElementById("chart-categories"), config);
}


