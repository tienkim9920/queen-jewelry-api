const express = require('express');
const cors = require('cors');
const app = express();
const port = 3005;

// BẮT BUỘC: CORS phải là middleware đầu tiên được chạy
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn gửi request trong quá trình dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Tiếp theo là parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nạp các Routes (để sau các middleware cấu hình hệ thống)
const sectionRoutes = require('./routes/sectionRoutes');
app.use('/api/sections', sectionRoutes);

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});