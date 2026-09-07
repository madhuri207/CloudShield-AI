from datetime import datetime


def analyze_security_event(event_type, failed_attempts=0):
    """
    Analyze a basic security event and assign a risk level.
    """

    event_type = event_type.lower()

    risk = "LOW"
    message = "No significant security threat detected."

    # Multiple failed login attempts
    if event_type == "failed_login":
        if failed_attempts >= 10:
            risk = "CRITICAL"
            message = "Possible brute-force login attack detected."

        elif failed_attempts >= 5:
            risk = "HIGH"
            message = "Multiple failed login attempts detected."

        elif failed_attempts >= 3:
            risk = "MEDIUM"
            message = "Repeated failed login attempts detected."

    # Suspicious process
    elif event_type == "suspicious_process":
        risk = "HIGH"
        message = "Suspicious process activity detected."

    # Unauthorized access
    elif event_type == "unauthorized_access":
        risk = "HIGH"
        message = "Possible unauthorized access detected."

    # Unknown event
    else:
        risk = "LOW"
        message = "Security event recorded for analysis."

    return {
        "timestamp": datetime.now().isoformat(),
        "event_type": event_type,
        "risk": risk,
        "message": message
    }


if __name__ == "__main__":

    result = analyze_security_event(
        event_type="failed_login",
        failed_attempts=6
    )

    print("CloudShield AI - Security Analysis")
    print("----------------------------------")
    print(f"Event Type : {result['event_type']}")
    print(f"Risk       : {result['risk']}")
    print(f"Message    : {result['message']}")