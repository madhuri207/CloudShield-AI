from fastapi import FastAPI

from monitoring.system_monitor import get_system_metrics

from database.logs import (
    save_metrics,
    save_security_event,
    create_database,
    get_security_logs
)

from ai.anomaly_detector import detect_anomaly

from security.threat_detector import analyze_security_event


app = FastAPI(
    title="CloudShield AI",
    description="Intelligent Cloud Security Monitoring Platform",
    version="1.0.0"
)


# Create database when application starts
create_database()


@app.get("/")
def root():
    return {
        "project": "CloudShield AI",
        "status": "running",
        "message": "Cloud security monitoring platform is online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CloudShield AI backend"
    }


@app.get("/monitoring")
def monitoring():

    # Collect system metrics
    metrics = get_system_metrics()

    cpu = metrics["cpu_percent"]
    memory = metrics["memory_percent"]
    disk = metrics["disk_percent"]

    # Threshold alert
    if cpu > 80 or memory > 80 or disk > 80:
        alert = "HIGH"
    else:
        alert = "NORMAL"

    # AI anomaly detection
    ai_result = detect_anomaly(cpu, memory, disk)

    # Save metrics into database
    save_metrics(
        metrics["timestamp"],
        cpu,
        memory,
        disk,
        alert
    )

    return {
        "status": "success",
        "metrics": metrics,
        "alert": alert,
        "ai_result": ai_result
    }


@app.get("/security-test")
def security_test(
    event_type: str = "failed_login",
    failed_attempts: int = 0
):

    # Analyze security event
    security_result = analyze_security_event(
        event_type=event_type,
        failed_attempts=failed_attempts
    )

    # Save security event into database
    save_security_event(
        security_result["timestamp"],
        security_result["event_type"],
        security_result["risk"],
        security_result["message"]
    )

    return {
        "status": "success",
        "security_analysis": security_result
    }


@app.get("/security-logs")
def security_logs():

    # Get saved security events
    logs = get_security_logs()

    return {
        "status": "success",
        "total_logs": len(logs),
        "security_logs": logs
    }