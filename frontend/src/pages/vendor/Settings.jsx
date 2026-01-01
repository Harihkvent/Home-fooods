import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/vendor/settings');
      setSettings(data.settings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessInfoChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessHourChange = (index, field, value) => {
    setSettings((prev) => ({
      ...prev,
      businessHours: prev.businessHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour
      ),
    }));
  };

  const handlePickupSlotChange = (index, field, value) => {
    setSettings((prev) => ({
      ...prev,
      pickupSlots: prev.pickupSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const addPickupSlot = () => {
    setSettings((prev) => ({
      ...prev,
      pickupSlots: [
        ...prev.pickupSlots,
        { startTime: '10:00', endTime: '11:00', maxOrders: 10 },
      ],
    }));
  };

  const removePickupSlot = (index) => {
    setSettings((prev) => ({
      ...prev,
      pickupSlots: prev.pickupSlots.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await api.put('/vendor/settings', settings);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="settings-container">
        <div className="error-message">Failed to load settings</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Vendor Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Business Information */}
      <div className="settings-section">
        <h2>Business Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              value={settings.businessName || ''}
              onChange={(e) => handleBusinessInfoChange('businessName', e.target.value)}
              placeholder="Your Business Name"
            />
          </div>

          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="tel"
              value={settings.contactPhone || ''}
              onChange={(e) => handleBusinessInfoChange('contactPhone', e.target.value)}
              placeholder="+91 1234567890"
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => handleBusinessInfoChange('contactEmail', e.target.value)}
              placeholder="business@example.com"
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              value={settings.address || ''}
              onChange={(e) => handleBusinessInfoChange('address', e.target.value)}
              placeholder="Business address..."
              rows="2"
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              value={settings.description || ''}
              onChange={(e) => handleBusinessInfoChange('description', e.target.value)}
              placeholder="Tell customers about your business..."
              rows="3"
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="settings-section">
        <h2>Business Hours</h2>
        <div className="business-hours">
          {settings.businessHours?.map((hour, index) => (
            <div key={hour.day} className="hour-row">
              <div className="day-name">{hour.day.charAt(0).toUpperCase() + hour.day.slice(1)}</div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={hour.isOpen}
                  onChange={(e) => handleBusinessHourChange(index, 'isOpen', e.target.checked)}
                />
                Open
              </label>
              {hour.isOpen && (
                <>
                  <input
                    type="time"
                    value={hour.openTime}
                    onChange={(e) => handleBusinessHourChange(index, 'openTime', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hour.closeTime}
                    onChange={(e) => handleBusinessHourChange(index, 'closeTime', e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pickup Slots */}
      <div className="settings-section">
        <div className="section-header">
          <h2>Pickup Time Slots</h2>
          <button onClick={addPickupSlot} className="btn btn-sm btn-outline">
            + Add Slot
          </button>
        </div>

        <div className="pickup-slots">
          {settings.pickupSlots?.map((slot, index) => (
            <div key={index} className="slot-row">
              <div className="slot-inputs">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handlePickupSlotChange(index, 'startTime', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handlePickupSlotChange(index, 'endTime', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Max Orders</label>
                  <input
                    type="number"
                    value={slot.maxOrders}
                    onChange={(e) => handlePickupSlotChange(index, 'maxOrders', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
              <button
                onClick={() => removePickupSlot(index)}
                className="btn btn-sm btn-danger"
                disabled={settings.pickupSlots.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Settings */}
      <div className="settings-section">
        <h2>Order Settings</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Minimum Order Amount (₹)</label>
            <input
              type="number"
              value={settings.minOrderAmount || 0}
              onChange={(e) => handleBusinessInfoChange('minOrderAmount', parseInt(e.target.value))}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Advance Order Days</label>
            <input
              type="number"
              value={settings.advanceOrderDays || 1}
              onChange={(e) => handleBusinessInfoChange('advanceOrderDays', parseInt(e.target.value))}
              min="0"
              max="30"
            />
            <small>How many days in advance customers can order</small>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.acceptingOrders !== false}
              onChange={(e) => handleBusinessInfoChange('acceptingOrders', e.target.checked)}
            />
            Currently accepting orders
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
