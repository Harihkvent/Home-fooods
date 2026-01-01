const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrder,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);

module.exports = router;
