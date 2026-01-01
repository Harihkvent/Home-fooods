import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      accepted: '#17a2b8',
      preparing: '#007bff',
      ready: '#28a745',
      completed: '#28a745',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  const statusSteps = ['pending', 'accepted', 'preparing', 'ready', 'completed'];
  const currentStepIndex = order ? statusSteps.indexOf(order.status) : -1;

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-container">
        <div className="error-message">{error || 'Order not found'}</div>
        <button onClick={() => navigate('/orders')} className="btn btn-primary">
          View All Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <div>
          <h1>Order #{order.orderNumber}</h1>
          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>
        <button onClick={() => navigate('/orders')} className="btn btn-outline">
          ← All Orders
        </button>
      </div>

      {/* Order Status Tracker */}
      {order.status !== 'cancelled' && (
        <div className="status-tracker">
          <h2>Order Status</h2>
          <div className="steps">
            {statusSteps.map((step, index) => (
              <div
                key={step}
                className={`step ${index <= currentStepIndex ? 'active' : ''} ${index === currentStepIndex ? 'current' : ''}`}
              >
                <div className="step-icon" style={{ borderColor: index <= currentStepIndex ? getStatusColor(step) : '#dee2e6' }}>
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <div className="step-label">{step}</div>
                {index < statusSteps.length - 1 && (
                  <div className={`step-line ${index < currentStepIndex ? 'active' : ''}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="alert alert-danger">
          <strong>Order Cancelled</strong>
          <p>This order has been cancelled.</p>
        </div>
      )}

      <div className="order-details-grid">
        {/* Order Items */}
        <div className="details-card">
          <h3>Order Items</h3>
          <div className="items-list">
            {order.items?.map((item, index) => (
              <div key={index} className="item-row">
                <div>
                  <strong>{item.name}</strong>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">{formatCurrency(item.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup Details */}
        <div className="details-card">
          <h3>Pickup Details</h3>
          <div className="info-row">
            <span className="icon">🕒</span>
            <div>
              <strong>Pickup Time</strong>
              <p>{order.pickupTime ? formatDate(order.pickupTime) : 'To be confirmed'}</p>
            </div>
          </div>
          {order.specialInstructions && (
            <div className="info-row">
              <span className="icon">📝</span>
              <div>
                <strong>Special Instructions</strong>
                <p>{order.specialInstructions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="details-card">
          <h3>Payment Summary</h3>
          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.pricing?.subtotal || 0)}</span>
            </div>
            <div className="summary-row">
              <span>Packaging Fee</span>
              <span>{formatCurrency(order.pricing?.packagingFee || 0)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>{formatCurrency(order.pricing?.tax || 0)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>{formatCurrency(order.pricing?.total || 0)}</strong>
            </div>
          </div>
          <div className="payment-method">
            <strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Pickup' : 'Online Payment'}
          </div>
          <div className="payment-status">
            <strong>Payment Status:</strong>
            <span className={`badge badge-${order.paymentDetails?.status === 'completed' ? 'success' : 'warning'}`}>
              {order.paymentDetails?.status || 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
