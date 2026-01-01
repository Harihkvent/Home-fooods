import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Customer Pages
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import ItemDetails from './pages/customer/ItemDetails';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetails from './pages/customer/OrderDetails';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import MenuManagement from './pages/vendor/MenuManagement';
import VendorOrders from './pages/vendor/VendorOrders';
import Settings from './pages/vendor/Settings';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (role) {
    const user = JSON.parse(userStr);
    if (user.role !== role) {
      return <Navigate to="/" />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<ItemDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Protected Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />

              {/* Vendor Protected Routes */}
              <Route
                path="/vendor/dashboard"
                element={
                  <ProtectedRoute role="vendor">
                    <VendorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/menu"
                element={
                  <ProtectedRoute role="vendor">
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/orders"
                element={
                  <ProtectedRoute role="vendor">
                    <VendorOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/settings"
                element={
                  <ProtectedRoute role="vendor">
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
