from fastapi import FastAPI
from pydantic import BaseModel

from monitoring.system_monitor import get_system_metrics

from database.logs import (
    save_metrics,
    save_security_event,
    create_database,
    get_security_logs
)

from ai.anomaly_detector import detect_anomaly

from security.threat_detector import analyze_security_event

from security.log_analyzer import (
    analyze_security_logs,
    analyze_log
)

from security.risk_engine import calculate_overall_risk


app = FastAPI(
    title="CloudShield AI",
    description="Intelligent Cloud Security Monitoring Platform",
    version="1.0.0"
)


# Create database when application starts
create_database()


# Security event input model
class SecurityEvent(BaseModel):
    event_type: str
    failed_attempts: int = 0


# Security log input model
class SecurityLog(BaseModel):
    log_message: str


# ---------------------------------------------------------
# ROOT ENDPOINT
# ---------------------------------------------------------

@app.get("/")
def root():

    return {
        "project": "CloudShield AI",
        "status": "running",
        "message": "Cloud security monitoring platform is online"
    }


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "CloudShield AI backend"
    }


# ---------------------------------------------------------
# SYSTEM MONITORING
# ---------------------------------------------------------

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
    ai_result = detect_anomaly(
        cpu,
        memory,
        disk
    )

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


# ---------------------------------------------------------
# SECURITY TEST
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# SECURITY EVENT API
# ---------------------------------------------------------

@app.post("/security-events")
def create_security_event(event: SecurityEvent):

    # Analyze received security event
    security_result = analyze_security_event(
        event_type=event.event_type,
        failed_attempts=event.failed_attempts
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
        "message": "Security event processed successfully",
        "security_analysis": security_result
    }


# ---------------------------------------------------------
# SECURITY LOGS
# ---------------------------------------------------------

@app.get("/security-logs")
def security_logs():

    # Get saved security events
    logs = get_security_logs()

    # Analyze all security logs
    analysis = analyze_security_logs(logs)

    return {
        "status": "success",
        "total_logs": len(logs),
        "security_analysis": analysis,
        "security_logs": logs
    }


# ---------------------------------------------------------
# SECURITY OVERVIEW
# ---------------------------------------------------------

@app.get("/security-overview")
def security_overview():

    # Collect current system metrics
    metrics = get_system_metrics()

    cpu = metrics["cpu_percent"]
    memory = metrics["memory_percent"]
    disk = metrics["disk_percent"]

    # Analyze current system behaviour
    system_result = detect_anomaly(
        cpu,
        memory,
        disk
    )

    # Get security history
    logs = get_security_logs()

    # Analyze security history
    security_result = analyze_security_logs(logs)

    # Calculate combined overall risk
    overall_result = calculate_overall_risk(
        system_result,
        security_result
    )

    return {
        "status": "success",

        "system": {
            "metrics": metrics,
            "analysis": system_result
        },

        "security": security_result,

        "overall_risk": overall_result
    }


# ---------------------------------------------------------
# RAW SECURITY LOG ANALYSIS
# ---------------------------------------------------------

@app.post("/analyze-log")
def analyze_security_log(log: SecurityLog):

    # Analyze the submitted security log
    result = analyze_log(
        log.log_message
    )

    # Save analyzed security event into database
    save_security_event(
        result["timestamp"],
        result["event_type"],
        result["risk"],
        result["message"]
    )

    return {
        "status": "success",
        "message": "Security log analyzed and saved successfully",
        "analysis": result
    }