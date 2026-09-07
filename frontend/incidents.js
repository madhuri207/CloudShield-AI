// ======================================================
// CloudShield AI - Incidents Page
// ======================================================

const API_BASE_URL = "http://127.0.0.1:8000";


// ======================================================
// BACKEND HEALTH CHECK
// ======================================================

async function checkBackendHealth() {

    const statusBox =
        document.querySelector(".system-status");

    if (!statusBox) {
        return;
    }

    try {

        const response =
            await fetch(`${API_BASE_URL}/health`);

        if (!response.ok) {
            throw new Error("Backend health check failed");
        }

        const data =
            await response.json();

        if (data.status === "healthy") {

            statusBox.innerHTML = `
                <span
                    class="status-dot"
                    style="background:#22c55e;"
                ></span>
                System Online
            `;

        } else {

            statusBox.innerHTML = `
                <span
                    class="status-dot"
                    style="background:#dc2626;"
                ></span>
                System Offline
            `;

        }

    } catch (error) {

        console.error(
            "Backend health check error:",
            error
        );

        statusBox.innerHTML = `
            <span
                class="status-dot"
                style="background:#dc2626;"
            ></span>
            System Offline
        `;

    }

}


// ======================================================
// RISK BADGE
// ======================================================

function getRiskBadgeClass(risk) {

    const normalizedRisk =
        String(risk).toLowerCase();

    if (normalizedRisk === "critical") {
        return "risk-badge-critical";
    }

    if (normalizedRisk === "high") {
        return "risk-badge-high";
    }

    if (normalizedRisk === "medium") {
        return "risk-badge-medium";
    }

    return "risk-badge-low";

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(timestamp) {

    if (!timestamp) {
        return "--";
    }

    const date =
        new Date(timestamp);

    return date.toLocaleString();

}


// ======================================================
// LOAD INCIDENTS
// ======================================================

async function loadIncidents() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/security-logs`
            );

        if (!response.ok) {

            throw new Error(
                "Security logs API request failed"
            );

        }

        const data =
            await response.json();


        // ==================================================
        // GET SECURITY LOGS
        // ==================================================

        const logs =
            data.security_logs || [];


        // ==================================================
        // FILTER INCIDENTS
        // ==================================================

        const incidents =
            logs.filter(log => {

                const risk =
                    String(log.risk).toUpperCase();

                return (
                    risk === "HIGH" ||
                    risk === "CRITICAL"
                );

            });


        // ==================================================
        // COUNT INCIDENTS
        // ==================================================

        const criticalCount =
            incidents.filter(log =>
                String(log.risk).toUpperCase() === "CRITICAL"
            ).length;


        const highCount =
            incidents.filter(log =>
                String(log.risk).toUpperCase() === "HIGH"
            ).length;


        // ==================================================
        // UPDATE SUMMARY
        // ==================================================

        document.getElementById(
            "critical-incidents"
        ).textContent =
            criticalCount;


        document.getElementById(
            "high-incidents"
        ).textContent =
            highCount;


        document.getElementById(
            "medium-incidents"
        ).textContent =
            0;


        document.getElementById(
            "total-incidents"
        ).textContent =
            incidents.length;


        // ==================================================
        // INCIDENT TABLE
        // ==================================================

        const table =
            document.getElementById(
                "incident-table"
            );

        table.innerHTML = "";


        if (incidents.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No active security incidents.
                    </td>
                </tr>
            `;

            return;

        }


        // ==================================================
        // DISPLAY INCIDENTS
        // ==================================================

        incidents
            .slice(0, 20)
            .forEach(incident => {

                const row =
                    document.createElement("tr");


                const badgeClass =
                    getRiskBadgeClass(
                        incident.risk
                    );


                row.innerHTML = `

                    <td>
                        ${incident.id}
                    </td>

                    <td>
                        ${formatTime(incident.time)}
                    </td>

                    <td>
                        ${incident.event_type}
                    </td>

                    <td>

                        <span
                            class="risk-badge ${badgeClass}"
                        >
                            ${incident.risk}
                        </span>

                    </td>

                    <td>
                        ${incident.message}
                    </td>

                `;


                table.appendChild(row);

            });

    }

    catch (error) {

        console.error(
            "Error loading incidents:",
            error
        );


        document.getElementById(
            "incident-table"
        ).innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load security incidents.
                </td>
            </tr>
        `;

    }

}


// ======================================================
// INITIAL PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkBackendHealth();

        loadIncidents();

    }
);


// ======================================================
// AUTOMATIC REFRESH
// ======================================================

setInterval(
    loadIncidents,
    30000
);

setInterval(
    checkBackendHealth,
    30000
);