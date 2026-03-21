const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'password123',
    database: 'my_database'
});

app.get('/api/bookings', (req, res) => {
    db.query("SELECT * FROM bookings ORDER BY id DESC", (err, result) => res.json(result));
});

app.delete('/api/bookings/:id', (req, res) => {
    db.query("DELETE FROM bookings WHERE id = ?", [req.params.id], () => res.send("OK"));
});

app.post('/api/bookings', (req, res) => {
    const { book, user, date } = req.body;
    const sql = "INSERT INTO bookings (book_name, user_name, booking_date) VALUES (?, ?, ?)";
    db.query(sql, [book, user, date], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database Error");
        } else {
            res.status(200).send("Booking Success");
        }
    });
});

app.listen(3000);