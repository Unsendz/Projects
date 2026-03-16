const cors = require('cors');
app.use(cors());              
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// ข้อมูลจำลอง (Database)
let books = [
    { id: 1, title: "Node.js Guide", status: "Available", borrower: "-", dueDate: "-" },
    { id: 2, title: "Mastering HTML", status: "Borrowed", borrower: "Somchai", dueDate: "20/03/2026" },
    { id: 3, title: "Database 101", status: "Reserved", borrower: "Jane", dueDate: "-" }
];

app.get('/api/books', (req, res) => res.json(books));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Library System - Backend</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f0f2f5; padding: 40px; color: #333; }
                .container { max-width: 900px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                h1 { color: #1a73e8; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
                th { background-color: #f8f9fa; color: #555; }
                .badge { padding: 5px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold; }
                .available { background: #e6f4ea; color: #1e7e34; }
                .borrowed { background: #fef7e0; color: #b05a00; }
                .reserved { background: #e8f0fe; color: #1967d2; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📚 ระบบจัดการห้องสมุด (Real-time)</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th><th>ชื่อหนังสือ</th><th>สถานะ</th><th>ผู้ยืม/จอง</th><th>กำหนดส่ง</th>
                        </tr>
                    </thead>
                    <tbody id="table-body">
                        </tbody>
                </table>
            </div>

            <script>
                async function updateTable() {
                    const res = await fetch('/api/books');
                    const data = await res.json();
                    const tbody = document.getElementById('table-body');
                    tbody.innerHTML = '';
                    
                    data.forEach(book => {
                        const statusClass = book.status.toLowerCase();
                        tbody.innerHTML += \`
                            <tr>
                                <td>\${book.id}</td>
                                <td><strong>\${book.title}</strong></td>
                                <td><span class="badge \${statusClass}">\${book.status}</span></td>
                                <td>\${book.borrower}</td>
                                <td>\${book.dueDate}</td>
                            </tr>\`;
                    });
                }
                setInterval(updateTable, 3000); // อัปเดตข้อมูลทุก 3 วินาที
                updateTable();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log('✅ Server is running on http://localhost:' + PORT));