// backend/src/server.ts
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from './config/database'; // Import the initialized DB connection

const app = express();
const port = process.env.PORT || 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir)); // Serve uploaded files

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
  const sql = "SELECT * FROM persons ORDER BY last_name, first_name";
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
  const sql = "SELECT * FROM persons WHERE id = ?";
  db.get(sql, [id], (err, row) => {
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

// UPLOAD photo for a person
// Handles multipart/form-data image upload for a specific person.
// Expects a single file in a field named 'photo'.
// On success, updates the person's 'main_photo' field with the URL of the uploaded image
// and returns the new photo URL and personId.
// Images are stored in `backend/public/uploads/` and served via `/uploads/*`.
app.post('/api/persons/:id/upload-photo', upload.single('photo'), (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Construct the URL of the uploaded file
  // Ensure the base URL matches how your frontend will access it.
  // If your backend and frontend are served from the same domain and port eventually,
  // a relative path like '/uploads/${req.file.filename}' would be more robust.
  // For localhost development, an absolute URL is fine.
  const photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  const sql = `UPDATE persons SET main_photo = ? WHERE id = ?`;
  db.run(sql, [photoUrl, id], function (err) {
    if (err) {
      console.error('Error updating person photo in DB:', err.message);
      // Consider deleting the uploaded file if DB update fails to prevent orphaned files
      // fs.unlink(req.file.path, unlinkErr => { if (unlinkErr) console.error('Error deleting file after DB fail:', unlinkErr); });
      return res.status(500).json({ message: 'Failed to update person photo information.', error: err.message });
    }
    if (this.changes === 0) {
      // Also consider deleting file if person not found
      return res.status(404).json({ message: 'Person not found.' });
    }
    res.status(200).json({ message: 'Photo uploaded and person updated successfully.', main_photo: photoUrl, personId: id });
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

// GET all relationships for a specific person
// This will return relationships where the person is either person1_id or person2_id
app.get('/api/persons/:personId/relationships', (req: Request, res: Response) => {
  const personId = parseInt(req.params.personId, 10);
  const sql = `
    SELECT
      r.id,
      r.person1_id,
      p1.first_name as person1_first_name,
      p1.last_name as person1_last_name,
      r.person2_id,
      p2.first_name as person2_first_name,
      p2.last_name as person2_last_name,
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


// Root path
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Herrmann Family Tree Backend! Database is connected.');
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
