// script.js

// 1. กำหนด URL ของ Backend API (พอร์ต 3001 คือที่ Docker แมพออกมา)
const API_URL = 'http://localhost:3001/api/books';

// 2. ฟังก์ชันดึงข้อมูลจาก Backend
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();

        const listElement = document.getElementById('book-list');
        
        if (books.length === 0) {
            listElement.innerHTML = '<li>ไม่มีข้อมูลหนังสือ</li>';
            return;
        }

        listElement.innerHTML = books.map(book => `
            <li>
                <strong>${book.title}</strong> - ${book.author} 
                (${book.status || 'Available'})
            </li>
        `).join('');
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        document.getElementById('book-list').innerHTML = '<li>ไม่สามารถโหลดข้อมูลได้</li>';
    }
}

fetchBooks();