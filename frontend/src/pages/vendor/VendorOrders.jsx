import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './VendorOrders.css';

const VendorOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await api.get('/vendor/orders', { params });
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/vendor/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
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
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'badge-warning',
      accepted: 'badge-info',
      preparing: 'badge-primary',
      ready: 'badge-success',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    return statusColors[status] || 'badge-secondary';
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: ['accepted', 'cancelled'],
      accepted: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed'],
    };
    return statusFlow[currentStatus] || [];
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="vendor-orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="vendor-orders-container">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="filter-tabs">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`filter-tab ${filter === option.value ? 'active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found for this filter</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <button onClick={() => openOrderModal(order)} className="btn btn-sm btn-primary">
                  Manage
                </button>
              </div>

              <div className="order-customer">
                <h4>👤 {order.userId?.name}</h4>
                <p>📞 {order.userId?.phone}</p>
                <p>📧 {order.userId?.email}</p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items?.map((item, index) => (
                  <div key={index} className="item-row">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-time">
                  <small>🕒 Pickup: {order.pickupTime ? formatDate(order.pickupTime) : 'TBD'}</small>
                  <small>📅 Ordered: {formatDate(order.createdAt)}</small>
                </div>
                <div className="order-total">
                  <strong>Total: {formatCurrency(order.pricing?.total || 0)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Management Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Order #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
            </div>

            <div className="modal-body">
              <div className="order-details">
                <div className="detail-section">
                  <h3>Current Status</h3>
                  <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="detail-section">
                  <h3>Update Status</h3>
                  <div className="status-buttons">
                    {getNextStatusOptions(selectedOrder.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        className={`btn btn-${status === 'cancelled' ? 'danger' : 'success'}`}
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Order Items</h3>
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="detail-row">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="detail-row total">
                    <strong>Total</strong>
                    <strong>{formatCurrency(selectedOrder.pricing?.total || 0)}</strong>
                  </div>
                </div>

                {selectedOrder.specialInstructions && (
                  <div className="detail-section">
                    <h3>Special Instructions</h3>
                    <p>{selectedOrder.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
