import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './MenuManagement.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'breakfast',
    isAvailable: true,
    preparationTime: '',
    servingSize: '',
    dietaryInfo: [],
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Spicy'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/menu/vendor/my-items');
      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDietaryToggle = (option) => {
    setFormData((prev) => ({
      ...prev,
      dietaryInfo: prev.dietaryInfo.includes(option)
        ? prev.dietaryInfo.filter((item) => item !== option)
        : [...prev.dietaryInfo, option],
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'dietaryInfo') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Menu item updated successfully!');
      } else {
        await api.post('/menu', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccess('Menu item created successfully!');
      }

      fetchMenuItems();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime || '',
      servingSize: item.servingSize || '',
      dietaryInfo: item.dietaryInfo || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/menu/${id}`);
      setSuccess('Menu item deleted successfully!');
      fetchMenuItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.put(`/menu/${item._id}`, {
        isAvailable: !item.isAvailable,
      });
      fetchMenuItems();
    } catch (err) {
      setError('Failed to update availability');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'breakfast',
      isAvailable: true,
      preparationTime: '',
      servingSize: '',
      dietaryInfo: [],
    });
    setImages([]);
    setError('');
  };

  if (loading) {
    return (
      <div className="menu-management-container">
        <div className="loading">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="menu-management-container">
      <div className="menu-header">
        <h1>Menu Management</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Add New Item
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="menu-items-grid">
        {menuItems.length === 0 ? (
          <div className="empty-state">
            <p>No menu items yet. Create your first item!</p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div key={item._id} className="menu-item-card">
              <div className="item-image">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name} />
                ) : (
                  <div className="no-image">🍽️</div>
                )}
                <div className={`availability-badge ${item.isAvailable ? 'available' : 'unavailable'}`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>

              <div className="item-content">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>

                <div className="item-meta">
                  <span className="category-badge">{item.category}</span>
                  {item.dietaryInfo && item.dietaryInfo.map((info) => (
                    <span key={info} className="dietary-badge">{info}</span>
                  ))}
                </div>

                <div className="item-details">
                  <div className="detail">
                    <span>⏱️ {item.preparationTime || 'N/A'} mins</span>
                  </div>
                  <div className="detail">
                    <span>🍴 {item.servingSize || 'N/A'}</span>
                  </div>
                </div>

                <div className="item-footer">
                  <div className="price">₹{item.price}</div>
                  <div className="item-actions">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`btn btn-sm ${item.isAvailable ? 'btn-warning' : 'btn-success'}`}
                      title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    >
                      {item.isAvailable ? '👁️' : '🚫'}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-sm btn-info"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
              <button onClick={handleCloseModal} className="close-btn">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="menu-form">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Butter Chicken"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Describe your dish..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preparation Time (mins)</label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label>Serving Size</label>
                  <input
                    type="text"
                    name="servingSize"
                    value={formData.servingSize}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 pieces, 1 bowl"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dietary Information</label>
                <div className="dietary-options">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.dietaryInfo.includes(option)}
                        onChange={() => handleDietaryToggle(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  {' '}Available for orders
                </label>
              </div>

              <div className="form-group">
                <label>Images (Max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  max="5"
                />
                <small>Upload up to 5 images of your dish</small>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
