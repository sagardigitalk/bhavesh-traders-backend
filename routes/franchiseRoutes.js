const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} = require('../controllers/franchiseController');

router
  .route('/')
  .get(protect, admin, getLeads)
  .post(createLead);

router
  .route('/:id')
  .put(protect, admin, updateLead)
  .delete(protect, admin, deleteLead);

module.exports = router;

