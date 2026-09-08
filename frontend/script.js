// ======================================================
// CloudShield AI - Frontend Dashboard
// ======================================================


const API_BASE_URL = "http://127.0.0.1:8000";


// ======================================================
// MONITORING CHART DATA
// ======================================================

let monitoringChart = null;

let chartLabels = [];
let cpuData = [];
let memoryData = [];
let diskData = [];


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

        }

        else {

            statusBox.innerHTML = `
                <span
                    class="status-dot"
                    style="background:#dc2626;"
                ></span>
                System Offline
            `;

        }

    }

    catch (error) {

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
// CREATE MONITORING CHART
// ======================================================

function createMonitoringChart() {

    const canvas =
        document.getElementById("monitoringChart");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js library is not loaded."
        );

        return;
    }

    const context =
        canvas.getContext("2d");

    monitoringChart = new Chart(context, {

        type: "line",

        data: {

            labels: chartLabels,

            datasets: [

                {
                    label: "CPU %",
                    data: cpuData,
                    tension: 0.3
                },

                {
                    label: "Memory %",
                    data: memoryData,
                    tension: 0.3
                },

                {
                    label: "Disk %",
                    data: diskData,
                    tension: 0.3
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: false,

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100,

                    title: {
                        display: true,
                        text: "Usage (%)"
                    }

                },

                x: {

                    title: {
                        display: true,
                        text: "Time"
                    }

                }

            },

            plugins: {

                legend: {
                    display: true
                }

            }

        }

    });

}


// ======================================================
// UPDATE MONITORING CHART
// ======================================================

function updateMonitoringChart(
    cpu,
    memory,
    disk
) {

    if (!monitoringChart) {
        return;
    }

    const currentTime =
        new Date().toLocaleTimeString();

    chartLabels.push(currentTime);

    cpuData.push(cpu);

    memoryData.push(memory);

    diskData.push(disk);


    // Keep latest 10 readings

    if (chartLabels.length > 10) {

        chartLabels.shift();

        cpuData.shift();

        memoryData.shift();

        diskData.shift();

    }

    monitoringChart.update("none");

}


// ======================================================
// APPLY OVERALL RISK STYLE
// ======================================================

