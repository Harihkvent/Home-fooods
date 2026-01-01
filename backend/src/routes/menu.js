const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getVendorMenuItems,
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/uploadImage');

router.get('/', getMenuItems);
router.get('/vendor/my-items', protect, authorize('vendor'), getVendorMenuItems);
router.get('/:id', getMenuItem);
router.post('/', protect, authorize('vendor'), upload.array('images', 5), upload.handleMockUpload, createMenuItem);
router.put('/:id', protect, authorize('vendor'), upload.array('images', 5), upload.handleMockUpload, updateMenuItem);
router.delete('/:id', protect, authorize('vendor'), deleteMenuItem);

module.exports = router;
