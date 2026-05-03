// backend/src/server.ts
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import db from './config/database'; // Import the initialized DB connection
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['https://herrmann.no', 'https://www.herrmann.no', 'http://localhost:5173'], // Adjust to your frontend URL
  credentials: true
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `person-${req.params.personId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// ===== AUTH ROUTES =====
app.post('/api/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === 'starcraft') {
    res.status(200).json({ message: 'Login successful', token: 'fake-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ===== PERSONS CRUD ROUTES =====

// CREATE a new person
app.post('/api/persons', (req: Request, res: Response): void => {
  const { first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location } = req.body;
  if (!first_name) {
    res.status(400).json({ message: 'First name is required' });
    return;
  }
  const sql = `INSERT INTO persons (first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location];
  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creating person:', err.message);
      return res.status(500).json({ message: 'Failed to create person', error: err.message });
    }
    res.status(201).json({ message: 'Person created successfully', id: this.lastID, ...req.body });
  });
});

// READ all persons
app.get('/api/persons', (req: Request, res: Response) => {
  const sql = `
    SELECT 
      p.*,
      COALESCE(r.relationships_count, 0) as relationships_count
    FROM persons p
    LEFT JOIN (
      SELECT 
        person_id,
        COUNT(*) as relationships_count
      FROM (
        SELECT person1_id as person_id FROM relationships
        UNION ALL
        SELECT person2_id as person_id FROM relationships
      ) unified_relationships
      GROUP BY person_id
    ) r ON p.id = r.person_id
    ORDER BY p.last_name, p.first_name
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching persons:', err.message);
      return res.status(500).json({ message: 'Failed to fetch persons', error: err.message });
    }
    res.status(200).json(rows);
  });
});

// READ a single person by ID
app.get('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      p.*,
      COALESCE(r.relationships_count, 0) as relationships_count
    FROM persons p
    LEFT JOIN (
      SELECT 
        person_id,
        COUNT(*) as relationships_count
      FROM (
        SELECT person1_id as person_id FROM relationships WHERE person1_id = ?
        UNION ALL
        SELECT person2_id as person_id FROM relationships WHERE person2_id = ?
      ) unified_relationships
      GROUP BY person_id
    ) r ON p.id = r.person_id
    WHERE p.id = ?
  `;
  db.get(sql, [id, id, id], (err, row) => {
    if (err) {
      console.error('Error fetching person:', err.message);
      return res.status(500).json({ message: 'Failed to fetch person', error: err.message });
    }
    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  });
});

// UPDATE a person by ID
app.put('/api/persons/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const { first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location } = req.body;
  if (!first_name) {
    res.status(400).json({ message: 'First name is required' });
    return;
  }
  const sql = `UPDATE persons SET
               first_name = ?, last_name = ?, maiden_name = ?,
               birth_date = ?, death_date = ?, gender = ?,
               bio = ?, profession = ?, main_photo = ?, location = ?
               WHERE id = ?`;
  const params = [first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location, id];
  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error updating person:', err.message);
      return res.status(500).json({ message: 'Failed to update person', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Person not found or no changes made' });
    }
    res.status(200).json({ message: 'Person updated successfully', id: Number(id), changes: this.changes });
  });
});

// DELETE a person by ID
app.delete('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sql = "DELETE FROM persons WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting person:', err.message);
      return res.status(500).json({ message: 'Failed to delete person', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json({ message: 'Person deleted successfully', id: Number(id), changes: this.changes });
  });
});


// ===== RELATIONSHIP CRUD ROUTES =====

