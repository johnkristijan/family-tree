// backend/src/scripts/seed.ts
import db from '../config/database'; // Adjust path as necessary

const seedPersons = [
  {
    id: 1,
    first_name: 'Johann',
    last_name: 'Herrmann',
    birth_date: '1880-03-15',
    death_date: '1955-07-20',
    gender: 'Male',
    bio: 'Patriarch of the Herrmann family. Farmer in rural Germany.',
  },
  {
    id: 2,
    first_name: 'Anna',
    last_name: 'Herrmann', // Maiden name Schmidt
    birth_date: '1885-09-22',
    death_date: '1960-01-10',
    gender: 'Female',
    bio: 'Matriarch of the Herrmann family. Married Johann in 1905.',
  },
  {
    id: 3,
    first_name: 'Wilhelm',
    last_name: 'Herrmann',
    birth_date: '1906-06-05',
    death_date: '1975-11-30',
    gender: 'Male',
    bio: 'Eldest son of Johann and Anna. Took over the family farm.',
  },
  {
    id: 4,
    first_name: 'Frieda',
    last_name: 'Schulz', // Married name
    birth_date: '1908-11-12',
    death_date: '1982-03-25',
    gender: 'Female',
    bio: 'Daughter of Johann and Anna. Moved to Berlin after marriage.',
  },
  {
    id: 5,
    first_name: 'Karl',
    last_name: 'Herrmann',
    birth_date: '1930-01-20',
    death_date: '2005-09-15',
    gender: 'Male',
    bio: 'Son of Wilhelm. Continued farming.',
  },
  {
    id: 6,
    first_name: 'Sophie',
    last_name: 'Herrmann', // Maiden name Weber
    birth_date: '1933-07-14',
    death_date: '2010-06-01',
    gender: 'Female',
    bio: 'Wife of Karl Herrmann. Known for her baking.',
  },
  {
    id: 7,
    first_name: 'Peter',
    last_name: 'Schulz',
    birth_date: '1932-04-01',
    death_date: '1999-12-05',
    gender: 'Male',
    bio: 'Son of Frieda. Worked as a tailor in Berlin.',
  },
  {
    id: 8,
    first_name: 'Hans',
    last_name: 'Herrmann',
    birth_date: '1955-08-10',
    death_date: null, // Still alive
    gender: 'Male',
    bio: 'Son of Karl and Sophie. Moved to Norway in the 1970s.',
  },
  {
    id: 9,
    first_name: 'Greta',
    last_name: 'Herrmann', // Maiden name Olsen
    birth_date: '1958-05-20',
    death_date: null, // Still alive
    gender: 'Female',
    bio: 'Wife of Hans Herrmann. Met Hans in Oslo.',
  },
  {
    id: 10,
    first_name: 'Klaus',
    last_name: 'Herrmann',
    birth_date: '1980-11-15',
    death_date: null, // Still alive
    gender: 'Male',
    bio: 'Son of Hans and Greta. Lives in Bergen.',
  },
  {
    id: 11,
    first_name: 'Astrid',
    last_name: 'Jensen', // Married name
    birth_date: '1983-02-28',
    death_date: null, // Still alive
    gender: 'Female',
    bio: 'Daughter of Hans and Greta. Married and lives in Oslo.',
  },
  {
    id: 12,
    first_name: 'Erik',
    last_name: 'Herrmann',
    birth_date: '2005-06-25',
    death_date: null, // Still alive
    gender: 'Male',
    bio: 'Son of Klaus. Student.',
  },
  {
    id: 13,
    first_name: 'Lars',
    last_name: 'Jensen',
    birth_date: '1980-09-10',
    death_date: null, // Still alive
    gender: 'Male',
    bio: 'Husband of Astrid Jensen. Works as an engineer.',
  },
  {
    id: 14,
    first_name: 'Ingrid',
    last_name: 'Jensen',
    birth_date: '2010-03-03',
    death_date: null, // Still alive
    gender: 'Female',
    bio: 'Daughter of Astrid and Lars Jensen.',
  }
];

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
        last_name TEXT NOT NULL,
        birth_date TEXT, -- Assuming YYYY-MM-DD
        death_date TEXT, -- Assuming YYYY-MM-DD, can be NULL
        gender TEXT,
        bio TEXT
      )
    `, (err: Error | null) => {
      if (err) {
        console.error("Error creating persons table:", err.message);
        return; // Stop if table creation fails
      }
      console.log("Persons table created (or already existed and was cleared).");

      const stmt = db.prepare(`
        INSERT INTO persons (id, first_name, last_name, birth_date, death_date, gender, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const person of seedPersons) {
        stmt.run(
          person.id,
          person.first_name,
          person.last_name,
          person.birth_date,
          person.death_date,
          person.gender,
          person.bio,
          (err: Error | null) => {
            if (err) {
              console.error('Error inserting person:', person.first_name, err.message);
            } else {
              console.log(`Inserted person: ${person.first_name} ${person.last_name} with ID ${person.id}`);
            }
          }
        );
      }
      stmt.finalize((err: Error | null) => {
        if (err) console.error('Error finalizing statement:', err.message);
        else console.log('Finished inserting persons.');
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
