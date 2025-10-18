// Elements
const apiStatusEl = document.getElementById("api-status");
const dbStatusEl = document.getElementById("db-status");
const apiHealthEl = document.getElementById("api-health");
const dataDisplayEl = document.getElementById("data-display");
const frontendUrlEl = document.getElementById("frontend-url");

// Get current URL
frontendUrlEl.textContent = window.location.origin;

// Check API Health
async function checkAPIHealth() {
    try {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Update API status
        if (data.ok) {
            apiStatusEl.textContent = "✓ Online";
            apiStatusEl.className = "badge badge-success";
            apiHealthEl.textContent = "Healthy";
        } else {
            apiStatusEl.textContent = "⚠ Degraded";
            apiStatusEl.className = "badge badge-warning";
            apiHealthEl.textContent = "Unhealthy";
        }

        // Update DB status based on API health response
        if (data.db === true) {
            dbStatusEl.textContent = "✓ Connected";
            dbStatusEl.className = "badge badge-success";
        } else {
            dbStatusEl.textContent = "✗ Disconnected";
            dbStatusEl.className = "badge badge-error";
        }
    } catch (e) {
        apiStatusEl.textContent = "✗ Offline";
        apiStatusEl.className = "badge badge-error";
        apiHealthEl.textContent = `Error: ${e.message}`;

        dbStatusEl.textContent = "? Unknown";
        dbStatusEl.className = "badge badge-error";
    }
}

// Load data from database
async function loadDatabaseData() {
    try {
        const res = await fetch("/api/v1/example");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // Display data in a nice format
        dataDisplayEl.innerHTML = `
            <div class="data-item">
                <div><span class="key">ID:</span> <span class="value">${data.id || "N/A"}</span></div>
            </div>
            <div class="data-item">
                <div><span class="key">Message:</span> <span class="value">"${data.message || "N/A"}"</span></div>
            </div>
            <div class="data-item">
                <div><span class="key">Source:</span> <span class="value">PostgreSQL via API Node.js</span></div>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(74, 222, 128, 0.1); border-radius: 6px; border-left: 3px solid var(--success);">
                <strong style="color: var(--success);">✓ Succès !</strong>
                <div style="margin-top: 0.5rem; color: var(--muted); font-size: 0.9rem;">
                    Les 3 couches communiquent correctement :
                    <br>Frontend (Nginx) → API (Node.js) → Database (PostgreSQL)
                </div>
            </div>
        `;
    } catch (e) {
        dataDisplayEl.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <div style="color: var(--error); font-weight: 600; margin-bottom: 0.5rem;">
                    Erreur de chargement
                </div>
                <div style="color: var(--muted); font-size: 0.9rem;">
                    ${e.message}
                </div>
            </div>
        `;
    }
}

// Initialize
async function init() {
    await checkAPIHealth();
    await loadDatabaseData();
}

// Run on page load
init();

// Auto-refresh every 30 seconds
setInterval(() => {
    checkAPIHealth();
}, 30000);