// ADD a relationship for a person
// person1_id is the person from the URL param, person2_id is the relatedPersonId from the body
app.post('/api/persons/:personId/relationships', (req: Request, res: Response): void => {
  const person1_id = parseInt(req.params.personId, 10);
  const { relatedPersonId, relationshipType, startDate, endDate } = req.body;

  if (!relatedPersonId || !relationshipType) {
    res.status(400).json({ message: 'relatedPersonId and relationshipType are required.' });
    return;
  }
  if (person1_id === relatedPersonId) {
    res.status(400).json({ message: 'Cannot create a relationship with oneself.' });
    return;
  }

  // To avoid duplicate relationships (e.g. A is parent of B, and B is child of A),
  // we can standardize: e.g. for 'parent_of', person1 is parent, person2 is child.
  // For 'married_to', order might not matter, so ensure (p1,p2,type) is unique, possibly by always storing lower ID first.
  // For simplicity, the unique constraint in DB handles (p1, p2, type) uniqueness.

  const sql = `INSERT INTO relationships (person1_id, person2_id, relationship_type, start_date, end_date)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [person1_id, relatedPersonId, relationshipType, startDate, endDate];

  db.run(sql, params, function (err) {
    if (err) {
      // Check for UNIQUE constraint error
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(409).json({ message: 'This relationship already exists.', error: err.message });
        return;
      }
      res.status(500).json({ message: 'Failed to create relationship', error: err.message });
      return;
    }
    res.status(201).json({
      message: 'Relationship created successfully',
      id: this.lastID,
      person1_id,
      person2_id: relatedPersonId,
      relationship_type: relationshipType,
      start_date: startDate,
      end_date: endDate
    });
  });
});

// CREATE a new person AND relate them to an existing person, atomically.
// Body: { person: { first_name, last_name?, ... }, relationshipType, startDate?, endDate? }
app.post('/api/persons/:personId/relationships/with-new-person', (req: Request, res: Response): void => {
  const person1_id = parseInt(req.params.personId, 10);
  const { person, relationshipType, startDate, endDate } = req.body || {};

  if (!person || typeof person !== 'object') {
    res.status(400).json({ message: 'person object is required' });
    return;
  }
  if (!person.first_name) {
    res.status(400).json({ message: 'person.first_name is required' });
    return;
  }
  if (!relationshipType) {
    res.status(400).json({ message: 'relationshipType is required' });
    return;
  }

  const insertPersonSql = `INSERT INTO persons
    (first_name, last_name, maiden_name, birth_date, death_date, gender, bio, profession, main_photo, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const personParams = [
    person.first_name,
    person.last_name ?? null,
    person.maiden_name ?? null,
    person.birth_date ?? null,
    person.death_date ?? null,
    person.gender ?? null,
    person.bio ?? null,
    person.profession ?? null,
    person.main_photo ?? null,
    person.location ?? null,
  ];

  const insertRelationshipSql = `INSERT INTO relationships
    (person1_id, person2_id, relationship_type, start_date, end_date)
    VALUES (?, ?, ?, ?, ?)`;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(insertPersonSql, personParams, function (personErr) {
      if (personErr) {
        db.run('ROLLBACK');
        console.error('Error creating person (with relationship):', personErr.message);
        res.status(500).json({ message: 'Failed to create person', error: personErr.message });
        return;
      }
      const newPersonId = this.lastID;

      db.run(
        insertRelationshipSql,
        [person1_id, newPersonId, relationshipType, startDate ?? null, endDate ?? null],
        function (relErr) {
          if (relErr) {
            db.run('ROLLBACK');
            if (relErr.message.includes('UNIQUE constraint failed')) {
              res.status(409).json({ message: 'This relationship already exists.', error: relErr.message });
              return;
            }
            if (relErr.message.includes('FOREIGN KEY')) {
              res.status(400).json({ message: 'Invalid personId', error: relErr.message });
              return;
            }
            console.error('Error creating relationship (with new person):', relErr.message);
            res.status(500).json({ message: 'Failed to create relationship', error: relErr.message });
            return;
          }
          const newRelationshipId = this.lastID;

          db.run('COMMIT', (commitErr) => {
            if (commitErr) {
              console.error('Commit failed:', commitErr.message);
              res.status(500).json({ message: 'Failed to commit transaction', error: commitErr.message });
              return;
            }
            res.status(201).json({
              message: 'Person and relationship created',
              person: { id: newPersonId, ...person },
              relationship: {
                id: newRelationshipId,
                person1_id,
                person2_id: newPersonId,
                relationship_type: relationshipType,
                start_date: startDate ?? null,
                end_date: endDate ?? null,
              },
            });
          });
        }
      );
    });
  });
});

// GET all relationships for a specific person
// This will return relationships where the person is either person1_id or person2_id
app.get('/api/persons/:personId/relationships', (req: Request, res: Response) => {
  const personId = parseInt(req.params.personId, 10);
  const sql = `
    SELECT
      r.id,
      r.person1_id,
      p1.first_name  as person1_first_name,
      p1.last_name   as person1_last_name,
      p1.birth_date  as person1_birth_date,
      p1.death_date  as person1_death_date,
      p1.main_photo  as person1_main_photo,
      r.person2_id,
      p2.first_name  as person2_first_name,
      p2.last_name   as person2_last_name,
      p2.birth_date  as person2_birth_date,
      p2.death_date  as person2_death_date,
      p2.main_photo  as person2_main_photo,
      r.relationship_type,
      r.start_date,
      r.end_date
    FROM relationships r
    JOIN persons p1 ON r.person1_id = p1.id
    JOIN persons p2 ON r.person2_id = p2.id
    WHERE r.person1_id = ? OR r.person2_id = ?
  `;
  db.all(sql, [personId, personId], (err, rows) => {
    if (err) {
      console.error('Error fetching relationships:', err.message);
      return res.status(500).json({ message: 'Failed to fetch relationships', error: err.message });
    }
    res.status(200).json(rows);
  });
});

