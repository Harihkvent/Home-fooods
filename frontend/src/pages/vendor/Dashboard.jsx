import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/vendor/dashboard');
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      console.error('Dashboard error:', err);
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Vendor Dashboard</h1>
        <button onClick={() => navigate('/vendor/menu')} className="btn btn-primary">
          Manage Menu
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-revenue">
          <div className="stat-icon">₹</div>
          <div className="stat-content">
            <h3>{stats ? formatCurrency(stats.totalRevenue) : '₹0'}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card stat-orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats?.pendingOrders || 0}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card stat-completed">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>{stats?.completedOrders || 0}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card stat-menu">
          <div className="stat-icon">🍽️</div>
          <div className="stat-content">
            <h3>{stats?.totalMenuItems || 0}</h3>
            <p>Menu Items</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button onClick={() => navigate('/vendor/orders')} className="btn btn-outline">
            View All
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                    </td>
                    <td>
                      <div>
                        <div>{order.userId?.name}</div>
                        <small>{order.userId?.phone}</small>
                      </div>
                    </td>
                    <td>{order.items?.length || 0} items</td>
                    <td>
                      <strong>{formatCurrency(order.pricing?.total || 0)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/vendor/orders/${order._id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
