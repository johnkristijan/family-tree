// backend/src/server.ts
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import db from './config/database'; // Import the initialized DB connection

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

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
app.post('/api/persons', (req: Request, res: Response) => {
  const { first_name, last_name, middle_name, birth_date, death_date, gender, bio, profile_picture_url } = req.body;
  if (!first_name) {
    return res.status(400).json({ message: 'First name is required' });
  }

  const sql = `INSERT INTO persons (first_name, last_name, middle_name, birth_date, death_date, gender, bio, profile_picture_url)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [first_name, last_name, middle_name, birth_date, death_date, gender, bio, profile_picture_url];

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
app.put('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, middle_name, birth_date, death_date, gender, bio, profile_picture_url } = req.body;

  if (!first_name) { // Basic validation
    return res.status(400).json({ message: 'First name is required' });
  }

  // Note: updated_at is handled by the trigger
  const sql = `UPDATE persons SET
               first_name = ?,
               last_name = ?,
               middle_name = ?,
               birth_date = ?,
               death_date = ?,
               gender = ?,
               bio = ?,
               profile_picture_url = ?
               WHERE id = ?`;
  const params = [first_name, last_name, middle_name, birth_date, death_date, gender, bio, profile_picture_url, id];

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


// Root path (keep or remove as needed)
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the Herrmann Family Tree Backend! Database is connected.');
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
