import React, { useEffect, useState } from 'react';
import { menuService } from '../../services';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import './Menu.css';

const Menu = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchMenuItems();
  }, [filters]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await menuService.getMenuItems(filters);
      setItems(data.items);
    } catch (error) {
      toast.error('Error loading menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await import('../../services').then(({ cartService }) => 
        cartService.addToCart(item._id, 1)
      );
      dispatch(addItem({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.images[0],
        subtotal: item.price,
      }));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="menu-page">
      <div className="container">
        <h1>Our Menu</h1>
        
        <div className="menu-filters">
          <input
            type="text"
            placeholder="Search menu items..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
            <option value="desserts">Desserts</option>
          </select>
        </div>

        <div className="menu-grid">
          {items.length === 0 ? (
            <p className="no-items">No menu items available yet.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="menu-card">
                <div className="menu-image">
                  {item.images[0] ? (
                    <img src={item.images[0]} alt={item.name} />
                  ) : (
                    <div className="no-image">🍽️</div>
                  )}
                  {!item.isAvailable && (
                    <div className="unavailable-badge">Not Available</div>
                  )}
                </div>
                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p className="menu-description">{item.description}</p>
                  <div className="menu-footer">
                    <span className="menu-price">₹{item.price}</span>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? 'Add to Cart' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
