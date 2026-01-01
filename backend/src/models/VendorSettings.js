const mongoose = require('mongoose');

const vendorSettingsSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  description: String,
  logo: String,
  businessHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: String,
    closeTime: String,
  }],
  pickupSlots: [{
    startTime: String,
    endTime: String,
    maxOrders: {
      type: Number,
      default: 10,
    },
  }],
  minimumOrderAmount: {
    type: Number,
    default: 0,
  },
  packagingFee: {
    type: Number,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  acceptingOrders: {
    type: Boolean,
    default: true,
  },
  holidays: [Date],
  specialNotice: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('VendorSettings', vendorSettingsSchema);
