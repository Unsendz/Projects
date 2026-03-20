const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'db', // ต้องเป็นชื่อ service ใน docker-compose
    user: 'user',
    password: 'password',
    database: 'my_database'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL Database in Docker');
});

module.exports = db;