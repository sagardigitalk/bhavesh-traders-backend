const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAdminCustomers,
  getAdminPayments,
  getAdminReports,
  getAdminNotifications,
} = require('../controllers/adminController');

router.get('/customers', protect, admin, getAdminCustomers);
router.get('/payments', protect, admin, getAdminPayments);
router.get('/reports', protect, admin, getAdminReports);
router.get('/notifications', protect, admin, getAdminNotifications);

module.exports = router;
