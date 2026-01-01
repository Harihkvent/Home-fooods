import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ordersList: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrders: (state, action) => {
      state.ordersList = action.payload;
      state.loading = false;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
    },
    addOrder: (state, action) => {
      state.ordersList.unshift(action.payload);
      state.currentOrder = action.payload;
    },
    updateOrder: (state, action) => {
      const index = state.ordersList.findIndex(
        order => order._id === action.payload._id
      );
      if (index !== -1) {
        state.ordersList[index] = action.payload;
      }
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrder,
  setError,
  clearError,
} = orderSlice.actions;
export default orderSlice.reducer;
