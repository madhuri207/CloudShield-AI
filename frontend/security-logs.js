// ======================================================
// CloudShield AI - Security Logs Page
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

        const response = await fetch(
            `${API_BASE_URL}/health`
        );

        if (!response.ok) {
            throw new Error("Backend health check failed");
        }

        const data = await response.json();

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

    if (normalizedRisk === "low") {
        return "risk-badge-low";
    }

    if (normalizedRisk === "medium") {
        return "risk-badge-medium";
    }

    if (normalizedRisk === "high") {
        return "risk-badge-high";
    }

    if (normalizedRisk === "critical") {
        return "risk-badge-critical";
    }

    return "risk-badge-low";

}


// ======================================================
// RISK TEXT STYLE
// ======================================================

function applyRiskStyle(element, risk) {

    if (!element) {
        return;
    }

    element.classList.remove(
        "risk-low",
        "risk-medium",
        "risk-high",
        "risk-critical"
    );

    const normalizedRisk =
        String(risk).toLowerCase();

    if (normalizedRisk === "low") {

        element.classList.add("risk-low");

    }

    else if (normalizedRisk === "medium") {

        element.classList.add("risk-medium");

    }

    else if (normalizedRisk === "high") {

        element.classList.add("risk-high");

    }

    else if (normalizedRisk === "critical") {

        element.classList.add("risk-critical");

    }

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
// LOAD SECURITY LOGS
// ======================================================

async function loadSecurityLogs() {

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
        // SECURITY ANALYSIS
        // ==================================================

        const analysis =
            data.security_analysis;

        const summary =
            analysis.risk_summary;


        // ==================================================
        // UPDATE COUNTS
        // ==================================================

        document
            .getElementById("critical-count")
            .textContent =
            summary.critical;


        document
            .getElementById("high-count")
            .textContent =
            summary.high;


        document
            .getElementById("medium-count")
            .textContent =
            summary.medium;


        document
            .getElementById("low-count")
            .textContent =
            summary.low;


        // ==================================================
        // TOTAL LOGS
        // ==================================================

        document
            .getElementById("total-logs")
            .textContent =
            data.total_logs;


        // ==================================================
        // OVERALL SECURITY RISK
        // ==================================================

        const overallRisk =
            analysis.overall_risk;

        const overallRiskElement =
            document.getElementById(
                "overall-risk"
            );

        overallRiskElement.textContent =
            overallRisk;

        applyRiskStyle(
            overallRiskElement,
            overallRisk
        );


        // ==================================================
        // SECURITY LOG TABLE
        // ==================================================

        const table =
            document.getElementById(
                "security-log-table"
            );

        table.innerHTML = "";


        const logs =
            data.security_logs;


        if (logs.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No security logs available.
                    </td>
                </tr>
            `;

            return;

        }


        // ==================================================
        // DISPLAY LATEST 20 LOGS
        // ==================================================

        logs
            .slice(0, 20)
            .forEach(log => {

                const row =
                    document.createElement("tr");


                const badgeClass =
                    getRiskBadgeClass(
                        log.risk
                    );


                row.innerHTML = `

                    <td>
                        ${log.id}
                    </td>

                    <td>
                        ${formatTime(log.time)}
                    </td>

                    <td>
                        ${log.event_type}
                    </td>

                    <td>

                        <span
                            class="risk-badge ${badgeClass}"
                        >
                            ${log.risk}
                        </span>

                    </td>

                    <td>
                        ${log.message}
                    </td>

                `;


                table.appendChild(row);

            });

    }


    catch (error) {

        console.error(
            "Error loading security logs:",
            error
        );


        const table =
            document.getElementById(
                "security-log-table"
            );


        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load security logs.
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

        loadSecurityLogs();

    }
);


// ======================================================
// AUTOMATIC REFRESH
// ======================================================

setInterval(
    loadSecurityLogs,
    30000
);

setInterval(
    checkBackendHealth,
    30000
);