// Import dependencies
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
dotenv.config();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Check database connection
db.connect((err) => {
    if (err) return console.log("Error connecting to MYSQL");
    console.log("Connected to MYSQL as id: ", db.threadId); 
});

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// QUESTION ONE
// Route to retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data');
        }
        res.render('data', { patients: results, providers: [] });
    });
});

// QUESTION TWO
// Route to retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data');
        }
        res.render('data', { patients: [], providers: results });
    });
});

// QUESTION THREE
// Route to filter patients by first name
app.get('/patients/search', (req, res) => {
    const firstName = req.query.firstName; // Expecting a query like /patients/search?firstName=John
    if (!firstName) {
        return res.status(400).send('First name is required');
    }

    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data');
        }
        res.render('data', { patients: results, providers: [] });
    });
});

// QUESTION FOUR
// Route to filter providers by specialty
app.get('/providers/search', (req, res) => {
    const specialty = req.query.specialty; // Expecting a query like /providers/search?specialty=Cardiology
    if (!specialty) {
        return res.status(400).send('Specialty is required');
    }

    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving data');
        }
        res.render('data', { patients: [], providers: results });
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('Server Started Successfully!');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
