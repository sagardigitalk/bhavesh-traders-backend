const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getSettings, updateSettings, getPublicSettings } = require('../controllers/settingController');

router.get('/public', getPublicSettings);
router.get('/', protect, admin, getSettings);
router.put('/', protect, admin, updateSettings);

module.exports = router;
