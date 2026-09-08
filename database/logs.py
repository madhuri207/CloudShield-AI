import sqlite3
import os


DATABASE = "database/logs.db"


def create_database():

    # Make sure database folder exists
    os.makedirs("database", exist_ok=True)

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # System monitoring logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT,
            metric TEXT,
            value REAL,
            alert TEXT
        )
    """)

    # Security event logs
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT,
            event_type TEXT,
            risk TEXT,
            message TEXT
        )
    """)

    # Security alerts
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            alert_type TEXT,
            risk TEXT,
            message TEXT,
            source TEXT,
            status TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_metrics(timestamp, cpu, memory, disk, alert):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    # Save CPU
    cursor.execute("""
        INSERT INTO system_logs
        (time, metric, value, alert)
        VALUES (?, ?, ?, ?)
    """, (timestamp, "CPU", cpu, alert))

    # Save Memory
    cursor.execute("""
        INSERT INTO system_logs
        (time, metric, value, alert)
        VALUES (?, ?, ?, ?)
    """, (timestamp, "Memory", memory, alert))

    # Save Disk
    cursor.execute("""
        INSERT INTO system_logs
        (time, metric, value, alert)
        VALUES (?, ?, ?, ?)
    """, (timestamp, "Disk", disk, alert))

    conn.commit()
    conn.close()


def save_security_event(timestamp, event_type, risk, message):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO security_logs
        (time, event_type, risk, message)
        VALUES (?, ?, ?, ?)
    """, (timestamp, event_type, risk, message))

    conn.commit()
    conn.close()


def get_security_logs():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, time, event_type, risk, message
        FROM security_logs
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    logs = []

    for row in rows:

        logs.append({
            "id": row[0],
            "time": row[1],
            "event_type": row[2],
            "risk": row[3],
            "message": row[4]
        })

    return logs


def save_alert(alert):

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO alerts
        (timestamp, alert_type, risk, message, source, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        alert["timestamp"],
        alert["alert_type"],
        alert["risk"],
        alert["message"],
        alert["source"],
        alert["status"]
    ))

    conn.commit()
    conn.close()


def get_alerts():

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, timestamp, alert_type, risk, message, source, status
        FROM alerts
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    alerts = []

    for row in rows:

        alerts.append({
            "id": row[0],
            "timestamp": row[1],
            "alert_type": row[2],
            "risk": row[3],
            "message": row[4],
            "source": row[5],
            "status": row[6]
        })

    return alerts


def update_alert_status(alert_id, status):

    allowed_statuses = [
        "NEW",
        "ACKNOWLEDGED",
        "RESOLVED"
    ]

    status = status.upper()

    if status not in allowed_statuses:
        return False

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE alerts
        SET status = ?
        WHERE id = ?
    """, (status, alert_id))

    updated_rows = cursor.rowcount

    conn.commit()
    conn.close()

    return updated_rows > 0