// DELETE a specific relationship by its ID
app.delete('/api/relationships/:relationshipId', (req: Request, res: Response) => {
  const relationshipId = parseInt(req.params.relationshipId, 10);
  const sql = "DELETE FROM relationships WHERE id = ?";

  db.run(sql, [relationshipId], function (err) {
    if (err) {
      console.error('Error deleting relationship:', err.message);
      return res.status(500).json({ message: 'Failed to delete relationship', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    res.status(200).json({ message: 'Relationship deleted successfully', id: relationshipId, changes: this.changes });
  });
});


// ===== PHOTO UPLOAD ROUTE =====

// Upload photo for a person
app.post('/api/persons/:personId/photo', upload.single('photo'), (req: Request, res: Response): void => {
  const personId = parseInt(req.params.personId, 10);
  
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  // Build the URL for the uploaded photo
  const photoUrl = `/uploads/${req.file.filename}`;
  
  // Update the person's main_photo in the database (changed from profile_picture_url)
  const sql = 'UPDATE persons SET main_photo = ? WHERE id = ?';
  
  db.run(sql, [photoUrl, personId], function(err) {
    if (err) {
      // Delete the uploaded file if database update fails
      fs.unlink(req.file!.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
      console.error('Error updating person photo:', err.message);
      return res.status(500).json({ message: 'Failed to update person photo', error: err.message });
    }
    
    if (this.changes === 0) {
      // Delete the uploaded file if person not found
      fs.unlink(req.file!.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.status(200).json({ 
      message: 'Photo uploaded successfully', 
      main_photo: photoUrl,  // Changed from profile_picture_url
      personId: personId 
    });
  });
});

// Delete photo for a person
app.delete('/api/persons/:personId/photo', (req: Request, res: Response): void => {
  const personId = parseInt(req.params.personId, 10);
  
  // First, get the current photo URL
  const selectSql = 'SELECT main_photo FROM persons WHERE id = ?';  // Changed from profile_picture_url
  
  db.get(selectSql, [personId], (err, row: any) => {
    if (err) {
      console.error('Error fetching person:', err.message);
      return res.status(500).json({ message: 'Failed to fetch person', error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    const currentPhotoUrl = row.main_photo;  // Changed from profile_picture_url
    
    // Update the person's main_photo to null
    const updateSql = 'UPDATE persons SET main_photo = NULL WHERE id = ?';  // Changed from profile_picture_url
    
    db.run(updateSql, [personId], function(updateErr) {
      if (updateErr) {
        console.error('Error removing person photo:', updateErr.message);
        return res.status(500).json({ message: 'Failed to remove person photo', error: updateErr.message });
      }
      
      // If there was a photo stored locally, delete it
      if (currentPhotoUrl && currentPhotoUrl.startsWith('/uploads/')) {
        const filename = currentPhotoUrl.replace('/uploads/', '');
        const filepath = path.join(uploadsDir, filename);
        
        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr && unlinkErr.code !== 'ENOENT') {
            console.error('Error deleting file:', unlinkErr);
          }
        });
      }
      
      res.status(200).json({ 
        message: 'Photo removed successfully', 
        personId: personId 
      });
    });
  });
});

// ===== CALENDAR =====
// Single payload powering the calendar page: every person with a birth or
// death date, plus every marriage that has a start_date. Frontend slices
// these into "today / this week / next month / per-month accordions".
app.get('/api/calendar', (_req: Request, res: Response) => {
  const personsSql = `
    SELECT id, first_name, last_name, birth_date, death_date, main_photo
    FROM persons
    WHERE (birth_date IS NOT NULL AND birth_date != '')
       OR (death_date IS NOT NULL AND death_date != '')
  `;
  const marriagesSql = `
    SELECT
      r.id, r.start_date, r.end_date,
      p1.id  AS p1_id, p1.first_name AS p1_first_name, p1.last_name AS p1_last_name, p1.main_photo AS p1_main_photo,
      p2.id  AS p2_id, p2.first_name AS p2_first_name, p2.last_name AS p2_last_name, p2.main_photo AS p2_main_photo
    FROM relationships r
    JOIN persons p1 ON r.person1_id = p1.id
    JOIN persons p2 ON r.person2_id = p2.id
    WHERE r.relationship_type = 'spouse_of'
      AND r.start_date IS NOT NULL
      AND r.start_date != ''
  `;
  db.all(personsSql, [], (pErr, persons) => {
    if (pErr) {
      console.error('Calendar persons query failed:', pErr.message);
      return res.status(500).json({ message: 'Failed to fetch calendar', error: pErr.message });
    }
    db.all(marriagesSql, [], (mErr, marriages) => {
      if (mErr) {
        console.error('Calendar marriages query failed:', mErr.message);
        return res.status(500).json({ message: 'Failed to fetch calendar', error: mErr.message });
      }
      res.status(200).json({ persons, marriages });
    });
  });
});

// ===== STATS =====
// Aggregate counts for the home page KPIs. One round-trip, cheap query.
app.get('/api/stats', (_req: Request, res: Response) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM persons) AS persons_count,
      (SELECT COUNT(*) FROM relationships) AS relationships_count
  `;
  db.get(sql, [], (err, row: any) => {
    if (err) {
      console.error('Error fetching stats:', err.message);
      return res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
    }
    res.status(200).json({
      persons: row?.persons_count ?? 0,
      relationships: row?.relationships_count ?? 0,
    });
  });
});

// Root path
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Herrmann Family Tree Backend! Database is connected.');
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
