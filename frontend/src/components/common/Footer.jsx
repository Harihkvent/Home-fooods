import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>🍕 Home Foods</h3>
          <p>Your favorite home-cooked meals, just a click away!</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2024 Home Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
