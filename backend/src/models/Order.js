const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number,
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    packagingFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  pickupDetails: {
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    customerName: String,
    customerPhone: String,
    specialInstructions: String,
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['online', 'cash'],
      default: 'online',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: String,
  }],
}, {
  timestamps: true,
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ vendorId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
