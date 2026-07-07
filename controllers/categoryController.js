const dbPool = require('../config/db');

// 1. Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
    try {
        const [rows] = await dbPool.query(
            'SELECT id, name, slug, created_at FROM categories ORDER BY id DESC'
        );

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            data: rows
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 2. Lấy chi tiết một danh mục theo ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await dbPool.query(
            'SELECT id, name, slug, created_at FROM categories WHERE id = ? LIMIT 1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
        }

        res.status(200).json({
            success: true,
            message: 'Lấy chi tiết danh mục thành công',
            data: rows[0]
        });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết danh mục:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 3. Tạo mới danh mục
const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ name và slug' });
        }

        // Kiểm tra xem slug đã tồn tại chưa để tránh trùng lặp đường dẫn website trang sức
        const [existing] = await dbPool.query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [slug]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Slug này đã tồn tại, vui lòng dùng slug khác' });
        }

        const query = 'INSERT INTO categories (name, slug) VALUES (?, ?)';
        const [result] = await dbPool.query(query, [name, slug]);

        res.status(201).json({
            success: true,
            message: 'Tạo danh mục mới thành công',
            data: {
                id: result.insertId,
                name,
                slug
            }
        });
    } catch (error) {
        console.error('Lỗi khi tạo danh mục:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 4. Cập nhật danh mục
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ name và slug' });
        }

        // Kiểm tra trùng slug với các danh mục khác (ngoại trừ chính nó)
        const [existing] = await dbPool.query(
            'SELECT id FROM categories WHERE slug = ? AND id != ? LIMIT 1',
            [slug, id]
        );
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Slug này đã bị trùng với danh mục khác' });
        }

        const query = 'UPDATE categories SET name = ?, slug = ? WHERE id = ?';
        const [result] = await dbPool.query(query, [name, slug, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục để cập nhật' });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật danh mục thành công'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 5. Xóa danh mục
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Điểm lưu ý cho dự án Trang sức: Bạn nên kiểm tra xem có sản phẩm nào thuộc danh mục này không trước khi xóa
        // Ở đây là câu lệnh xóa trực tiếp:
        const query = 'DELETE FROM categories WHERE id = ?';
        const [result] = await dbPool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục để xóa' });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};