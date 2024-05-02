const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // Change this to your MySQL password
    database: 'user_registration'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create users table if not exists
db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)`, err => {
    if (err) {
        console.error('Error creating users table:', err);
    }
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ message: 'An error occurred. Please try again.' });
            return;
        }
        console.log('User registered:', result);
        res.json({ message: 'Registration successful' });
    });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Retrieve user from the database
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err);
            res.status(500).json({ message: 'An error occurred. Please try again.' });
            return;
        }

        if (results.length === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        const user = results[0];

        // Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

        res.json({ message: 'Login successful' });
    });
});

// Welcome page endpoint
app.get('/welcome', (req, res) => {
    res.send('<h1>Welcome to the User Registration System!</h1>');
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
