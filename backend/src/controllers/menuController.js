const MenuItem = require('../models/MenuItem');
const VendorSettings = require('../models/VendorSettings');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, isVegetarian, search, page = 1, limit = 10 } = req.query;

    const query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    if (isVegetarian === 'true') {
      query['dietaryInfo.isVegetarian'] = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const items = await MenuItem.find(query)
      .populate('vendorId', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalCount = await MenuItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('vendorId', 'name email phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private (Vendor only)
exports.createMenuItem = async (req, res, next) => {
  try {
    req.body.vendorId = req.user.id;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }

    const item = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Vendor only)
exports.updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    // Make sure user is item owner
    if (item.vendorId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }

    item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Vendor only)
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    // Make sure user is item owner
    if (item.vendorId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vendor's menu items
// @route   GET /api/menu/vendor/my-items
// @access  Private (Vendor only)
exports.getVendorMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ vendorId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};
