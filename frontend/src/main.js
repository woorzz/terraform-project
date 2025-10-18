const statusEl = document.getElementById("status");

async function getConfig() {
  const res = await fetch("/dev/config.json");
  if (!res.ok) throw new Error(`Config HTTP ${res.status}`);
  return res.json();
}

async function loadExample() {
  try {
    const { apiBaseUrl } = await getConfig();
    const res = await fetch(`${apiBaseUrl}/api/v1/example`);
    if (!res.ok) throw new Error(`API HTTP ${res.status}`);
    const data = await res.json();
    statusEl.textContent = `Back dit: "${data.message}" (id=${data.id ?? "?"})`;
  } catch (e) {
    statusEl.textContent = `Erreur d'appel API: ${e.message}`;
  }
}

loadExample();
