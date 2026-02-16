const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrders,
  getOrderById,
  updateOrderToDelivered,
} = require('../controllers/orderController');

router.route('/').post(addOrderItems).get(getOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/deliver').put(updateOrderToDelivered);

module.exports = router;
