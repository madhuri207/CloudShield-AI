def analyze_security_logs(logs):
    """
    Analyze stored security logs and generate a security summary.
    """

    total_logs = len(logs)

    critical_count = 0
    high_count = 0
    medium_count = 0
    low_count = 0

    failed_login_count = 0
    suspicious_process_count = 0
    unauthorized_access_count = 0

    for log in logs:

        risk = log.get("risk", "").upper()
        event_type = log.get("event_type", "").lower()

        # Count risk levels
        if risk == "CRITICAL":
            critical_count += 1

        elif risk == "HIGH":
            high_count += 1

        elif risk == "MEDIUM":
            medium_count += 1

        elif risk == "LOW":
            low_count += 1

        # Count security event types
        if event_type == "failed_login":
            failed_login_count += 1

        elif event_type == "suspicious_process":
            suspicious_process_count += 1

        elif event_type == "unauthorized_access":
            unauthorized_access_count += 1

    # Determine overall security status
    if critical_count > 0:
        overall_risk = "CRITICAL"

    elif high_count > 0:
        overall_risk = "HIGH"

    elif medium_count > 0:
        overall_risk = "MEDIUM"

    else:
        overall_risk = "LOW"

    return {
        "total_logs": total_logs,
        "overall_risk": overall_risk,
        "risk_summary": {
            "critical": critical_count,
            "high": high_count,
            "medium": medium_count,
            "low": low_count
        },
        "event_summary": {
            "failed_login": failed_login_count,
            "suspicious_process": suspicious_process_count,
            "unauthorized_access": unauthorized_access_count
        }
    }