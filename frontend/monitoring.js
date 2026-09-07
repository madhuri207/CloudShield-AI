// ======================================================
// CloudShield AI - Monitoring Page
// ======================================================

const API_BASE_URL = "http://127.0.0.1:8000";

let monitoringChart = null;

let chartLabels = [];
let cpuData = [];
let memoryData = [];
let diskData = [];


// ======================================================
// BACKEND HEALTH CHECK
// ======================================================

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

    const context = canvas.getContext("2d");

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

function updateMonitoringChart(cpu, memory, disk) {

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

function applyAIStatusStyle(element, isAnomaly) {

    if (!element) {
        return;
    }

    element.classList.remove(
        "ai-normal",
        "ai-anomaly"
    );

    if (isAnomaly) {

        element.classList.add("ai-anomaly");

    }

    else {

        element.classList.add("ai-normal");

    }

}


// ======================================================
// LOAD MONITORING DATA
// ======================================================

async function loadMonitoringData() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/security-overview`
        );

        if (!response.ok) {

            throw new Error(
                "Monitoring API request failed"
            );

        }

        const data = await response.json();


        // ==================================================
        // SYSTEM METRICS
        // ==================================================

        const metrics = data.system.metrics;

        const cpu = Number(metrics.cpu_percent);
        const memory = Number(metrics.memory_percent);
        const disk = Number(metrics.disk_percent);


        // ==================================================
        // DISPLAY CPU
        // ==================================================

        document.getElementById(
            "cpu-value"
        ).textContent =
            `${cpu.toFixed(1)}%`;


        // ==================================================
        // DISPLAY MEMORY
        // ==================================================

        document.getElementById(
            "memory-value"
        ).textContent =
            `${memory.toFixed(1)}%`;


        // ==================================================
        // DISPLAY DISK
        // ==================================================

        document.getElementById(
            "disk-value"
        ).textContent =
            `${disk.toFixed(1)}%`;


        // ==================================================
        // AI ANALYSIS
        // ==================================================

        const aiResult =
            data.system.analysis;

        const aiStatus =
            document.getElementById("ai-status");

        const aiMessage =
            document.getElementById("ai-message");

        const anomalyScore =
            document.getElementById("anomaly-score");


        if (aiResult.anomaly === true) {

            aiStatus.textContent =
                "Anomaly Detected";

        }

        else {

            aiStatus.textContent =
                "System Normal";

        }


        aiMessage.textContent =
            aiResult.message || "No AI message available.";


        if (
            aiResult.anomaly_score !== undefined &&
            aiResult.anomaly_score !== null
        ) {

            anomalyScore.textContent =
                aiResult.anomaly_score;

        }

        else {

            anomalyScore.textContent =
                "--";

        }


        applyAIStatusStyle(
            aiStatus,
            aiResult.anomaly === true
        );


        // ==================================================
        // SYSTEM RISK
        // ==================================================

        const systemRisk =
            aiResult.risk || "LOW";

        const riskElement =
            document.getElementById("risk-value");

        riskElement.textContent =
            systemRisk;

        applyRiskStyle(
            riskElement,
            systemRisk
        );


        // ==================================================
        // UPDATE CHART
        // ==================================================

        updateMonitoringChart(
            cpu,
            memory,
            disk
        );

    }

    catch (error) {

        console.error(
            "CloudShield monitoring error:",
            error
        );

        document.getElementById(
            "cpu-value"
        ).textContent = "Error";

        document.getElementById(
            "memory-value"
        ).textContent = "Error";

        document.getElementById(
            "disk-value"
        ).textContent = "Error";

        document.getElementById(
            "risk-value"
        ).textContent = "ERROR";

        document.getElementById(
            "ai-status"
        ).textContent = "Backend unavailable";

        document.getElementById(
            "ai-message"
        ).textContent =
            "Unable to connect to CloudShield AI backend.";

        document.getElementById(
            "anomaly-score"
        ).textContent = "--";

    }

}


// ======================================================
// INITIAL PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        createMonitoringChart();

        checkBackendHealth();

        loadMonitoringData();

    }
);


// ======================================================
// AUTOMATIC REFRESH
// ======================================================

setInterval(
    loadMonitoringData,
    30000
);

setInterval(
    checkBackendHealth,
    30000
);