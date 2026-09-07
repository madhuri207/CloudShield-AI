// ======================================================
// CloudShield AI - Frontend Dashboard
// ======================================================

// Backend API address
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
// CREATE MONITORING CHART
// ======================================================

function createMonitoringChart() {

    const canvas =
        document.getElementById("monitoringChart");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        console.error("Chart.js library is not loaded.");
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
// APPLY RISK STYLE
// ======================================================

function applyRiskStyle(element, risk) {

    if (!element) {
        return;
    }


    // Remove previous risk classes
    element.classList.remove(
        "risk-low",
        "risk-medium",
        "risk-high",
        "risk-critical"
    );


    const normalizedRisk =
        String(risk).toLowerCase();


    // Add correct risk class
    if (normalizedRisk === "low") {

        element.classList.add(
            "risk-low"
        );

    }

    else if (normalizedRisk === "medium") {

        element.classList.add(
            "risk-medium"
        );

    }

    else if (normalizedRisk === "high") {

        element.classList.add(
            "risk-high"
        );

    }

    else if (normalizedRisk === "critical") {

        element.classList.add(
            "risk-critical"
        );

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


        // ==================================================
        // SECURITY ANALYSIS
        // ==================================================

        const analysis =
            data.security_analysis;


        const summary =
            analysis.risk_summary;


        // ==================================================
        // SECURITY COUNTS
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
        // DISPLAY LATEST 10 LOGS
        // ==================================================

        logs
            .slice(0, 10)
            .forEach(log => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>${log.id}</td>

                    <td>
                        ${formatTime(log.time)}
                    </td>

                    <td>
                        ${log.event_type}
                    </td>

                    <td>
                        ${log.risk}
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
// LOAD COMPLETE DASHBOARD DATA
// ======================================================

async function loadDashboardData() {

    try {

        // ==================================================
        // GET SECURITY OVERVIEW
        // ==================================================

        const overviewResponse =
            await fetch(
                `${API_BASE_URL}/security-overview`
            );


        if (!overviewResponse.ok) {

            throw new Error(
                "Security overview API request failed"
            );

        }


        const overview =
            await overviewResponse.json();


        // ==================================================
        // SYSTEM METRICS
        // ==================================================

        const metrics =
            overview.system.metrics;


        const cpu =
            metrics.cpu_percent;


        const memory =
            metrics.memory_percent;


        const disk =
            metrics.disk_percent;


        // ==================================================
        // DISPLAY SYSTEM METRICS
        // ==================================================

        document
            .getElementById("cpu-value")
            .textContent =
            `${cpu.toFixed(1)}%`;


        document
            .getElementById("memory-value")
            .textContent =
            `${memory.toFixed(1)}%`;


        document
            .getElementById("disk-value")
            .textContent =
            `${disk.toFixed(1)}%`;


        // ==================================================
        // UPDATE CHART
        // ==================================================

        updateMonitoringChart(
            cpu,
            memory,
            disk
        );


        // ==================================================
        // AI RESULT
        // ==================================================

        const aiResult =
            overview.system.analysis;


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


        if (aiResult.anomaly) {

            aiStatus.textContent =
                "Anomaly Detected";

        }

        else {

            aiStatus.textContent =
                "System Normal";

        }


        aiMessage.textContent =
            aiResult.message;


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


        // Apply AI status style
        applyAIStatusStyle(
            aiStatus,
            aiResult.anomaly
        );


        // ==================================================
        // OVERALL RISK
        // ==================================================

        const overallRisk =
            overview.overall_risk.overall_risk;


        const riskElement =
            document.getElementById(
                "risk-value"
            );


        riskElement.textContent =
            overallRisk;


        // Apply risk colour
        applyRiskStyle(
            riskElement,
            overallRisk
        );


        // ==================================================
        // SECURITY COUNTS
        // ==================================================

        const security =
            overview.security;


        const summary =
            security.risk_summary;


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
        // SECURITY LOG TABLE
        // ==================================================

        await loadSecurityLogs();

    }


    catch (error) {

        console.error(
            "Error loading CloudShield dashboard:",
            error
        );


        document
            .getElementById("cpu-value")
            .textContent =
            "Error";


        document
            .getElementById("memory-value")
            .textContent =
            "Error";


        document
            .getElementById("disk-value")
            .textContent =
            "Error";


        document
            .getElementById("risk-value")
            .textContent =
            "ERROR";


        document
            .getElementById("ai-status")
            .textContent =
            "Backend unavailable";


        document
            .getElementById("ai-message")
            .textContent =
            "Unable to connect to CloudShield AI backend.";

    }

}


// ======================================================
// FORMAT TIMESTAMP
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

        loadDashboardData();

    }
);


// ======================================================
// AUTOMATIC REFRESH
// ======================================================

// Refresh dashboard every 30 seconds

setInterval(
    loadDashboardData,
    30000
);