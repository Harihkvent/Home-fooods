import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'active', label: 'Active' },
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
      const { data } = await api.get('/orders', { params });
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
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
      month: 'short',
      year: 'numeric',
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

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="filter-tabs">
          {filterOptions.map((option) => (
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
          <div className="empty-icon">📦</div>
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-items-preview">
                  <strong>Items:</strong>
                  <p>
                    {order.items?.slice(0, 2).map(item => item.name).join(', ')}
                    {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                </div>

                {order.pickupTime && (
                  <div className="order-pickup">
                    <strong>🕒 Pickup:</strong>
                    <p>{formatDate(order.pickupTime)}</p>
                  </div>
                )}

                <div className="order-total">
                  <strong>Total:</strong>
                  <span className="amount">{formatCurrency(order.pricing?.total || 0)}</span>
                </div>
              </div>

              <div className="order-card-footer">
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="btn btn-outline btn-sm"
                >
                  View Details
                </button>
                {order.status === 'completed' && (
                  <button
                    onClick={() => navigate('/menu')}
                    className="btn btn-primary btn-sm"
                  >
                    Order Again
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
