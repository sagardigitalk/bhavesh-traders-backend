const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');

router.route('/').get(getBanners).post(protect, admin, createBanner);
router
  .route('/:id')
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

module.exports = router;

