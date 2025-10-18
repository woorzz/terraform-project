const statusEl = document.getElementById("status");

function now() {
  return new Date().toLocaleString();
}

statusEl.textContent = `Module chargé à ${now()}`;
const badge = document.createElement("span");
badge.className = "badge";
badge.textContent = "Vanilla + Express ";
statusEl.after(badge);
