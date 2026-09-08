from datetime import datetime


def should_generate_alert(risk: str):
    """
    Decide whether an alert should be generated
    based on the risk level.
    """

    risk = risk.upper()

    if risk == "CRITICAL":
        return True

    if risk == "HIGH":
        return True

    if risk == "MEDIUM":
        return True

    return False


def generate_alert(
    alert_type: str,
    risk: str,
    message: str,
    source: str = "system"
):
    """
    Generate a standardized security alert.
    """

    risk = risk.upper()

    if risk not in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
        risk = "LOW"

    if not should_generate_alert(risk):
        return None

    alert = {
        "timestamp": datetime.now().isoformat(),
        "alert_type": alert_type,
        "risk": risk,
        "message": message,
        "source": source,
        "status": "NEW"
    }

    return alert