function applyRiskStyle(
    element,
    risk
) {

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
// APPLY AI STATUS STYLE
// ======================================================

function applyAIStatusStyle(
    element,
    isAnomaly
) {

    if (!element) {
        return;
    }

    element.classList.remove(
        "ai-normal",
        "ai-anomaly"
    );


    if (isAnomaly) {

        element.classList.add(
            "ai-anomaly"
        );

    }

    else {

        element.classList.add(
            "ai-normal"
        );

    }

}


// ======================================================
// APPLY SECURITY SUMMARY COLORS
// ======================================================

function applySecuritySummaryStyles() {

    const critical =
        document.getElementById(
            "critical-count"
        );

    const high =
        document.getElementById(
            "high-count"
        );

    const medium =
        document.getElementById(
            "medium-count"
        );

    const low =
        document.getElementById(
            "low-count"
        );


    if (critical) {

        critical.parentElement.classList.add(
            "critical-risk"
        );

    }


    if (high) {

        high.parentElement.classList.add(
            "high-risk"
        );

    }


    if (medium) {

        medium.parentElement.classList.add(
            "medium-risk"
        );

    }


    if (low) {

        low.parentElement.classList.add(
            "low-risk"
        );

    }

}


// ======================================================
// GET RISK BADGE CLASS
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
// LOAD SECURITY LOGS
// ======================================================

async function loadSecurityLogs() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/security-logs`
        );


        if (!response.ok) {

            throw new Error(
                "Security logs API request failed"
            );

        }


        const data =
            await response.json();


        const analysis =
            data.security_analysis;


        const summary =
            analysis.risk_summary;


        // ==================================================
        // SECURITY COUNTS
        // ==================================================

        const criticalCount =
            document.getElementById(
                "critical-count"
            );

        const highCount =
            document.getElementById(
                "high-count"
            );

        const mediumCount =
            document.getElementById(
                "medium-count"
            );

        const lowCount =
            document.getElementById(
                "low-count"
            );


        if (criticalCount) {
            criticalCount.textContent =
                summary.critical;
        }

        if (highCount) {
            highCount.textContent =
                summary.high;
        }

        if (mediumCount) {
            mediumCount.textContent =
                summary.medium;
        }

        if (lowCount) {
            lowCount.textContent =
                summary.low;
        }


        // Apply colors

        applySecuritySummaryStyles();


        // ==================================================
        // SECURITY LOG TABLE
        // ==================================================

        const table =
            document.getElementById(
                "security-log-table"
            );


        if (!table) {
            return;
        }


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
        // DISPLAY LATEST 10 LOGS
        // ==================================================

        logs
            .slice(0, 10)
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


        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        Unable to load security logs.
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// 6.8 - CREATE ALERT NOTIFICATION CONTAINER
// ======================================================

function createAlertNotificationContainer() {

    let container =
        document.getElementById(
            "alert-notification-container"
        );

    if (container) {
        return container;
    }


    container =
        document.createElement("section");

    container.id =
        "alert-notification-container";


    container.style.marginBottom =
        "20px";


    container.style.display =
        "flex";


    container.style.flexDirection =
        "column";


    container.style.gap =
        "10px";


    const mainContent =
        document.querySelector(
            ".main-content"
        );


    const activeAlertsPanel =
        document.querySelector(
            ".logs-panel"
        );


    if (mainContent && activeAlertsPanel) {

        mainContent.insertBefore(
            container,
            activeAlertsPanel
        );

    }

    else if (mainContent) {

        mainContent.appendChild(
            container
        );

    }


    return container;

}


// ======================================================
// 6.8 - CREATE ALERT NOTIFICATION CARD
// ======================================================

function createAlertNotification(alert) {

    const risk =
        String(
            alert.risk || "LOW"
        ).toUpperCase();


    let borderColor =
        "#16a34a";


    let backgroundColor =
        "#f0fdf4";


    let icon =
        "✓";


    if (risk === "MEDIUM") {

        borderColor =
            "#ca8a04";

        backgroundColor =
            "#fefce8";

        icon =
            "⚠";

    }


    else if (risk === "HIGH") {

        borderColor =
            "#ea580c";

        backgroundColor =
            "#fff7ed";

        icon =
            "⚠";

    }


    else if (risk === "CRITICAL") {

        borderColor =
            "#dc2626";

        backgroundColor =
            "#fef2f2";

        icon =
            "🔴";

    }


    const notification =
        document.createElement("div");


    notification.className =
        "cloudshield-alert-notification";


    notification.style.background =
        backgroundColor;


    notification.style.borderLeft =
        `5px solid ${borderColor}`;


    notification.style.borderRadius =
        "8px";


    notification.style.padding =
        "16px 18px";


    notification.style.boxShadow =
        "0 2px 8px rgba(0,0,0,0.08)";


    notification.style.position =
        "relative";


    notification.innerHTML = `

        <div
            style="
                display:flex;
                justify-content:space-between;
                align-items:flex-start;
                gap:15px;
            "
        >

            <div>

                <div
                    style="
                        font-size:14px;
                        font-weight:700;
                        color:${borderColor};
                        margin-bottom:6px;
                    "
                >
                    ${icon} ${risk} SECURITY ALERT
                </div>


                <div
                    style="
                        font-size:14px;
                        font-weight:600;
                        color:#111827;
                        margin-bottom:7px;
                    "
                >
                    ${alert.message}
                </div>


                <div
                    style="
                        font-size:12px;
                        color:#6b7280;
                    "
                >
                    Source: ${alert.source}
                    &nbsp; | &nbsp;
                    Status: ${alert.status}
                    &nbsp; | &nbsp;
                    ${formatTime(alert.timestamp)}
                </div>

            </div>


            <button
                type="button"
                class="close-alert-button"
                aria-label="Close alert"
                style="
                    border:none;
                    background:transparent;
                    font-size:18px;
                    cursor:pointer;
                    color:#6b7280;
                    padding:0;
                "
            >
                ×
            </button>

        </div>

    `;


    const closeButton =
        notification.querySelector(
            ".close-alert-button"
        );


    closeButton.addEventListener(
        "click",
        () => {

            notification.remove();

        }
    );


    return notification;

}


// ======================================================
// 6.8 - LOAD ALERT NOTIFICATIONS
// ======================================================

async function loadAlertNotifications() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/alerts`
            );


        if (!response.ok) {

            throw new Error(
                "Alerts API request failed"
            );

        }


        const data =
            await response.json();


        const alerts =
            data.alerts || [];


        const container =
            createAlertNotificationContainer();


        container.innerHTML = "";


        if (alerts.length === 0) {

            return;

        }


        // Show latest 3 alerts

        alerts
            .slice(0, 3)
            .forEach(alert => {

                const notification =
                    createAlertNotification(
                        alert
                    );


                container.appendChild(
                    notification
                );

            });

    }


    catch (error) {

        console.error(
            "Alert notification error:",
            error
        );

    }

}


// ======================================================
// LOAD DASHBOARD DATA
// ======================================================

