import sqlite3

def init_db():
    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            payload TEXT,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def insert_event(name: str, payload: dict, timestamp: str):
    conn = sqlite3.connect("events.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO events (name, payload, timestamp) VALUES (?, ?, ?)",
        (name, str(payload), timestamp)
    )
    conn.commit()
    conn.close()
