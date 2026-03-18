const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'bookings.json');

app.use(cors());
app.use(express.json());

// ฟังก์ชันดึงข้อมูลจากไฟล์ JSON
const getBookings = () => {
    if (!fs.existsSync(DATA_PATH)) return [];
    return JSON.parse(fs.readFileSync(DATA_PATH));
};

// 1. GET: ดูรายการทั้งหมด
app.get('/api/bookings', (req, res) => {
    res.json(getBookings());
});

// 2. POST: บันทึกการจองใหม่
app.post('/api/bookings', (req, res) => {
    const bookings = getBookings();
    const newBooking = { id: Date.now(), ...req.body, status: 'Active' };
    bookings.push(newBooking);
    fs.writeFileSync(DATA_PATH, JSON.stringify(bookings, null, 2));
    res.status(201).json(newBooking);
});

// 3. DELETE: คืนหนังสือ (ลบออก)
app.delete('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    let bookings = JSON.parse(fs.readFileSync(DATA_PATH));
    bookings = bookings.filter(b => b.id != id);
    fs.writeFileSync(DATA_PATH, JSON.stringify(bookings, null, 2));
    res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});