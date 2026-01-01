const express = require('express');
const router = express.Router();
const VendorSettings = require('../models/VendorSettings');
const Order = require('../models/Order');

// @desc    Get available pickup slots
// @route   GET /api/pickup-slots
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { date, vendorId } = req.query;

    if (!date || !vendorId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date and vendorId',
      });
    }

    const vendorSettings = await VendorSettings.findOne({ vendorId });

    if (!vendorSettings || !vendorSettings.acceptingOrders) {
      return res.status(400).json({
        success: false,
        message: 'Vendor is not accepting orders',
      });
    }

    const requestedDate = new Date(date);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Check if vendor is open on that day
    const businessDay = vendorSettings.businessHours.find(bh => bh.day === dayName);

    if (!businessDay || !businessDay.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'Vendor is closed on this day',
      });
    }

    // Check if date is a holiday
    const isHoliday = vendorSettings.holidays.some(
      holiday => holiday.toDateString() === requestedDate.toDateString()
    );

    if (isHoliday) {
      return res.status(400).json({
        success: false,
        message: 'Vendor is closed on this date',
      });
    }

    // Get existing orders for that date
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingOrders = await Order.find({
      vendorId,
      'pickupDetails.date': { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] },
    });

    // Calculate availability for each slot
    const slots = vendorSettings.pickupSlots.map(slot => {
      const slotOrders = existingOrders.filter(
        order => order.pickupDetails.timeSlot === `${slot.startTime} - ${slot.endTime}`
      );

      return {
        timeSlot: `${slot.startTime} - ${slot.endTime}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxOrders: slot.maxOrders,
        bookedOrders: slotOrders.length,
        available: slotOrders.length < slot.maxOrders,
        remainingCapacity: slot.maxOrders - slotOrders.length,
      };
    });

    res.status(200).json({
      success: true,
      date: requestedDate,
      slots,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
