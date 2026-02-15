import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

function AddtoCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];

        if (localCart.length > 0 && !token) {
          setCartItems(localCart);
        } else if (token) {
          const response = await fetch(`${API_BASE_URL}/getcartProduct`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemove = async (index) => {
    const token = localStorage.getItem('token');
    const updated = [...cartItems];
    const itemToRemove = updated[index];

    try {
      if (token) {
        const response = await fetch(`${API_BASE_URL}/removecartitem`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productid: itemToRemove.product_id })
        });

        const result = await response.json();

        if (response.ok) {
          updated.splice(index, 1);
          setCartItems(updated);
        } else {
          alert(result.message || 'Failed to remove item from cart.');
        }
      } else {
        updated.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(updated));
        setCartItems(updated);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Something went wrong while removing the item.');
    }
  };

  const handleQuantityChange = async (index, change) => {
    const updated = [...cartItems];
    const newQty = (updated[index].quantity || 1) + change;

    if (newQty < 1) return;

    if (newQty > 10) {
      const whatsappLink = 'https://wa.me/919448117516?text=Hello, I want to order more than 10 items per product.';
      alert(`Max 10 items per product.\n\nFor bulk orders (>10 items), please contact:\n📞 9448117516\n\nOr message us on WhatsApp.`);
      window.open(whatsappLink, '_blank');
      return; // prevent update
    }

    updated[index].quantity = newQty;
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/updatecart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productid: updated[index].product_id,
            quantity: newQty
          })
        });
      } else {
        localStorage.setItem('cart', JSON.stringify(updated));
      }
      setCartItems(updated);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const overallTotalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  const generateBillingNumber = () => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900);
    return `SWEET-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${random}`;
  };

  const handleCheckout = (mode) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to complete your order.");
      navigate('/userlogin');
      return;
    }

    const billNumber = generateBillingNumber();
    localStorage.setItem('billNumber', billNumber);

    navigate('/checkout', {
      state: {
        cartItems,
        total: (overallTotalAmount * 1.18).toFixed(2),
        billNumber,
        paymentMode: mode
      }
    });
  };

  if (loading) {
    return (
      <div className="cake-loading-container">
        <div className="cake-spinner"></div>
        <p>Loading your sweet selections...</p>
      </div>
    );
  }

  return (
    <div className="cake-cart-container">
      {/* Hero Section */}
      <div className="cake-cart-hero">
        <h1>Your Cart</h1>
        <p>Review your Products</p>
      </div>

      <div className="cake-cart-content">
        <div className="cake-cart-items">
          {cartItems.length === 0 ? (
            <div className="cake-empty-cart">
              <div className="cake-empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#ff85a2" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any Products yet</p>
              <Link to="/pdisplay" className="cake-btn cake-btn-primary">
                Browse Our Products
              </Link>
            </div>
          ) : (
            <>
              <h2 className="cake-cart-title">
                <i className="bi bi-cart3 me-2"></i>
                Your Selected Treats ({cartItems.length})
              </h2>

              {cartItems.map((item, index) => {
                const qty = item.quantity || 1;
                const total = item.price * qty;

                return (
                  <div className="cake-cart-item" key={index}>
                    <div className="cake-item-image">
                      <img
                        src={`${API_BASE_URL}/upload/${item.imagepath}`}
                        alt={item.productsname}
                      />
                    </div>

                    <div className="cake-item-details">
                      <h3>{item.productsname}</h3>
                      <p className="cake-item-desc">{item.description || 'Premium Products'}</p>
                      <div className="cake-item-price">₹{Number(item.price).toFixed(2)}</div>

                      <div className="cake-item-actions">
                        <div className="cake-quantity-selector">
                          <button
                            className="cake-qty-btn"
                            onClick={() => handleQuantityChange(index, -1)}
                          >
                            −
                          </button>
                          <span className="cake-qty-display">{qty}</span>
                          <button
                            className="cake-qty-btn"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="cake-remove-btn"
                          onClick={() => handleRemove(index)}
                        >
                          <i className="bi bi-trash"></i> Remove
                        </button>
                      </div>
                    </div>

                    <div className="cake-item-total">
                      ₹{total.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cake-cart-summary">
            <div className="cake-summary-card">
              <h2>Order Summary</h2>

              <div className="cake-summary-row">
                <span>Subtotal:</span>
                <span>₹{overallTotalAmount.toFixed(2)}</span>
              </div>

              <div className="cake-summary-row">
                <span>Delivery:</span>
                <span className="cake-free-delivery">FREE</span>
              </div>

              <div className="cake-summary-row">
                <span>Tax (18%):</span>
                <span>₹{(overallTotalAmount * 0.18).toFixed(2)}</span>
              </div>

              <div className="cake-summary-total">
                <span>Total:</span>
                <span>₹{(overallTotalAmount * 1.18).toFixed(2)}</span>
              </div>

              <button
                className="cake-btn cake-checkout-btn"
                onClick={() => handleCheckout('online')}
              >
                Proceed to Checkout
              </button>

              <Link to="/pdisplay" className="cake-continue-shopping">
                <i className="bi bi-arrow-left"></i> Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddtoCart;