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

db.connect(err => {
    if (err) console.error('DB Connection Error:', err);
    else console.log('Connected to MySQL Database');
});

app.post('/api/bookings', (req, res) => {
    const { book, user, date } = req.body;
    const sql = "INSERT INTO bookings (book_name, user_name, booking_date) VALUES (?, ?, ?)";
    db.query(sql, [book, user, date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Success' });
    });
});

app.get('/api/bookings', (req, res) => {
    const sql = "SELECT * FROM bookings ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM bookings WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Deleted successfully' });
    });
});

app.listen(3000, () => console.log('Backend running on port 3000 (Docker mapped to 3001)'));