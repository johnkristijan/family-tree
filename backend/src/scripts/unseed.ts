// backend/src/scripts/unseed.ts
import db from '../config/database'; // Adjust path

const unseedDatabase = async () => {
  console.log('Unseeding database...');
  db.serialize(() => {
    // Order matters due to foreign key constraints if any were ON DELETE RESTRICT
    // For ON DELETE CASCADE, order of deletion between related tables is less critical,
    // but good practice to delete from child/referencing tables first or ensure cascading deletes work.
    // Since relationships reference persons, deleting persons will cascade to relationships.
    // However, it's cleaner to delete relationships explicitly first.

    db.run('DELETE FROM relationships', [], (err) => {
      if (err) {
        console.error('Error deleting relationships:', err.message);
      } else {
        console.log('All relationships deleted.');
      }
    });

    db.run('DELETE FROM persons', [], (err) => {
      if (err) {
        console.error('Error deleting persons:', err.message);
      } else {
        console.log('All persons deleted.');
      }
    });

    // Reset autoincrement counters for SQLite (optional)
    db.run(`DELETE FROM sqlite_sequence WHERE name='persons'`, [], (err) => {
      if (err) console.error('Error resetting persons sequence:', err.message);
      else console.log('Persons sequence reset.');
    });
    db.run(`DELETE FROM sqlite_sequence WHERE name='relationships'`, [], (err) => {
      if (err) console.error('Error resetting relationships sequence:', err.message);
      else console.log('Relationships sequence reset.');
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed after unseeding.');
  });
};

setTimeout(() => {
  unseedDatabase().catch(err => {
    console.error('Unseeding failed:', err);
    db.close();
  });
}, 500); // Wait for db init
