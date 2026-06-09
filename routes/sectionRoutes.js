const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

// Quản lý các API cho phần Section
// Lưu ý: Tý nữa ở index.js ta sẽ dùng tiền tố '/api/sections', 
// nên ở đây ta chỉ cần viết '/intro' là đủ.

// ==========================================
// Quản lý các API cho phần Intro
// ==========================================
router.get('/intro', sectionController.getIntroSection);
router.post('/intro', sectionController.upsertIntroSection);

// ==========================================
// Quản lý các API cho phần Hero 
// ==========================================
router.get('/hero', sectionController.getHeroSection);
router.post('/hero', sectionController.upsertHeroSection);

// ==========================================
// Quản lý các API cho phần Product
// ==========================================
router.get('/product', sectionController.getProductSection);
router.post('/product', sectionController.upsertProductSection);

module.exports = router;