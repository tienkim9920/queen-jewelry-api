const dbPool = require('../config/db');

// Lấy thông tin section Intro
const getIntroSection = async (req, res) => {
    try {
        const sectionKey = 'intro';
        const [rows] = await dbPool.query(
            'SELECT id, section_key, section_name, content, created_at, updated_at FROM cms_section WHERE section_key = ? LIMIT 1',
            [sectionKey]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy section Intro' });
        }

        res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            data: rows[0]
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Tạo mới hoặc Cập nhật section Intro
const upsertIntroSection = async (req, res) => {
    try {
        const { section_name, content } = req.body;
        const sectionKey = 'intro';

        if (!section_name || !content) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ section_name và content' });
        }

        const jsonContent = JSON.stringify(content);

        const query = `
            INSERT INTO cms_section (section_key, section_name, content) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            section_name = ?, 
            content = ?
        `;

        const [result] = await dbPool.query(query, [
            sectionKey, section_name, jsonContent,
            section_name, jsonContent
        ]);

        res.status(200).json({
            message: 'Đã lưu section Intro thành công',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// ==========================================
// Lấy thông tin section Hero
// ==========================================
const getHeroSection = async (req, res) => {
    try {
        const sectionKey = 'hero'; // Đặt key riêng cho Hero
        const [rows] = await dbPool.query(
            'SELECT id, section_key, section_name, content, created_at, updated_at FROM cms_section WHERE section_key = ? LIMIT 1',
            [sectionKey]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy section Hero' });
        }

        res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            data: rows[0]
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// ==========================================
// Tạo mới hoặc Cập nhật section Hero
// ==========================================
const upsertHeroSection = async (req, res) => {
    try {
        const { section_name, content } = req.body;
        const sectionKey = 'hero'; // Đặt key riêng cho Hero

        if (!section_name || !content) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ section_name và content' });
        }

        const jsonContent = JSON.stringify(content);

        const query = `
            INSERT INTO cms_section (section_key, section_name, content) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            section_name = ?, 
            content = ?
        `;

        const [result] = await dbPool.query(query, [
            sectionKey, section_name, jsonContent,
            section_name, jsonContent
        ]);

        res.status(200).json({
            message: 'Đã lưu section Hero thành công',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
}

// ==========================================
// Lấy thông tin section Product
// ==========================================
const getProductSection = async (req, res) => {
    try {
        const sectionKey = 'product'; // Đặt key cho Product
        const [rows] = await dbPool.query(
            'SELECT id, section_key, section_name, content, created_at, updated_at FROM cms_section WHERE section_key = ? LIMIT 1',
            [sectionKey]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy section Product' });
        }

        res.status(200).json({
            message: 'Lấy dữ liệu thành công',
            data: rows[0]
        });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// ==========================================
// Tạo mới hoặc Cập nhật section Product
// ==========================================
const upsertProductSection = async (req, res) => {
    try {
        const { section_name, content } = req.body;
        const sectionKey = 'product'; // Đặt key cho Product

        if (!section_name || !content) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ section_name và content' });
        }

        // Validate cấu trúc content từ React state gửi lên
        if (!content.sectionTitle || !Array.isArray(content.products)) {
            return res.status(400).json({
                message: 'Cấu trúc content không hợp lệ. Yêu cầu có sectionTitle và mảng products.'
            });
        }

        const jsonContent = JSON.stringify(content);

        const query = `
            INSERT INTO cms_section (section_key, section_name, content) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            section_name = ?, 
            content = ?
        `;

        const [result] = await dbPool.query(query, [
            sectionKey, section_name, jsonContent,
            section_name, jsonContent
        ]);

        res.status(200).json({
            message: 'Đã lưu section Product thành công',
            affectedRows: result.affectedRows
        });
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xuất các hàm ra để dùng ở file routes
module.exports = {
    getIntroSection,
    upsertIntroSection,
    getHeroSection,
    upsertHeroSection,
    getProductSection,
    upsertProductSection,
};