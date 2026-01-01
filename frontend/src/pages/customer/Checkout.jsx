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
    fetchPickupSlots();
    setDefaultDate();
  }, []);

  const setDefaultDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  };

  const fetchPickupSlots = async () => {
    try {
      const vendorId = items[0]?.vendorId;
      if (vendorId) {
        const { data } = await api.get(`/pickupSlots?vendorId=${vendorId}`);
        setPickupSlots(data.slots || []);
      }
    } catch (err) {
      setPickupSlots([
        { startTime: '10:00', endTime: '11:00', maxOrders: 10 },
        { startTime: '12:00', endTime: '13:00', maxOrders: 10 },
        { startTime: '18:00', endTime: '19:00', maxOrders: 10 },
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

    try {
      setLoading(true);
      setError('');

      const pickupDateTime = new Date(`${selectedDate}T${selectedSlot.split('-')[0]}`);

      const orderData = {
        pickupDetails: {
          pickupTime: pickupDateTime,
          specialInstructions,
        },
        paymentMethod,
      };

      const { data } = await api.post('/orders/create', orderData);
      dispatch(clearCart());
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
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
              <div className="time-slots">
                {pickupSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(`${slot.startTime}-${slot.endTime}`)}
                    className={`time-slot ${selectedSlot === `${slot.startTime}-${slot.endTime}` ? 'selected' : ''}`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
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
