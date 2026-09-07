from datetime import datetime


def analyze_log(log_message):
    """
    Analyze one security log message.
    """

    original_log = log_message
    log_message = log_message.lower()

    event_type = "normal"
    risk = "LOW"
    message = "No suspicious activity detected."

    # Brute force detection
    if "multiple failed login" in log_message or "brute force" in log_message:
        event_type = "brute_force"
        risk = "CRITICAL"
        message = "Possible brute-force attack detected."

    # Failed login detection
    elif "failed login" in log_message or "login failed" in log_message:
        event_type = "failed_login"
        risk = "MEDIUM"
        message = "Failed login activity detected."

    # Unauthorized access detection
    elif "unauthorized access" in log_message or "access denied" in log_message:
        event_type = "unauthorized_access"
        risk = "HIGH"
        message = "Possible unauthorized access detected."

    # Suspicious process detection
    elif "suspicious process" in log_message or "malicious process" in log_message:
        event_type = "suspicious_process"
        risk = "HIGH"
        message = "Suspicious process activity detected."

    # Malware detection
    elif "malware" in log_message or "virus" in log_message:
        event_type = "malware"
        risk = "CRITICAL"
        message = "Possible malware activity detected."

    return {
        "timestamp": datetime.now().isoformat(),
        "event_type": event_type,
        "risk": risk,
        "message": message,
        "original_log": original_log
    }


def analyze_security_logs(logs):
    """
    Analyze all saved security logs and generate a summary.
    """

    total_logs = len(logs)

    risk_summary = {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0
    }

    event_summary = {
        "failed_login": 0,
        "suspicious_process": 0,
        "unauthorized_access": 0,
        "brute_force": 0,
        "malware": 0,
        "normal": 0
    }

    for log in logs:

        risk = log.get("risk", "LOW").lower()
        event_type = log.get("event_type", "normal")

        if risk in risk_summary:
            risk_summary[risk] += 1

        if event_type in event_summary:
            event_summary[event_type] += 1
        else:
            event_summary[event_type] = 1

    # Determine overall security risk
    if risk_summary["critical"] > 0:
        overall_risk = "CRITICAL"

    elif risk_summary["high"] > 0:
        overall_risk = "HIGH"

    elif risk_summary["medium"] > 0:
        overall_risk = "MEDIUM"

    else:
        overall_risk = "LOW"

    return {
        "total_logs": total_logs,
        "overall_risk": overall_risk,
        "risk_summary": risk_summary,
        "event_summary": event_summary
    }


if __name__ == "__main__":

    test_logs = [
        "Multiple failed login attempts detected",
        "Unauthorized access to server",
        "Suspicious process detected",
        "Normal user login successful"
    ]

    print("CloudShield AI - Security Log Analysis")
    print("---------------------------------------")

    for log in test_logs:

        result = analyze_log(log)

        print("\nLog:", log)
        print("Event Type:", result["event_type"])
        print("Risk:", result["risk"])
        print("Message:", result["message"])