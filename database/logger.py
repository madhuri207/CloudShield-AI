import sqlite3


DB_NAME = "cloudshield.db"


def initialize_database():
    conn = sqlite3.connect(DB_NAME)

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            cpu_percent REAL,
            memory_percent REAL,
            disk_percent REAL
        )
    """)

    conn.commit()
    conn.close()


def save_metrics(metrics):
    conn = sqlite3.connect(DB_NAME)

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO metrics (
            timestamp,
            cpu_percent,
            memory_percent,
            disk_percent
        )
        VALUES (?, ?, ?, ?)
    """, (
        metrics["timestamp"],
        metrics["cpu_percent"],
        metrics["memory_percent"],
        metrics["disk_percent"]
    ))

    conn.commit()
    conn.close()