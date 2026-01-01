import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await api.get('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
};

export const menuService = {
  getMenuItems: async (params) => {
    const response = await api.get('/menu', { params });
    return response.data;
  },

  getMenuItem: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },

  createMenuItem: async (formData) => {
    const response = await api.post('/menu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateMenuItem: async (id, formData) => {
    const response = await api.put(`/menu/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteMenuItem: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },

  getVendorMenuItems: async () => {
    const response = await api.get('/menu/vendor/my-items');
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (menuItemId, quantity) => {
    const response = await api.post('/cart/add', { menuItemId, quantity });
    return response.data;
  },

  updateCartItem: async (menuItemId, quantity) => {
    const response = await api.put('/cart/update', { menuItemId, quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders/create', orderData);
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/orders/verify-payment', paymentData);
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id, reason) => {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  },
};

export const vendorService = {
  getDashboard: async () => {
    const response = await api.get('/vendor/dashboard');
    return response.data;
  },

  getVendorOrders: async (params) => {
    const response = await api.get('/vendor/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status, note) => {
    const response = await api.put(`/vendor/orders/${id}/status`, { status, note });
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/vendor/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await api.put('/vendor/settings', settings);
    return response.data;
  },
};

export const pickupSlotsService = {
  getPickupSlots: async (date, vendorId) => {
    const response = await api.get('/pickup-slots', { params: { date, vendorId } });
    return response.data;
  },
};
