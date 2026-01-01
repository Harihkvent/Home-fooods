import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaShoppingCart, FaClock, FaStar } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Delicious Home-Cooked Meals</h1>
            <p>Order your favorite food from local home vendors and pick it up at your convenience</p>
            <Link to="/menu" className="btn btn-primary btn-large">
              Browse Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Home Foods?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaUtensils className="feature-icon" />
              <h3>Home-Cooked Quality</h3>
              <p>Authentic home-made food prepared with love and care</p>
            </div>
            <div className="feature-card">
              <FaShoppingCart className="feature-icon" />
              <h3>Easy Ordering</h3>
              <p>Simple and convenient online ordering system</p>
            </div>
            <div className="feature-card">
              <FaClock className="feature-icon" />
              <h3>Flexible Pickup</h3>
              <p>Choose your preferred pickup time that suits you</p>
            </div>
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Quality Assured</h3>
              <p>Fresh ingredients and hygienic preparation</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Browse Menu</h3>
              <p>Explore our delicious food items</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Add to Cart</h3>
              <p>Select your favorites and add to cart</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Schedule Pickup</h3>
              <p>Choose your preferred pickup time</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Pay & Collect</h3>
              <p>Pay online and collect your order</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Start exploring our menu and order your favorite meals today!</p>
          <Link to="/menu" className="btn btn-primary btn-large">
            View Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
