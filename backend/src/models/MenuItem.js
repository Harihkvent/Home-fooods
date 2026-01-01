const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks', 'desserts', 'beverages'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide item price'],
    min: 0,
  },
  images: [{
    type: String,
  }],
  dietaryInfo: {
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot'],
      default: 'mild',
    },
  },
  ingredients: [String],
  allergens: [String],
  preparationTime: {
    type: Number,
    default: 30,
  },
  availableQuantity: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Index for search and filtering
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ category: 1, isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
