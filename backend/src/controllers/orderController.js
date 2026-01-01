const Order = require('../models/Order');
const Cart = require('../models/Cart');
const VendorSettings = require('../models/VendorSettings');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const { sendOrderConfirmation } = require('../utils/emailService');

// @desc    Create order
// @route   POST /api/orders/create
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { pickupDetails, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Get vendor settings for pricing
    const vendorId = cart.items[0].menuItemId.vendorId || req.body.vendorId;
    const vendorSettings = await VendorSettings.findOne({ vendorId });

    const subtotal = cart.totalAmount;
    const packagingFee = vendorSettings?.packagingFee || 0;
    const tax = (subtotal * (vendorSettings?.taxRate || 0)) / 100;
    const total = subtotal + packagingFee + tax;

    // Create Razorpay order if payment method is online
    let razorpayOrder = null;
    if (paymentMethod === 'online') {
      const options = {
        amount: Math.round(total * 100), // amount in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      };

      try {
        razorpayOrder = await razorpay.orders.create(options);
      } catch (error) {
        console.error('Razorpay error:', error);
        return res.status(500).json({
          success: false,
          message: 'Error creating payment order',
        });
      }
    }

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      vendorId: vendorId,
      items: cart.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      pricing: {
        subtotal,
        tax,
        packagingFee,
        total,
      },
      pickupDetails: {
        ...pickupDetails,
        customerName: req.user.name,
        customerPhone: req.user.phone,
      },
      paymentDetails: {
        method: paymentMethod,
        status: paymentMethod === 'cash' ? 'pending' : 'pending',
        razorpayOrderId: razorpayOrder?.id,
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order created',
      }],
    });

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      order,
      razorpayOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/orders/verify-payment
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify signature
    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpaySignature === expectedSign) {
      order.paymentDetails.status = 'completed';
      order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
      order.paymentDetails.razorpaySignature = razorpaySignature;
      order.paymentDetails.paidAt = new Date();
      order.status = 'confirmed';
      order.statusHistory.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Payment completed',
      });

      await order.save();

      // Send confirmation email
      try {
        await sendOrderConfirmation(order, req.user);
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order,
      });
    } else {
      order.paymentDetails.status = 'failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('vendorId', 'name email phone');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('vendorId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order owner or vendor
    if (
      order.userId._id.toString() !== req.user.id &&
      order.vendorId._id.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Make sure user is order owner
    if (order.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Check if order can be cancelled
    if (['preparing', 'ready', 'completed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: req.body.reason || 'Cancelled by customer',
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};
