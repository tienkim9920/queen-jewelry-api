const express = require('express');
const app = express();
const port = 3005;

// Nạp các Routes
const sectionRoutes = require('./routes/sectionRoutes');

// Middleware
app.use(express.json());

// Gắn các routes vào ứng dụng với tiền tố '/api/sections'
app.use('/api/sections', sectionRoutes);

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});