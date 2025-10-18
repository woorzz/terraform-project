const statusEl = document.getElementById("status");

async function loadExample() {
    try {
        const res = await fetch("/api/v1/example");
        if (!res.ok) throw new Error(`API HTTP ${res.status}`);
        const data = await res.json();
        statusEl.textContent = `Back dit: "${data.message}" (id=${data.id ?? "?"})`;
    } catch (e) {
        statusEl.textContent = `Erreur d'appel API: ${e.message}`;
    }
}

loadExample();
