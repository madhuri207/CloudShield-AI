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