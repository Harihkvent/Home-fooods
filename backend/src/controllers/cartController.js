const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItemId');

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide menuItemId and quantity',
      });
    }

    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Menu item is not available',
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      cart.items[existingItemIndex].subtotal = 
        cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
    } else {
      cart.items.push({
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: parseInt(quantity),
        image: menuItem.images[0] || '',
        subtotal: menuItem.price * parseInt(quantity),
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { menuItemId, quantity } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide menuItemId',
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide quantity',
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const parsedQuantity = parseInt(quantity);

    if (parsedQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = parsedQuantity;
      cart.items[itemIndex].subtotal = 
        cart.items[itemIndex].price * parsedQuantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      item => item.menuItemId.toString() !== req.params.itemId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    next(error);
  }
};
