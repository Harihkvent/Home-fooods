import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    isVegetarian: false,
    search: '',
  },
  selectedItem: null,
  totalCount: 0,
  currentPage: 1,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setMenuItems: (state, action) => {
      state.items = action.payload.items;
      state.totalCount = action.payload.totalCount;
      state.currentPage = action.payload.currentPage;
      state.loading = false;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
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
  setMenuItems,
  setSelectedItem,
  setFilters,
  setError,
  clearError,
} = menuSlice.actions;
export default menuSlice.reducer;
