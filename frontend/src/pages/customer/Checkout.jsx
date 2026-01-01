import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { clearCart } from '../../redux/slices/cartSlice';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [pickupSlots, setPickupSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    setDefaultDate();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchPickupSlots();
    }
  }, [selectedDate]);

  const setDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  };

  const fetchPickupSlots = async () => {
    try {
      // Get vendor ID from the first menu item
      if (items.length > 0) {
        const menuItemId = items[0].menuItemId;
        const { data: menuData } = await api.get(`/menu/${menuItemId}`);
        const vendorId = menuData.item.vendorId;
        
        if (vendorId && selectedDate) {
          const { data } = await api.get(`/pickup-slots?vendorId=${vendorId}&date=${selectedDate}`);
          setPickupSlots(data.slots || []);
        }
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      // Fallback to default slots
      setPickupSlots([
        { startTime: '10:00', endTime: '11:00', maxOrders: 10, available: true },
        { startTime: '12:00', endTime: '13:00', maxOrders: 10, available: true },
        { startTime: '18:00', endTime: '19:00', maxOrders: 10, available: true },
      ]);
    }
  };

  const calculateTotal = () => {
    const subtotal = totalAmount;
    const packagingFee = 20;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + packagingFee + tax;
    return { subtotal, packagingFee, tax, total };
  };

  const handlePlaceOrder = async () => {
    if (!selectedSlot) {
      setError('Please select a pickup time slot');
      return;
    }

    if (!selectedDate) {
      setError('Please select a pickup date');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Parse the time slot (format: "10:00-11:00")
      const [startTime] = selectedSlot.split('-');
      const pickupDateTime = new Date(`${selectedDate}T${startTime}:00`);

      const orderData = {
        pickupDetails: {
          pickupTime: pickupDateTime.toISOString(),
          timeSlot: selectedSlot,
          specialInstructions: specialInstructions || '',
        },
        paymentMethod: paymentMethod || 'cod',
      };

      const { data } = await api.post('/orders/create', orderData);
      
      // Clear cart in Redux
      dispatch(clearCart());
      
      // Navigate to order details
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      console.error('Order creation error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pricing = calculateTotal();

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-main">
          <h1>Checkout</h1>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="checkout-section">
            <h2>Order Items</h2>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.menuItemId} className="checkout-item">
                  <div>
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">₹{item.subtotal}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <h2>Pickup Details</h2>
            <div className="form-group">
              <label>Pickup Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Pickup Time Slot</label>
              {pickupSlots.length === 0 ? (
                <p className="no-slots">No pickup slots available for this date</p>
              ) : (
                <div className="time-slots">
                  {pickupSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(`${slot.startTime}-${slot.endTime}`)}
                      className={`time-slot ${selectedSlot === `${slot.startTime}-${slot.endTime}` ? 'selected' : ''} ${!slot.available ? 'disabled' : ''}`}
                      disabled={!slot.available}
                    >
                      {slot.startTime} - {slot.endTime}
                      {!slot.available && <span className="full-badge">Full</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests..."
                rows="3"
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Cash on Pickup</strong>
                  <p>Pay when you collect your order</p>
                </div>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Pay Online</strong>
                  <p>Pay securely using Razorpay</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{pricing.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Packaging Fee</span>
              <span>₹{pricing.packagingFee}</span>
            </div>
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{pricing.tax}</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>₹{pricing.total}</strong>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
