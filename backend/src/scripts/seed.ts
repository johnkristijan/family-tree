// backend/src/scripts/seed.ts
import db from '../config/database'; // Adjust path as necessary

const seedPersons = [
  {
    first_name: 'Hans',
    last_name: 'Herrmann',
    birth_date: '1930-01-15',
    gender: 'Male',
    bio: 'Patriarch of the Herrmann family. Originally from Germany.',
  },
  {
    first_name: 'Greta',
    last_name: 'Herrmann',
    birth_date: '1932-05-20',
    gender: 'Female',
    bio: 'Matriarch of the Herrmann family. Met Hans in Berlin.',
  },
  {
    first_name: 'Klaus',
    last_name: 'Herrmann',
    birth_date: '1955-08-10',
    gender: 'Male',
    bio: 'Eldest son of Hans and Greta. Moved to Norway.',
  },
  {
    first_name: 'Astrid',
    last_name: 'Jensen', // Married name
    birth_date: '1958-12-01',
    gender: 'Female',
    bio: 'Daughter of Hans and Greta. Lives in Oslo.',
  },
  {
    first_name: 'Erik',
    last_name: 'Herrmann', // Son of Klaus
    birth_date: '1980-06-25',
    gender: 'Male',
    bio: 'Son of Klaus. Software developer.',
  },
];

const seedDatabase = async () => {
  console.log('Seeding database...');
  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT INTO persons (first_name, last_name, birth_date, gender, bio)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const person of seedPersons) {
      stmt.run(
        person.first_name,
        person.last_name,
        person.birth_date,
        person.gender,
        person.bio,
        (err) => {
          if (err) {
            console.error('Error inserting person:', person.first_name, err.message);
          } else {
            console.log(`Inserted person: ${person.first_name} ${person.last_name}`);
          }
        }
      );
    }
    stmt.finalize((err) => {
      if (err) console.error('Error finalizing statement:', err.message);
      else console.log('Finished inserting persons.');
    });

    // Example of seeding a relationship (assuming Klaus (id 3) is parent of Erik (id 5))
    // This requires knowing IDs, so it's better done after persons are inserted and IDs are known
    // For simplicity, we'll add a more robust relationship seeding if needed later.
    // For now, just persons.

    // If you need to get IDs after insertion to seed relationships:
    // stmt.run(..., function(err) { if (!err) { const personId = this.lastID; /* use it */ } });
  });

  // Close the database connection when done, otherwise the script will hang
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed after seeding.');
  });
};

// Check if database is already connected and initialized
// The db import from config/database.ts already attempts to connect.
// We need to ensure it's ready before seeding.
// A simple delay or a more robust check might be needed if initialization is slow.
setTimeout(() => {
  seedDatabase().catch(err => {
    console.error('Seeding failed:', err);
    db.close(); // Ensure connection is closed on error
  });
}, 1000); // Wait 1 sec for db init, adjust if needed.