async function loadDashboardData() {

    try {

        // ==================================================
        // SECURITY OVERVIEW
        // ==================================================

        const response =
            await fetch(
                `${API_BASE_URL}/security-overview`
            );


        if (!response.ok) {

            throw new Error(
                "Security overview request failed"
            );

        }


        const data =
            await response.json();


        // ==================================================
        // SYSTEM METRICS
        // ==================================================

        const metrics =
            data.system.metrics;


        const cpu =
            metrics.cpu_percent;


        const memory =
            metrics.memory_percent;


        const disk =
            metrics.disk_percent;


        // ==================================================
        // DISPLAY CPU
        // ==================================================

        const cpuElement =
            document.getElementById(
                "cpu-value"
            );

        if (cpuElement) {

            cpuElement.textContent =
                `${cpu.toFixed(1)}%`;

        }


        // ==================================================
        // DISPLAY MEMORY
        // ==================================================

        const memoryElement =
            document.getElementById(
                "memory-value"
            );

        if (memoryElement) {

            memoryElement.textContent =
                `${memory.toFixed(1)}%`;

        }


        // ==================================================
        // DISPLAY DISK
        // ==================================================

        const diskElement =
            document.getElementById(
                "disk-value"
            );

        if (diskElement) {

            diskElement.textContent =
                `${disk.toFixed(1)}%`;

        }


        // ==================================================
        // UPDATE CHART
        // ==================================================

        updateMonitoringChart(
            cpu,
            memory,
            disk
        );


        // ==================================================
        // AI ANALYSIS
        // ==================================================

        const aiResult =
            data.system.analysis;


        const aiStatus =
            document.getElementById(
                "ai-status"
            );


        const aiMessage =
            document.getElementById(
                "ai-message"
            );


        const anomalyScore =
            document.getElementById(
                "anomaly-score"
            );


        if (aiStatus) {

            if (aiResult.anomaly) {

                aiStatus.textContent =
                    "Anomaly Detected";

            }

            else {

                aiStatus.textContent =
                    "System Normal";

            }


            applyAIStatusStyle(
                aiStatus,
                aiResult.anomaly
            );

        }


        if (aiMessage) {

            aiMessage.textContent =
                aiResult.message;

        }


        if (anomalyScore) {

            if (
                aiResult.anomaly_score !== undefined
            ) {

                anomalyScore.textContent =
                    aiResult.anomaly_score;

            }

            else {

                anomalyScore.textContent =
                    "--";

            }

        }


        // ==================================================
        // OVERALL RISK
        // ==================================================

        const overallRisk =
            data.overall_risk.overall_risk;


        const riskElement =
            document.getElementById(
                "risk-value"
            );


        if (riskElement) {

            riskElement.textContent =
                overallRisk;


            applyRiskStyle(
                riskElement,
                overallRisk
            );

        }


        // ==================================================
        // SECURITY COUNTS
        // ==================================================

        const security =
            data.security;


        const summary =
            security.risk_summary;


        const criticalCount =
            document.getElementById(
                "critical-count"
            );

        const highCount =
            document.getElementById(
                "high-count"
            );

        const mediumCount =
            document.getElementById(
                "medium-count"
            );

        const lowCount =
            document.getElementById(
                "low-count"
            );


        if (criticalCount) {

            criticalCount.textContent =
                summary.critical;

        }


        if (highCount) {

            highCount.textContent =
                summary.high;

        }


        if (mediumCount) {

            mediumCount.textContent =
                summary.medium;

        }


        if (lowCount) {

            lowCount.textContent =
                summary.low;

        }


        // Apply security summary colors

        applySecuritySummaryStyles();


        // ==================================================
        // LOAD SECURITY LOG TABLE
        // ==================================================

        await loadSecurityLogs();

    }


    catch (error) {

        console.error(
            "CloudShield dashboard error:",
            error
        );


        const cpuElement =
            document.getElementById(
                "cpu-value"
            );

        const memoryElement =
            document.getElementById(
                "memory-value"
            );

        const diskElement =
            document.getElementById(
                "disk-value"
            );

        const riskElement =
            document.getElementById(
                "risk-value"
            );

        const aiStatus =
            document.getElementById(
                "ai-status"
            );

        const aiMessage =
            document.getElementById(
                "ai-message"
            );


        if (cpuElement) {
            cpuElement.textContent = "Error";
        }


        if (memoryElement) {
            memoryElement.textContent = "Error";
        }


        if (diskElement) {
            diskElement.textContent = "Error";
        }


        if (riskElement) {
            riskElement.textContent = "ERROR";
        }


        if (aiStatus) {
            aiStatus.textContent =
                "Backend unavailable";
        }


        if (aiMessage) {
            aiMessage.textContent =
                "Unable to connect to CloudShield AI backend.";
        }

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
// INITIAL DASHBOARD LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createMonitoringChart();

        checkBackendHealth();

        loadDashboardData();

        loadAlertNotifications();

    }
);


// ======================================================
// AUTOMATIC REFRESH
// ======================================================

// Dashboard data every 30 seconds

setInterval(
    loadDashboardData,
    30000
);


// Alert notifications every 30 seconds

setInterval(
    loadAlertNotifications,
    30000
);


// Backend health every 30 seconds

setInterval(
    checkBackendHealth,
    30000
);