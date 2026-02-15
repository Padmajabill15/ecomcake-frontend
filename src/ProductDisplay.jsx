import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';
import { Link } from 'react-router-dom';
import './ProductDisplay.css';

function ProductDisplay() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ctgry, setCtgry] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentFilters, setCurrentFilters] = useState({ minPrice: 0, maxPrice: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const getProducts = async () => {
    let response = await fetch(`${API_BASE_URL}/displayProducts`);
    let result = await response.json();
    setProducts(result);
    setFilteredProducts(result);

    const maxProductPrice = Math.max(...result.map(p => p.price), 0);
    setPriceRange({
      min: 0,
      max: Math.ceil(maxProductPrice / 100) * 100
    });
    setCurrentFilters({
      minPrice: 0,
      maxPrice: Math.ceil(maxProductPrice / 100) * 100
    });

    setQuantities(result.reduce((acc, product) => {
      acc[product.productsid] = 1;
      return acc;
    }, {}));
  };

  const getcatgry = async () => {
    let response = await fetch(`${API_BASE_URL}/allcatgoys`);
    let result = await response.json();
    setCtgry([{ categoeryname: "All" }, ...result]);
  };

  useEffect(() => {
    getProducts();
    getcatgry();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, currentFilters, products]);

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.categoeryname === selectedCategory);
    }

    filtered = filtered.filter(p =>
      p.price >= currentFilters.minPrice &&
      p.price <= currentFilters.maxPrice
    );

    setFilteredProducts(filtered);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setCurrentFilters(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const incrementQty = (id) => {
    setQuantities(prev => {
      const newQty = prev[id] + 1;
      if (newQty > 10) {
        const whatsappLink = 'https://wa.me/919448117516?text=Hello, I want to order more than 10 items per product.';
        alert(`Max 10 items per product.\n\nFor bulk orders (>10 items), please contact:\n📞 9448117516\n\nOr message us on WhatsApp below.`);
        window.open(whatsappLink, '_blank');
        return prev; // do not update
      }
      return { ...prev, [id]: newQty };
    });
  };

  const decrementQty = (id) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));
  };

  const addtocartHandler = async (product) => {
    let quantity = quantities[product.productsid] || 1;

    // Check quantity limit
    if (quantity > 10) {
      const whatsappLink = 'https://wa.me/919448117516?text=Hello, I want to order more than 10 items per product.';
      alert(`Max 10 items per product.\n\nFor bulk orders (>10 items), please contact:\n📞 9448117516\n\nOr message us on WhatsApp.`);
      window.open(whatsappLink, '_blank');
      return; // prevent adding to cart
    }

    let token = localStorage.getItem("token");

    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let exitingElement = cart.findIndex(item => item.productsid === product.productsid);

      if (exitingElement === -1) {
        cart.push({ ...product, quantity: quantity });
      } else {
        cart[exitingElement].quantity += quantity;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.productsname} added to cart!`);
    } else {
      let cartItems = { ...product, qunatity: quantity };
      await fetch(`${API_BASE_URL}/addtocarts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify([cartItems])
      });
      alert(`${product.productsname} added to your account cart!`);
    }
  };

  return (
    <div className="cake-shop-container">
      {/* Hero Banner */}
      <div className="cake-hero-banner">
        <div className="cake-hero-content">
          <h1>Sign of Purity</h1>
          <p>Pure GRB ghee, crafted with care from the finest ingredients for rich taste and authentic aroma</p>
        </div>
      </div>

      <div className="container cake-product-container">
        {/* Mobile Filter Toggle */}
        <div className="d-md-none mb-4">
          <button
            className="btn btn-pink w-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className={`col-md-3 mb-4 ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
            <div className="cake-filter-card">
              <h4 className="filter-title">
                <i className="bi bi-funnel me-2"></i>
                Filter Products
              </h4>

              <div className="mb-4">
                <label className="filter-label">Category</label>
                <div className="category-list">
                  {ctgry.map((cat, index) => (
                    <button
                      key={index}
                      className={`category-btn ${selectedCategory === cat.categoeryname ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.categoeryname)}
                    >
                      {cat.categoeryname}
                    </button>
                  ))}
                </div>
              </div>

              {/* <div className="mb-3">
                <label className="filter-label">Price Range</label>
                <div className="d-flex justify-content-between mb-2">
                  <span>₹{currentFilters.minPrice}</span>
                  <span>₹{currentFilters.maxPrice}</span>
                </div>
                <div className="price-sliders">
                  <input
                    type="range"
                    className="form-range"
                    min={priceRange.min}
                    max={priceRange.max}
                    name="minPrice"
                    value={currentFilters.minPrice}
                    onChange={handlePriceChange}
                  />
                  <input
                    type="range"
                    className="form-range"
                    min={priceRange.min}
                    max={priceRange.max}
                    name="maxPrice"
                    value={currentFilters.maxPrice}
                    onChange={handlePriceChange}
                  />
                </div>
              </div> */}

              {/* <button 
                className="btn btn-outline-pink w-100"
                onClick={() => {
                  setSelectedCategory("All");
                  setCurrentFilters({
                    minPrice: priceRange.min,
                    maxPrice: priceRange.max
                  });
                }}
              >
                Reset Filters
              </button> */}
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-md-9">
            {filteredProducts.length > 0 ? (
              <div className="row cake-products-grid">
                {filteredProducts.map((product) => (
                  <div className='col-lg-4 col-md-6 mb-4' key={product.productsid}>
                    <div className="cake-product-card">
                      <div className="cake-badge">
                        {product.categoeryname}
                      </div>
                      <div className="cake-img-container">
                        <img
                          src={`${API_BASE_URL}/upload/${product.imagepath}`}
                          className="cake-img"
                          alt={product.productsname}
                          loading="lazy"
                        />
                        <div className="cake-overlay">
                          <Link
                            to={`/viewProduct/${product.productsid}`}
                            className="btn btn-view"
                          >
                            Quick View
                          </Link>
                        </div>
                      </div>
                      <div className="cake-card-body">
                        <h5 className="cake-title">{product.productsname}</h5>
                        <p className="cake-desc">{product.description || 'Premium products'}</p>

                        <div className="cake-price-qty">
                          <h5 className="cake-price">₹{product.price}</h5>
                          <div className="cake-qty-selector">
                            <button
                              className="qty-btn"
                              onClick={() => decrementQty(product.productsid)}
                            >
                              -
                            </button>
                            <span>{quantities[product.productsid] || 1}</span>
                            <button
                              className="qty-btn"
                              onClick={() => incrementQty(product.productsid)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          className="btn btn-add-to-cart"
                          onClick={() => addtocartHandler(product)}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cake-no-products">
                <div className="cake-icon">
                  <i className="bi bi-emoji-frown"></i>
                </div>
                <h4>No Products found matching your filters</h4>
                <p>Try adjusting your filters or our full collection</p>
                <button
                  className="btn btn-pink"
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentFilters({
                      minPrice: priceRange.min,
                      maxPrice: priceRange.max
                    });
                  }}
                >
                  Show All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDisplay;