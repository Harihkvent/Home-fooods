import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../../redux/slices/authSlice';
import { authService } from '../../services';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <h2>🍕 Home Foods</h2>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'vendor' ? (
                <>
                  <Link to="/vendor/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/vendor/menu" className="nav-link">My Menu</Link>
                  <Link to="/vendor/orders" className="nav-link">Orders</Link>
                </>
              ) : (
                <>
                  <Link to="/cart" className="nav-link cart-link">
                    <FaShoppingCart />
                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                  </Link>
                  <Link to="/orders" className="nav-link">My Orders</Link>
                </>
              )}
              <div className="user-menu">
                <FaUser className="user-icon" />
                <span>{user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
