const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Xử lý upload file
const path = require('path');     // Xử lý đường dẫn
const fs = require('fs');         // Quản lý file trên ổ đĩa

const app = express();
const port = 3005;

// BẮT BUỘC: CORS phải là middleware đầu tiên được chạy
app.use(cors({
    origin: '*', // Cho phép tất cả các nguồn gửi request trong quá trình dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Tiếp theo là parse JSON body và urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình thư mục 'public' phục vụ file tĩnh (để client xem được ảnh trực tiếp qua URL)
app.use(express.static('public'));

// Cấu hình nơi lưu trữ hình ảnh bằng Multer
const uploadDir = path.join(__dirname, 'public', 'uploads');

// Tự động tạo thư mục 'public/uploads' nếu chưa tồn tại để tránh lỗi hệ thống
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Đặt tên file độc nhất bằng timestamp + số ngẫu nhiên để không bị trùng tên/ghi đè
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Bộ lọc chỉ cho phép upload định dạng hình ảnh hợp lệ
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận các file hình ảnh (jpg, jpeg, png, gif, webp)!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn dung lượng file tối đa là 5MB
});


// ==========================================
// CÁC ROUTE API QUẢN LÝ HÌNH ẢNH (DANH SÁCH, THÊM, XÓA)
// ==========================================

// 1. API Lấy danh sách hình ảnh hiện có
app.get('/api/images', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Không thể đọc thư mục ảnh.' });
        }

        // Lọc ra danh sách các file là hình ảnh hợp lệ
        const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

        // Trả về danh sách tên file kèm URL tương ứng để client hiển thị
        const imageList = images.map(file => ({
            filename: file,
            url: `${req.protocol}://${req.get('host')}/uploads/${file}`
        }));

        res.json({ success: true, data: imageList });
    });
});

// 2. API Thêm (Upload) 1 hình ảnh mới - Sử dụng key form-data tên là 'image'
app.post('/api/images/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn một file ảnh để upload.' });
    }

    res.status(201).json({
        success: true,
        message: 'Tải ảnh lên thành công!',
        data: {
            filename: req.file.filename,
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        }
    });
});

// 3. API Xóa hình ảnh theo tên file truyền vào Body JSON (ví dụ: { "filename": "17100000-123.jpg" })
app.delete('/api/images', (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên file (filename) cần xóa.' });
    }

    const filePath = path.join(uploadDir, filename);

    // Kiểm tra file thực sự có trên ổ đĩa hay không trước khi thực hiện xóa
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'Hình ảnh không tồn tại trên hệ thống.' });
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi xóa file.' });
        }
        res.json({ success: true, message: 'Đã xóa hình ảnh thành công khỏi hệ thống.' });
    });
});


// ==========================================
// ERROR HANDLING MIDDLEWARE & CÁC ROUTE KHÁC
// ==========================================

// Error handling middleware riêng cho lỗi từ Multer (như file quá dung lượng, sai định dạng)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes('Chỉ chấp nhận')) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
});

// Nạp các Routes cũ của dự án (để sau các middleware cấu hình hệ thống)
const sectionRoutes = require('./routes/sectionRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
app.use('/api/sections', sectionRoutes);
app.use('/api/cms', cmsRoutes);

// Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});