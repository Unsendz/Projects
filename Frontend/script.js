// script.js

// 1. กำหนด URL ของ Backend API
const API_URL = 'http://localhost:8080/api/books';

// 2. ฟังก์ชันดึงข้อมูลจาก Backend
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        renderTable(books);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        document.getElementById('table-body').innerHTML = 
            '<tr><td colspan="5" style="text-align:center; color:red;">ไม่สามารถเชื่อมต่อกับ Backend ได้</td></tr>';
    }
}

// 3. ฟังก์ชันนำข้อมูลมาสร้างแถวในตาราง
function renderTable(books) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // ล้างข้อมูลเก่าก่อน

    books.forEach(book => {
        // กำหนด class ของป้ายสถานะตามข้อมูล
        let statusClass = '';
        if (book.status === 'Available') statusClass = 'status-available';
        else if (book.status === 'Borrowed') statusClass = 'status-borrowed';
        else if (book.status === 'Reserved') statusClass = 'status-reserved';

        const row = `
            <tr>
                <td data-label="ID">${book.id}</td>
                <td data-label="ชื่อหนังสือ"><strong>${book.title}</strong></td>
                <td data-label="สถานะ">
                    <span class="badge ${statusClass}">${book.status}</span>
                </td>
                <td data-label="ผู้ยืม/จอง">${book.borrower}</td>
                <td data-label="กำหนดส่ง">${book.dueDate}</td>
                <td data-label="จัดการ">
                    <button class="btn btn-primary" 
                        ${book.status !== 'Available' ? 'disabled' : ''} 
                        onclick="reserveBook(${book.id})">
                        ${book.status === 'Available' ? 'จอง' : 'ไม่ว่าง'}
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// 4. ฟังก์ชันส่งคำขอจอง (ตัวอย่างการทำงานเบื้องต้น)
function reserveBook(bookId) {
    const userName = prompt("กรุณาระบุชื่อของคุณเพื่อจองหนังสือ:");
    if (userName) {
        alert(`ระบบได้รับคำขอจองหนังสือ ID: ${bookId} สำหรับคุณ ${userName} แล้ว\n(ในระบบจริงจะส่งค่าไปยัง Backend API)`);
        
        // หมายเหตุ: หากจะทำให้กดจองได้จริง ต้องเขียน app.post ใน index.js 
        // แล้วใช้ fetch(API_URL + '/borrow', { method: 'POST', ... }) ตรงนี้ครับ
    }
}

// 5. สั่งให้ทำงานทันทีเมื่อเปิดหน้าเว็บ และอัปเดตทุกๆ 5 วินาที
fetchBooks();
setInterval(fetchBooks, 5000);