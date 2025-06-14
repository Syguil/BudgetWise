const API_URL = "http://localhost:8000";

let transactionsCache = [];
let budget = 0;
let chart, chartMensuel, chartType;
let editingId = null;

function setBudget() {
  const val = parseFloat(document.getElementById("budget").value);
  if (!isNaN(val)) {
    budget = val;
    updateSolde();
  }
}

function updateSolde() {
  let total = budget;
  transactionsCache.forEach(t => {
    if (t.type === "depense") total -= t.montant;
    else if (t.type === "revenu") total += t.montant;
  });

  document.getElementById("solde").textContent =
    `💰 Solde disponible : ${total.toFixed(2)} €`;
}

function updateChart(transactions) {
  const depenses = transactions.filter(t => t.type === "depense");
  const parCategorie = {};

  depenses.forEach(t => {
    parCategorie[t.categorie] = (parCategorie[t.categorie] || 0) + t.montant;
  });

  const labelsCat = Object.keys(parCategorie);
  const dataCat = Object.values(parCategorie);

  if (chart) chart.destroy();
  chart = new Chart(document.getElementById("chart-categories"), {
    type: 'doughnut',
    data: { labels: labelsCat, datasets: [{ data: dataCat }] }
  });

  const parMois = {};
  depenses.forEach(t => {
    const mois = t.date.slice(0, 7);
    parMois[mois] = (parMois[mois] || 0) + t.montant;
  });

  const moisLabels = Object.keys(parMois);
  const moisData = Object.values(parMois);

  if (chartMensuel) chartMensuel.destroy();
  chartMensuel = new Chart(document.getElementById("chart-mensuel"), {
    type: 'bar',
    data: { labels: moisLabels, datasets: [{ label: "Dépenses mensuelles (€)", data: moisData }] }
  });

  const totalTypes = { revenu: 0, depense: 0 };
  transactions.forEach(t => {
    totalTypes[t.type] += t.montant;
  });

  if (chartType) chartType.destroy();
  chartType = new Chart(document.getElementById("chart-type"), {
    type: 'pie',
    data: {
      labels: ["Revenus", "Dépenses"],
      datasets: [{
        data: [totalTypes.revenu, totalTypes.depense],
        backgroundColor: ["#4ade80", "#f87171"]
      }]
    }
  });
}

async function fetchTransactions() {
  try {
    const res = await fetch(`${API_URL}/transactions`);
    const data = await res.json();

    const list = document.getElementById("transactions-list");
    list.innerHTML = "";

    data.forEach(t => {
      const tagLabels = t.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ");
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${t.date}</strong> - ${t.type.toUpperCase()} : ${t.montant}€ (${t.categorie})<br>
        <small>${t.description || ""}</small><br>
        ${tagLabels}<br>
        <button onclick="editTransaction(${t.id})">📝 Modifier</button>
        <button onclick="deleteTransaction(${t.id})">🗑 Supprimer</button>
      `;
      list.appendChild(item);
    });

    transactionsCache = data;
    updateSolde();
    updateChart(data);
  } catch (err) {
    console.error("Erreur lors du fetch :", err);
  }
}

async function deleteTransaction(id) {
  if (!confirm("Confirmer la suppression ?")) return;

  try {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Suppression échouée");
    fetchTransactions();
  } catch (err) {
    console.error("Erreur de suppression :", err);
  }
}

function editTransaction(id) {
  const t = transactionsCache.find(x => x.id === id);
  if (!t) return;

  document.getElementById("montant").value = t.montant;
  document.getElementById("type").value = t.type;
  document.getElementById("categorie").value = t.categorie;
  document.getElementById("date").value = t.date;
  document.getElementById("description").value = t.description;
  document.getElementById("tags").value = (t.tags || []).join(", ");
  editingId = id;

  document.querySelector("#transaction-form button").textContent = "Mettre à jour";
}

document.getElementById("transaction-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const montant = parseFloat(document.getElementById("montant").value);
    const type = document.getElementById("type").value;
    const categorie = document.getElementById("categorie").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const tags = document.getElementById("tags").value
      .split(",").map(t => t.trim()).filter(t => t);

    const transaction = { type, montant, categorie, date, description, tags };

    const url = editingId
      ? `${API_URL}/transactions/${editingId}`
      : `${API_URL}/transactions`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction)
    });

    if (!res.ok) throw new Error("Échec de la requête");

    e.target.reset();
    editingId = null;
    document.querySelector("#transaction-form button").textContent = "Ajouter";
    fetchTransactions();
  } catch (err) {
    console.error("Erreur d'ajout ou modification :", err);
  }
});

fetchTransactions();
