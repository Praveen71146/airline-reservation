require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // Default XAMPP MySQL has no password
    database: 'airline_reservation'
});

db.connect(err => {
    if (err) console.error('Database connection failed:', err);
    else console.log('Connected to MySQL (XAMPP)');
});

// Test API
app.get('/', (req, res) => {
    res.send('Airline Reservation API Running');
});
app.get('/search', (req, res) => {
    const { from, to } = req.query;

    const sql = "SELECT * FROM flights WHERE departure = ? AND destination = ?";
    
    db.query(sql, [from, to], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }
        res.json(results);
    });
});
app.post('/book', (req, res) => {
    const { user_id, flight_id, seats } = req.body;

    db.query("SELECT price, seats FROM flights WHERE id = ?", [flight_id], (err, result) => {
        if (err) return res.status(500).send("Database error");

        if (result.length === 0) {
            return res.status(400).send("Flight not found");
        }

        let total_price = result[0].price * seats;

        const insertSql = "INSERT INTO bookings (user_id, flight_id, seats_booked, total_price, status) VALUES (?, ?, ?, ?, 'pending')";

        db.query(insertSql, [user_id, flight_id, seats, total_price], (err, result) => {
            if (err) return res.status(500).send("Error booking flight");
            res.json({ message: "Booking Successful!", booking_id: result.insertId });
        });
    });
});

// Start Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});