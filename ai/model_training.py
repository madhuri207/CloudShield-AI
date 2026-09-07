import os
import joblib
import numpy as np

from sklearn.ensemble import IsolationForest


MODEL_PATH = "ai/isolation_forest_model.pkl"


def train_model():

    # Normal baseline system behaviour
    # CPU, Memory, Disk percentages
    normal_data = np.array([
        [10, 30, 40],
        [15, 35, 45],
        [20, 40, 50],
        [25, 45, 48],
        [30, 50, 55],
        [18, 32, 42],
        [22, 38, 47],
        [28, 44, 52],
        [35, 55, 58],
        [12, 28, 39],
        [17, 36, 44],
        [24, 42, 49],
        [32, 48, 54],
        [27, 46, 51],
        [19, 34, 43],
        [14, 31, 41],
        [29, 49, 53],
        [33, 52, 57],
        [21, 39, 46],
        [26, 43, 50],
        [16, 33, 45],
        [31, 47, 55],
        [23, 41, 48],
        [34, 53, 59],
        [11, 29, 38],
        [13, 30, 40],
        [20, 37, 46],
        [25, 45, 50],
        [30, 51, 56],
        [18, 35, 44]
    ])

    # Create Isolation Forest model
    model = IsolationForest(
        contamination=0.10,
        random_state=42
    )

    # Train model
    model.fit(normal_data)

    # Make sure ai directory exists
    os.makedirs("ai", exist_ok=True)

    # Save trained model
    joblib.dump(model, MODEL_PATH)

    print("CloudShield AI - ML Model Training")
    print("-----------------------------------")
    print("Algorithm : Isolation Forest")
    print("Training samples :", len(normal_data))
    print("Model saved to :", MODEL_PATH)


if __name__ == "__main__":
    train_model()