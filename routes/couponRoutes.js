const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getActiveOffers,
} = require('../controllers/couponController');

router.post('/validate', validateCoupon);
router.get('/offers/active', getActiveOffers);

router.route('/').get(getCoupons).post(protect, admin, createCoupon);
router
  .route('/:id')
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

module.exports = router;
