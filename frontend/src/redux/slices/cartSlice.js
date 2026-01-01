import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.totalAmount = action.payload.totalAmount;
      state.itemCount = action.payload.items.length;
      state.loading = false;
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(
        item => item.menuItemId === action.payload.menuItemId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.subtotal = existingItem.price * existingItem.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      state.itemCount = state.items.length;
    },
    updateItemQuantity: (state, action) => {
      const item = state.items.find(
        item => item.menuItemId === action.payload.menuItemId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        item.subtotal = item.price * item.quantity;
        state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        item => item.menuItemId !== action.payload
      );
      state.totalAmount = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      state.itemCount = state.items.length;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.itemCount = 0;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  setError,
} = cartSlice.actions;
export default cartSlice.reducer;
