import os
import joblib
import numpy as np


MODEL_PATH = "ai/isolation_forest_model.pkl"


# Load trained Isolation Forest model
model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)


def detect_anomaly(cpu, memory, disk):

    # Make sure values are in the format expected by the model
    data = np.array([[cpu, memory, disk]])

    # If model is not available
    if model is None:
        return {
            "anomaly": False,
            "risk": "LOW",
            "message": "ML model is not available"
        }

    # Isolation Forest prediction
    prediction = model.predict(data)

    # Anomaly score
    score = model.decision_function(data)[0]

    # -1 means anomaly
    if prediction[0] == -1:

        return {
            "anomaly": True,
            "risk": "HIGH",
            "message": "ML model detected abnormal system behaviour",
            "anomaly_score": round(float(score), 4)
        }

    # 1 means normal
    return {
        "anomaly": False,
        "risk": "LOW",
        "message": "ML model detected normal system behaviour",
        "anomaly_score": round(float(score), 4)
    }