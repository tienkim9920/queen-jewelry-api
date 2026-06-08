const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3005;

app.use(express.json());

const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Tktk0909@',
    database: 'queen_jewelry',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// API GET: Lấy thông tin section Intro
// ==========================================
app.get('/api/sections/intro', async (req, res) => {
    try {
        const sectionKey = 'intro';
        const [rows] = await dbPool.query(
            'SELECT id, section_key, section_name, content, created_at, updated_at FROM cms_section WHERE section_key = ? LIMIT 1',
            [sectionKey]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy section Intro' });
        }

        // Thư viện mysql2 sẽ tự động chuyển đổi cột JSON thành JavaScript Object, 
        // nên ta không cần dùng JSON.parse() ở đây nữa.
        res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            data: rows[0]
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// ==========================================
// API POST: Tạo mới hoặc Cập nhật section Intro
// ==========================================
// ==========================================
// API POST: Tạo mới hoặc Cập nhật section Intro
// ==========================================
app.post('/api/sections/intro', async (req, res) => {
    try {
        const { section_name, content } = req.body;
        const sectionKey = 'intro';

        // 1. Kiểm tra dữ liệu đầu vào
        if (!section_name || !content) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ section_name và content' });
        }

        // 2. Định nghĩa jsonContent (ĐÂY LÀ PHẦN BỊ THIẾU GÂY RA LỖI)
        // Chuyển đổi content (đang là Object) thành chuỗi JSON để lưu vào MySQL
        const jsonContent = JSON.stringify(content);

        // 3. Câu lệnh SQL (Cách 1: Tương thích mọi phiên bản MySQL)
        const query = `
            INSERT INTO cms_section (section_key, section_name, content) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            section_name = ?, 
            content = ?
        `;

        // 4. Thực thi câu lệnh với 5 tham số (3 cho INSERT, 2 cho UPDATE)
        const [result] = await dbPool.query(query, [
            sectionKey, section_name, jsonContent, // Cho phần INSERT
            section_name, jsonContent              // Cho phần UPDATE
        ]);

        // 5. Trả về kết quả
        res.status(200).json({
            message: 'Đã lưu section Intro thành công',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});