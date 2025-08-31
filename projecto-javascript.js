// --- Recompensas por bloque (cada 10 minutos)
const rewardsPer10min = {
  RLT: 1.3125,
  BTC: 0.00000413,
  LTC: 0.00242,
  BNB: 0.00061,
  POL: 2.16918,
};

// --- Poder de red actual por moneda
const networkPowers = {
  RLT: 158.372e18, // Power en H/s
  BTC: 172.55e18,
  LTC: 27.67e18,
  BNB: 43.354e18,
  POL: 79.857e18,
};

// --- Conversión de unidades de poder del jugador
const unitMap = {
  "Gh/s": 1e9,
  "Th/s": 1e12,
  "Ph/s": 1e15,
  "Eh/s": 1e18,
  "Zh/s": 1e21,
};

// Convierte el poder ingresado a H/s
function convertToHs(value, unit) {
  return value * unitMap[unit];
}

// Calcula ganancias en TODAS las monedas
function calculateEarnings(myPowerValue, myPowerUnit) {
  const myPowerHs = convertToHs(myPowerValue, myPowerUnit);
  const earnings = {};

  for (const coin in rewardsPer10min) {
    const reward = rewardsPer10min[coin];
    const netPower = networkPowers[coin]; // Poder de red específico
    const userShare = myPowerHs / netPower; // Proporción del jugador

    const earn10min = userShare * reward;
    const earn24h = earn10min * 6 * 24;
    const earn30d = earn24h * 30;

    earnings[coin] = {
      every10: earn10min,
      every24: earn24h,
      every30: earn30d,
    };
  }
  return earnings;
}

// Muestra resultados en tabla
function displayResults(earnings) {
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = "";

  for (const coin in earnings) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${coin}</td>
      <td>${earnings[coin].every10.toFixed(8)}</td>
      <td>${earnings[coin].every24.toFixed(8)}</td>
      <td>${earnings[coin].every30.toFixed(8)}</td>
    `;
    tableBody.appendChild(row);
  }
}

// Guarda datos en LocalStorage
function saveToStorage(powerValue, powerUnit) {
  localStorage.setItem("lastPowerValue", powerValue);
  localStorage.setItem("lastPowerUnit", powerUnit);
}

// Carga datos previos
function loadFromStorage() {
  const savedValue = localStorage.getItem("lastPowerValue");
  const savedUnit = localStorage.getItem("lastPowerUnit");
  if (savedValue && savedUnit) {
    document.getElementById("powerValue").value = savedValue;
    document.getElementById("powerUnit").value = savedUnit;
  }
}

// Evento botón Calcular
document.getElementById("calculateBtn").addEventListener("click", () => {
  const powerValue = parseFloat(document.getElementById("powerValue").value);
  const powerUnit = document.getElementById("powerUnit").value;

  if (isNaN(powerValue) || powerValue <= 0) {
    alert("Por favor, ingresa un poder válido.");
    return;
  }

  const results = calculateEarnings(powerValue, powerUnit);
  displayResults(results);
  saveToStorage(powerValue, powerUnit);
});

// Inicialización
loadFromStorage();
