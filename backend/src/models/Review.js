const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  images: [String],
  vendorResponse: {
    message: String,
    respondedAt: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
reviewSchema.index({ menuItemId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
