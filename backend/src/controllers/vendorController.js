const Order = require('../models/Order');
const VendorSettings = require('../models/VendorSettings');
const MenuItem = require('../models/MenuItem');
const { sendOrderStatusUpdate } = require('../utils/emailService');

// @desc    Get vendor dashboard stats
// @route   GET /api/vendor/dashboard
// @access  Private (Vendor only)
exports.getDashboard = async (req, res, next) => {
  try {
    const vendorId = req.user.id;

    // Get order counts
    const totalOrders = await Order.countDocuments({ vendorId });
    const pendingOrders = await Order.countDocuments({ vendorId, status: 'pending' });
    const completedOrders = await Order.countDocuments({ vendorId, status: 'completed' });

    // Get revenue
    const revenueData = await Order.aggregate([
      { $match: { vendorId: req.user._id, 'paymentDetails.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get menu item count
    const totalMenuItems = await MenuItem.countDocuments({ vendorId });

    // Get recent orders
    const recentOrders = await Order.find({ vendorId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalMenuItems,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor orders
// @route   GET /api/vendor/orders
// @access  Private (Vendor only)
exports.getVendorOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { vendorId: req.user.id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email phone');

    const totalCount = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/vendor/orders/:id/status
// @access  Private (Vendor only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order vendor
    if (order.vendorId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    await order.save();

    // Send email notification
    try {
      await sendOrderStatusUpdate(order, order.userId, status);
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor settings
// @route   GET /api/vendor/settings
// @access  Private (Vendor only)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await VendorSettings.findOne({ vendorId: req.user.id });

    if (!settings) {
      // Create default settings
      settings = await VendorSettings.create({
        vendorId: req.user.id,
        businessName: req.user.name,
        pickupSlots: [
          { startTime: '10:00', endTime: '11:00', maxOrders: 10 },
          { startTime: '12:00', endTime: '13:00', maxOrders: 10 },
          { startTime: '18:00', endTime: '19:00', maxOrders: 10 },
        ],
        businessHours: [
          { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '21:00' },
          { day: 'sunday', isOpen: false, openTime: '09:00', closeTime: '21:00' },
        ],
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vendor settings
// @route   PUT /api/vendor/settings
// @access  Private (Vendor only)
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await VendorSettings.findOne({ vendorId: req.user.id });

    if (!settings) {
      req.body.vendorId = req.user.id;
      settings = await VendorSettings.create(req.body);
    } else {
      settings = await VendorSettings.findOneAndUpdate(
        { vendorId: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};
