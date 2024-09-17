const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const fs = require('fs');
const cors = require('cors');

const port = 3000;

// Enable CORS
app.use(cors());

// MySQL Configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '988194594',
  database: 'user_auth'
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload images only (jpg, jpeg, png).'));
    }
    cb(null, true);
  }
});

// Middleware for parsing JSON and forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// User registration route
app.post('/register', upload.single('profile_image'), async (req, res) => {
  const { nickname, email, password } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  try {
    // Check if email or nickname already exists
    const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ? OR nickname = ?', [email, nickname]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email or nickname already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert the new user
    await db.promise().query('INSERT INTO users (nickname, email, password_hash, profile_image) VALUES (?, ?, ?, ?)', [nickname, email, hashedPassword, profileImage]);
    res.status(201).json({ success: true, message: 'User successfully registered' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

// User login route
app.post('/login', async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // Fetch the user from the database
    const [rows] = await db.promise().query('SELECT * FROM users WHERE nickname = ?', [nickname]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid nickname or password' });
    }

    const user = rows[0];

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid nickname or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, nickname: user.nickname }, 'secret_key', { expiresIn: '1h' });

    res.json({ success: true, token, message: 'Login successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// Serve static files (profile images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
