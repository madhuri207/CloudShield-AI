from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from monitoring.system_monitor import get_system_metrics

from database.logs import (
    save_metrics,
    save_security_event,
    create_database,
    get_security_logs,
    save_alert,
    get_alerts,
    update_alert_status
)

from ai.anomaly_detector import detect_anomaly

from security.threat_detector import analyze_security_event

from security.log_analyzer import (
    analyze_security_logs,
    analyze_log
)

from security.risk_engine import calculate_overall_risk

from security.alert_manager import generate_alert


app = FastAPI(
    title="CloudShield AI",
    description="Intelligent Cloud Security Monitoring Platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


create_database()


class SecurityEvent(BaseModel):
    event_type: str
    failed_attempts: int = 0


class SecurityLog(BaseModel):
    log_message: str


class AlertStatusUpdate(BaseModel):
    status: str


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

    metrics = get_system_metrics()

    cpu = metrics["cpu_percent"]
    memory = metrics["memory_percent"]
    disk = metrics["disk_percent"]

    if cpu > 80 or memory > 80 or disk > 80:
        alert = "HIGH"
    else:
        alert = "NORMAL"

    ai_result = detect_anomaly(
        cpu,
        memory,
        disk
    )

    save_metrics(
        metrics["timestamp"],
        cpu,
        memory,
        disk,
        alert
    )

    ai_alert = None

    if ai_result.get("anomaly") is True:

        ai_alert = generate_alert(
            alert_type="AI_ANOMALY",
            risk=ai_result.get("risk", "HIGH"),
            message="Abnormal system activity detected by AI anomaly detection",
            source="AI Monitoring"
        )

        if ai_alert:
            save_alert(ai_alert)

    return {
        "status": "success",
        "metrics": metrics,
        "alert": alert,
        "ai_result": ai_result,
        "ai_alert": ai_alert
    }


@app.get("/security-test")
def security_test(
    event_type: str = "failed_login",
    failed_attempts: int = 0
):

    security_result = analyze_security_event(
        event_type=event_type,
        failed_attempts=failed_attempts
    )

    save_security_event(
        security_result["timestamp"],
        security_result["event_type"],
        security_result["risk"],
        security_result["message"]
    )

    security_alert = generate_alert(
        alert_type=security_result["event_type"],
        risk=security_result["risk"],
        message=security_result["message"],
        source="Security Monitoring"
    )

    if security_alert:
        save_alert(security_alert)

    return {
        "status": "success",
        "security_analysis": security_result,
        "security_alert": security_alert
    }


@app.post("/security-events")
def create_security_event(event: SecurityEvent):

    security_result = analyze_security_event(
        event_type=event.event_type,
        failed_attempts=event.failed_attempts
    )

    save_security_event(
        security_result["timestamp"],
        security_result["event_type"],
        security_result["risk"],
        security_result["message"]
    )

    security_alert = generate_alert(
        alert_type=security_result["event_type"],
        risk=security_result["risk"],
        message=security_result["message"],
        source="Security Monitoring"
    )

    if security_alert:
        save_alert(security_alert)

    return {
        "status": "success",
        "message": "Security event processed successfully",
        "security_analysis": security_result,
        "security_alert": security_alert
    }


@app.get("/security-logs")
def security_logs():

    logs = get_security_logs()

    analysis = analyze_security_logs(logs)

    return {
        "status": "success",
        "total_logs": len(logs),
        "security_analysis": analysis,
        "security_logs": logs
    }


@app.get("/alerts")
def alerts():

    alert_list = get_alerts()

    return {
        "status": "success",
        "total_alerts": len(alert_list),
        "alerts": alert_list
    }


@app.put("/alerts/{alert_id}/status")
def change_alert_status(
    alert_id: int,
    alert_update: AlertStatusUpdate
):

    status = alert_update.status.upper()

    if status not in [
        "NEW",
        "ACKNOWLEDGED",
        "RESOLVED"
    ]:
        return {
            "status": "error",
            "message": "Invalid alert status"
        }

    updated = update_alert_status(
        alert_id,
        status
    )

    if not updated:
        return {
            "status": "error",
            "message": "Alert not found"
        }

    return {
        "status": "success",
        "message": "Alert status updated successfully",
        "alert_id": alert_id,
        "new_status": status
    }


@app.get("/security-overview")
def security_overview():

    metrics = get_system_metrics()

    cpu = metrics["cpu_percent"]
    memory = metrics["memory_percent"]
    disk = metrics["disk_percent"]

    system_result = detect_anomaly(
        cpu,
        memory,
        disk
    )

    logs = get_security_logs()

    security_result = analyze_security_logs(logs)

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


@app.post("/analyze-log")
def analyze_security_log(log: SecurityLog):

    result = analyze_log(
        log.log_message
    )

    save_security_event(
        result["timestamp"],
        result["event_type"],
        result["risk"],
        result["message"]
    )

    security_alert = generate_alert(
        alert_type=result["event_type"],
        risk=result["risk"],
        message=result["message"],
        source="Log Analysis"
    )

    if security_alert:
        save_alert(security_alert)

    return {
        "status": "success",
        "message": "Security log analyzed and saved successfully",
        "analysis": result,
        "security_alert": security_alert
    }