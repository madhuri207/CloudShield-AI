const API_BASE_URL = "http://127.0.0.1:8000";


document.addEventListener("DOMContentLoaded", () => {

    loadReport();

    setInterval(loadReport, 30000);

    checkBackendHealth();

    setInterval(checkBackendHealth, 30000);

});


/* =========================================================
   BACKEND HEALTH
========================================================= */

async function checkBackendHealth() {

    const statusBox = document.querySelector(".system-status");

    if (!statusBox) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/health`
        );

        if (!response.ok) {
            throw new Error("Backend unavailable");
        }

        statusBox.innerHTML = `
            <span class="status-dot"></span>
            System Online
        `;

    } catch (error) {

        statusBox.innerHTML = `
            <span
                class="status-dot"
                style="background:#dc2626;"
            ></span>
            System Offline
        `;

    }

}


/* =========================================================
   LOAD SECURITY REPORT
========================================================= */

async function loadReport() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/security-overview`
        );

        if (!response.ok) {
            throw new Error("Unable to load security overview");
        }

        const data = await response.json();

        updateReport(data);

    } catch (error) {

        console.error(
            "CloudShield Reports Error:",
            error
        );

        showReportError();

    }

}


/* =========================================================
   UPDATE REPORT DATA
========================================================= */

function updateReport(data) {

    const security = data.security;

    const summary = security.risk_summary;

    /* -----------------------------------------
       TOP CARDS
    ----------------------------------------- */

    const totalLogs = document.getElementById(
        "total-logs"
    );

    const criticalEvents = document.getElementById(
        "critical-events"
    );

    const highEvents = document.getElementById(
        "high-events"
    );

    const overallRisk = document.getElementById(
        "overall-risk"
    );


    if (totalLogs) {
        totalLogs.textContent =
            security.total_logs;
    }


    if (criticalEvents) {
        criticalEvents.textContent =
            summary.critical;
    }


    if (highEvents) {
        highEvents.textContent =
            summary.high;
    }


    if (overallRisk) {

        overallRisk.textContent =
            security.overall_risk;

        overallRisk.className =
            "card-value " +
            getRiskClass(
                security.overall_risk
            );

    }


    /* -----------------------------------------
       RISK DISTRIBUTION
    ----------------------------------------- */

    setValue(
        "critical-risk",
        summary.critical
    );

    setValue(
        "high-risk",
        summary.high
    );

    setValue(
        "medium-risk",
        summary.medium
    );

    setValue(
        "low-risk",
        summary.low
    );


    /* -----------------------------------------
       EVENT SUMMARY
    ----------------------------------------- */

    updateEventSummary(
        security.event_summary
    );

}


/* =========================================================
   SET VALUE
========================================================= */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


/* =========================================================
   EVENT SUMMARY TABLE
========================================================= */

function updateEventSummary(eventSummary) {

    const table =
        document.getElementById(
            "event-summary-table"
        );

    if (!table) {
        return;
    }


    table.innerHTML = "";


    const events =
        Object.entries(eventSummary);


    if (events.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="2">
                    No security events found.
                </td>
            </tr>
        `;

        return;
    }


    events.forEach(
        ([eventType, count]) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td>
                    ${formatEventType(eventType)}
                </td>

                <td>
                    ${count}
                </td>
            `;


            table.appendChild(row);

        }
    );

}


/* =========================================================
   FORMAT EVENT TYPE
========================================================= */

function formatEventType(eventType) {

    return eventType
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );

}


/* =========================================================
   RISK CLASS
========================================================= */

function getRiskClass(risk) {

    switch (risk.toUpperCase()) {

        case "CRITICAL":
            return "risk-critical";

        case "HIGH":
            return "risk-high";

        case "MEDIUM":
            return "risk-medium";

        case "LOW":
            return "risk-low";

        default:
            return "";

    }

}


/* =========================================================
   ERROR DISPLAY
========================================================= */

function showReportError() {

    const ids = [
        "total-logs",
        "critical-events",
        "high-events"
    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = "Error";
        }

    });


    const overallRisk =
        document.getElementById(
            "overall-risk"
        );


    if (overallRisk) {
        overallRisk.textContent = "ERROR";
    }


    const table =
        document.getElementById(
            "event-summary-table"
        );


    if (table) {

        table.innerHTML = `
            <tr>
                <td colspan="2">
                    Unable to connect to CloudShield AI backend.
                </td>
            </tr>
        `;

    }

}