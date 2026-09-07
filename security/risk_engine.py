def calculate_overall_risk(system_result, security_result):
    """
    Combine system anomaly risk and security threat risk
    to determine the overall CloudShield risk level.
    """

    system_risk = system_result.get("risk", "LOW").upper()
    security_risk = security_result.get("overall_risk", "LOW").upper()

    risk_priority = {
        "LOW": 1,
        "MEDIUM": 2,
        "HIGH": 3,
        "CRITICAL": 4
    }

    system_score = risk_priority.get(system_risk, 1)
    security_score = risk_priority.get(security_risk, 1)

    # Take the highest risk from either source
    overall_score = max(system_score, security_score)

    if overall_score == 4:
        overall_risk = "CRITICAL"

    elif overall_score == 3:
        overall_risk = "HIGH"

    elif overall_score == 2:
        overall_risk = "MEDIUM"

    else:
        overall_risk = "LOW"

    return {
        "overall_risk": overall_risk,
        "system_risk": system_risk,
        "security_risk": security_risk
    }