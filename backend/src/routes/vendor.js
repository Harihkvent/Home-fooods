const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getVendorOrders,
  updateOrderStatus,
  getSettings,
  updateSettings,
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('vendor'));

router.get('/dashboard', getDashboard);
router.get('/orders', getVendorOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
