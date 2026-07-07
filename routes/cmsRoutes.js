const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController'); // Chỉnh lại đường dẫn file controller cho đúng với project của bạn
const productController = require('../controllers/productController'); // Import controller product

// Định nghĩa các endpoints cho Bộ API Categories
router.get('/categories', categoryController.getAllCategories);          // Lấy danh sách danh mục
router.get('/categories/:id', categoryController.getCategoryById);       // Lấy chi tiết 1 danh mục
router.post('/categories', categoryController.createCategory);           // Thêm mới danh mục
router.put('/categories/:id', categoryController.updateCategory);        // Sửa danh mục theo ID
router.delete('/categories/:id', categoryController.deleteCategory);     // Xóa danh mục theo ID

// --- API Products (MỚI BỔ SUNG) ---
router.get('/products', productController.getAllProducts);          // Lấy danh sách sản phẩm
router.get('/products/:id', productController.getProductById);       // Chi tiết sản phẩm
router.post('/products', productController.createProduct);           // Thêm sản phẩm
router.put('/products/:id', productController.updateProduct);        // Sửa sản phẩm
router.delete('/products/:id', productController.deleteProduct);     // Xóa sản phẩm

module.exports = router;