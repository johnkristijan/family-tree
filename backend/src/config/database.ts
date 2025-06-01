// backend/src/config/database.ts
import sqlite3 from 'sqlite3';
import path from 'path';

// Use a file in the backend directory for the SQLite database
const DB_PATH = path.resolve(__dirname, '../../familytree.sqlite');

// Verbose mode for more detailed logs from the sqlite3 driver
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database:', DB_PATH);
    initializeDatabase();
  }
});

const initializeDatabase = () => {
  db.serialize(() => {
    console.log('Initializing database schema...');

    // Create persons table (SQLite syntax)
    db.run(`
      CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        middle_name TEXT,
        birth_date TEXT, -- Store dates as TEXT in ISO8601 format (YYYY-MM-DD)
        death_date TEXT,
        gender TEXT,
        bio TEXT,
        profile_picture_url TEXT,
        created_at TEXT DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
        updated_at TEXT DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))
      )
    `, (err) => {
      if (err) console.error('Error creating persons table:', err.message);
      else console.log('Persons table created or already exists.');
    });

    // Create relationships table (SQLite syntax)
    db.run(`
      CREATE TABLE IF NOT EXISTS relationships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        person1_id INTEGER NOT NULL,
        person2_id INTEGER NOT NULL,
        relationship_type TEXT NOT NULL, -- e.g., 'parent_of', 'married_to'
        start_date TEXT,
        end_date TEXT,
        created_at TEXT DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
        updated_at TEXT DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
        FOREIGN KEY (person1_id) REFERENCES persons(id) ON DELETE CASCADE,
        FOREIGN KEY (person2_id) REFERENCES persons(id) ON DELETE CASCADE,
        CONSTRAINT check_person_order CHECK (person1_id <> person2_id),
        CONSTRAINT unique_relationship_pair UNIQUE (person1_id, person2_id, relationship_type)
      )
    `, (err) => {
      if (err) console.error('Error creating relationships table:', err.message);
      else console.log('Relationships table created or already exists.');
    });

    // Triggers for updated_at (SQLite syntax)
    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_persons_updated_at
      AFTER UPDATE ON persons
      FOR EACH ROW
      BEGIN
          UPDATE persons SET updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = OLD.id;
      END;
    `, (err) => {
      if (err) console.error('Error creating trigger for persons:', err.message);
      else console.log('Trigger for persons table updated_at created or already exists.');
    });

    db.run(`
      CREATE TRIGGER IF NOT EXISTS update_relationships_updated_at
      AFTER UPDATE ON relationships
      FOR EACH ROW
      BEGIN
          UPDATE relationships SET updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = OLD.id;
      END;
    `, (err) => {
      if (err) console.error('Error creating trigger for relationships:', err.message);
      else console.log('Trigger for relationships table updated_at created or already exists.');
    });

    console.log('Database initialization process complete.');
  });
};

// Export the database connection
export default db;
