import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../../services';
import { setCart, removeItem, updateItemQuantity } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      dispatch(setCart(data.cart));
    } catch (error) {
      toast.error('Error loading cart');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      handleRemove(itemId);
      return;
    }

    // Extract just the ID string if it's an object
    const menuItemId = typeof itemId === 'object' ? itemId._id : itemId;

    // Prevent multiple simultaneous updates
    if (updating[menuItemId]) return;
    
    setUpdating(prev => ({ ...prev, [menuItemId]: true }));
    
    try {
      // Update UI immediately for better UX
      dispatch(updateItemQuantity({ menuItemId, quantity }));
      
      // Then sync with backend
      const response = await cartService.updateCartItem(menuItemId, quantity);
      
      // Update from server response to ensure sync
      if (response.success) {
        dispatch(setCart(response.cart));
      }
    } catch (error) {
      // Revert on error
      const errorMsg = error.response?.data?.message || 'Error updating cart';
      toast.error(errorMsg);
      fetchCart(); // Refetch to sync
    } finally {
      setUpdating(prev => ({ ...prev, [menuItemId]: false }));
    }
  };

  const handleRemove = async (itemId) => {
    // Extract just the ID string if it's an object
    const menuItemId = typeof itemId === 'object' ? itemId._id : itemId;
    
    try {
      await cartService.removeFromCart(menuItemId);
      dispatch(removeItem(menuItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container empty-cart">
        <h2>Your cart is empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/menu')}>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => {
              const itemId = typeof item.menuItemId === 'object' ? item.menuItemId._id : item.menuItemId;
              return (
                <div key={itemId} className="cart-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-image">🍽️</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                  <div className="item-quantity">
                    <button 
                      onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
                      disabled={updating[itemId] || item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
                      disabled={updating[itemId]}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-subtotal">
                    ₹{item.subtotal}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(itemId)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
