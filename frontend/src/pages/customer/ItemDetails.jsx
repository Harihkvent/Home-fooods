import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { cartService } from '../../services';
import { addItem } from '../../redux/slices/cartSlice';
import './ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/menu/${id}`);
      setItem(data.menuItem);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await cartService.addToCart(item._id, quantity);
      const { data } = await cartService.getCart();
      dispatch(addItem({ ...item, quantity, menuItemId: item._id, subtotal: item.price * quantity }));
      setSuccess('Added to cart successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="item-details-container">
        <div className="loading">Loading item details...</div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="item-details-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="item-details-container">
      {success && <div className="alert alert-success">{success}</div>}

      <div className="item-details-content">
        <div className="item-gallery">
          <div className="main-image">
            {item.images && item.images.length > 0 ? (
              <img src={item.images[selectedImage]} alt={item.name} />
            ) : (
              <div className="no-image">🍽️</div>
            )}
          </div>
          {item.images && item.images.length > 1 && (
            <div className="image-thumbnails">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={selectedImage === index ? 'active' : ''}
                />
              ))}
            </div>
          )}
        </div>

        <div className="item-info">
          <div className="item-header">
            <h1>{item.name}</h1>
            {!item.isAvailable && (
              <span className="unavailable-badge">Currently Unavailable</span>
            )}
          </div>

          <div className="item-price">₹{item.price}</div>

          <div className="item-meta">
            <span className="category-badge">{item.category}</span>
            {item.dietaryInfo && item.dietaryInfo.map((info) => (
              <span key={info} className="dietary-badge">{info}</span>
            ))}
          </div>

          <div className="item-description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          {(item.preparationTime || item.servingSize) && (
            <div className="item-details-meta">
              {item.preparationTime && (
                <div className="meta-item">
                  <span className="icon">⏱️</span>
                  <div>
                    <strong>Preparation Time</strong>
                    <p>{item.preparationTime} minutes</p>
                  </div>
                </div>
              )}
              {item.servingSize && (
                <div className="meta-item">
                  <span className="icon">🍴</span>
                  <div>
                    <strong>Serving Size</strong>
                    <p>{item.servingSize}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {item.isAvailable && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary btn-large">
                Add to Cart - ₹{item.price * quantity}
              </button>
            </div>
          )}

          {item.reviews && item.reviews.length > 0 && (
            <div className="reviews-section">
              <h3>Customer Reviews</h3>
              {item.reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <strong>{review.userId?.name || 'Anonymous'}</strong>
                    <span className="rating">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p>{review.comment}</p>
                  <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
