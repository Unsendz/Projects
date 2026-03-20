const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./server');

app.use(cors());
app.use(express.json());

// 1. ค้นหาหนังสือ (Real-time Search)
app.get('/api/books/search', (req, res) => {
    const query = req.query.q || '';
    const sql = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?";
    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. บันทึกการจอง (Booking)
app.post('/api/bookings', (req, res) => {
    const { book, user, date } = req.body;
    const sql = "INSERT INTO bookings (book_name, user_name, booking_date) VALUES (?, ?, ?)";
    db.query(sql, [book, user, date], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Reserved successfully!" });
    });
});

// 3. แจ้งเตือนหนังสือใกล้ครบกำหนดคืน (แจ้งล่วงหน้า 2 วัน)
app.get('/api/notifications/due-soon', (req, res) => {
    // ดึงรายชื่อคนที่ต้องคืนหนังสือภายใน 2 วันข้างหน้า
    const sql = `
        SELECT borrower_name, due_date, (SELECT title FROM books WHERE id = loans.book_id) as book_title 
        FROM loans 
        WHERE status = 'Active' 
        AND due_date <= DATE_ADD(CURDATE(), INTERVAL 2 DAY)
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 4. ระบบคืนหนังสือ (Update สถานะ)
app.post('/api/return', (req, res) => {
    const { loanId, bookId } = req.body;
    // อัปเดตตาราง loans ว่าคืนแล้ว และอัปเดตตาราง books ว่าว่าง
    const updateLoan = "UPDATE loans SET status = 'Returned', return_date = CURDATE() WHERE id = ?";
    const updateBook = "UPDATE books SET status = 'Available' WHERE id = ?";
    
    db.query(updateLoan, [loanId], (err) => {
        if (err) return res.status(500).json(err);
        db.query(updateBook, [bookId], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Returned successfully!" });
        });
    });
});

app.listen(3000, () => {
    console.log('🚀 Library System API running on port 3000');
});