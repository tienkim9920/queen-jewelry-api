const dbPool = require('../config/db');

// 1. Lấy tất cả sản phẩm (Có kèm tên danh mục để hiển thị lên bảng)
const getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.name, p.description, p.price, p.discount_price, 
                   p.category_id, p.images, p.is_active, p.created_at,
                   c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;
        const [rows] = await dbPool.query(query);

        // Parse trường images từ chuỗi JSON thành Array trước khi trả về Client
        const formattedProducts = rows.map(prod => ({
            ...prod,
            images: typeof prod.images === 'string' ? JSON.parse(prod.images) : prod.images
        }));

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            data: formattedProducts
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 2. Lấy chi tiết một sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM products WHERE id = ? LIMIT 1';
        const [rows] = await dbPool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        const product = rows[0];
        product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;

        res.status(200).json({
            success: true,
            message: 'Lấy chi tiết sản phẩm thành công',
            data: product
        });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 3. Tạo mới sản phẩm
const createProduct = async (req, res) => {
    try {
        const { name, description, price, discount_price, category_id, images, is_active } = req.body;

        if (!name || price === undefined || !category_id) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ name, price và category_id' });
        }

        // Chuyển mảng images thành chuỗi JSON để lưu vào DB (Ví dụ: ["img1.jpg", "img2.jpg"])
        const jsonImages = JSON.stringify(images || []);

        const query = `
            INSERT INTO products (name, description, price, discount_price, category_id, images, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await dbPool.query(query, [
            name,
            description || null,
            price,
            discount_price || null,
            category_id,
            jsonImages,
            is_active !== undefined ? is_active : 1
        ]);

        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm mới thành công',
            data: { id: result.insertId, name }
        });
    } catch (error) {
        console.error('Lỗi khi tạo sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 4. Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, discount_price, category_id, images, is_active } = req.body;

        if (!name || price === undefined || !category_id) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ name, price và category_id' });
        }

        const jsonImages = JSON.stringify(images || []);

        const query = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, discount_price = ?, category_id = ?, images = ?, is_active = ? 
            WHERE id = ?
        `;
        const [result] = await dbPool.query(query, [
            name, description, price, discount_price, category_id, jsonImages, is_active, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để cập nhật' });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật sản phẩm thành công'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 5. Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM products WHERE id = ?';
        const [result] = await dbPool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};