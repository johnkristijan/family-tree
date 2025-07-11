// backend/src/scripts/seed.ts
import db from '../config/database'; // Adjust path as necessary
import * as fs from 'fs';
import * as path from 'path';

// Read the seed data from both JSON files
const seedFilePath1 = path.resolve(__dirname, '../family_seed.json');
const seedFilePath2 = path.resolve(__dirname, '../family_seed2.json');
let seedPersons: any[] = [];

try {
  const seedData1 = fs.readFileSync(seedFilePath1, 'utf8');
  const seedData2 = fs.readFileSync(seedFilePath2, 'utf8');
  
  const persons1 = JSON.parse(seedData1);
  const persons2 = JSON.parse(seedData2);
  
  // Filter out entries that don't have required fields (like incomplete location entries)
  const validPersons1 = persons1.filter((person: any) => 
    person.first_name && typeof person.first_name === 'string'
  );
  const validPersons2 = persons2.filter((person: any) => 
    person.first_name && typeof person.first_name === 'string'
  );
  
  // Remove id field from all persons so database can auto-generate
  const cleanPersons1 = validPersons1.map(({ id, ...person }: any) => person);
  const cleanPersons2 = validPersons2.map(({ id, ...person }: any) => person);
  
  // Combine both datasets
  seedPersons = [...cleanPersons1, ...cleanPersons2];
  
  console.log(`Loaded ${validPersons1.length} persons from ${seedFilePath1}`);
  console.log(`Loaded ${validPersons2.length} persons from ${seedFilePath2}`);
  console.log(`Total ${seedPersons.length} persons to insert`);
} catch (error) {
  console.error('Error reading seed files:', error);
  process.exit(1);
}

const seedDatabase = async () => {
  console.log('Seeding database...');
  db.serialize(() => {
    // Drop the table if it exists, and recreate it
    // This ensures that IDs are reset and we start fresh.
    // NOTE: In a real production migration, you'd be more careful.
    // For seeding/dev, this is usually fine.
    db.run("DROP TABLE IF EXISTS persons");
    db.run(`
      CREATE TABLE persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        maiden_name TEXT, -- Last name at birth
        birth_date TEXT, -- Store dates as TEXT in ISO8601 format (YYYY-MM-DD)
        death_date TEXT,
        gender TEXT,
        bio TEXT,
        profession TEXT,
        main_photo TEXT,
        location TEXT,
        created_at TEXT DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
        updated_at TEXT DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW'))
      )
    `, (err: Error | null) => {
      if (err) {
        console.error("Error creating persons table:", err.message);
        return; // Stop if table creation fails
      }
      console.log("Persons table created (or already existed and was cleared).");

      const stmt = db.prepare(`
        INSERT INTO persons (first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const person of seedPersons) {
        // Handle maiden_name field - set to null if not present
        const maidenName = person.maiden_name || null;
        
        stmt.run(
          person.first_name,
          person.last_name,
          maidenName,
          person.birth_date,
          person.death_date,
          person.gender,
          person.bio,
          person.profession,
          person.main_photo,
          person.location,
          (err: Error | null) => {
            if (err) {
              console.error('Error inserting person:', person.first_name, err.message);
            } else {
              console.log(`Inserted person: ${person.first_name} ${person.last_name}`);
            }
          }
        );
      }
      stmt.finalize((err: Error | null) => {
        if (err) console.error('Error finalizing statement:', err.message);
        else console.log('Finished inserting persons.');
        
        // Add the trigger for updated_at
        db.run(`
          CREATE TRIGGER IF NOT EXISTS update_persons_updated_at
          AFTER UPDATE ON persons
          FOR EACH ROW
          BEGIN
              UPDATE persons SET updated_at = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE id = OLD.id;
          END;
        `, (err: Error | null) => {
          if (err) console.error('Error creating trigger for persons:', err.message);
          else console.log('Trigger for persons table updated_at created or already exists.');
        });
      });
    });


    // Example of seeding a relationship (assuming Klaus (id 3) is parent of Erik (id 5))
    // This requires knowing IDs, so it's better done after persons are inserted and IDs are known
    // For simplicity, we'll add a more robust relationship seeding if needed later.
    // For now, just persons.

    // If you need to get IDs after insertion to seed relationships:
    // stmt.run(..., function(err) { if (!err) { const personId = this.lastID; /* use it */ } });
  });

  // The script will exit and the connection should close automatically.
  // If not, a more explicit close might be needed in the main execution flow,
  // but for a seed script, this is often sufficient.
  console.log('Seed script finished.');
};

// Check if database is already connected and initialized
// The db import from config/database.ts already attempts to connect.
// We need to ensure it's ready before seeding.
// A simple delay or a more robust check might be needed if initialization is slow.
setTimeout(() => {
  seedDatabase().catch((err: Error) => {
    console.error('Seeding failed:', err);
    // Avoid closing db here if other operations might still be pending or if it's managed globally
  });
}, 1000); // Wait 1 sec for db init, adjust if needed.
