def detect_anomaly(cpu, memory, disk):

    # Simple AI-based anomaly detection
    if cpu > 90 or memory > 90 or disk > 90:
        return {
            "anomaly": True,
            "risk": "HIGH",
            "message": "Abnormal system resource usage detected"
        }

    elif cpu > 75 or memory > 75 or disk > 75:
        return {
            "anomaly": True,
            "risk": "MEDIUM",
            "message": "Unusual system resource usage detected"
        }

    else:
        return {
            "anomaly": False,
            "risk": "LOW",
            "message": "System behaviour is normal"
        }