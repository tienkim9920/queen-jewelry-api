const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

// Quản lý các API cho phần Section
// Lưu ý: Tý nữa ở index.js ta sẽ dùng tiền tố '/api/sections', 
// nên ở đây ta chỉ cần viết '/intro' là đủ.

// ==========================================
// Quản lý các API cho phần Intro mới thêm
// ==========================================
router.get('/intro', sectionController.getIntroSection);
router.post('/intro', sectionController.upsertIntroSection);

// ==========================================
// Quản lý các API cho phần Hero mới thêm
// ==========================================
router.get('/hero', sectionController.getHeroSection);
router.post('/hero', sectionController.upsertHeroSection);

module.exports = router;