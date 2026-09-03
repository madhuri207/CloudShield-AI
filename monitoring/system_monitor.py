import psutil
from datetime import datetime


def get_system_metrics():
    """
    Collect basic system monitoring metrics.
    """

    metrics = {
        "timestamp": datetime.now().isoformat(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage("/").percent,
    }

    return metrics


if __name__ == "__main__":
    data = get_system_metrics()

    print("CloudShield AI - System Monitoring")
    print("-----------------------------------")
    print(f"Timestamp       : {data['timestamp']}")
    print(f"CPU Usage       : {data['cpu_percent']}%")
    print(f"Memory Usage    : {data['memory_percent']}%")
    print(f"Disk Usage      : {data['disk_percent']}%")
    