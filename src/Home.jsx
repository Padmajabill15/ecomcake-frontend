import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import grbGhee from './images/grb-ghee-cow-449794_l.jpg';
import Daawat from './images/daawat_biriyani_basmati_rice.webp';
import Fortune from './images/Fortune_oil.webp';
import GRBhome from './images/GRB_home.jpg';
import GRBAuth from './images/grb_ghee_food.jpg';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('featured');
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation for cake items
  useEffect(() => {
    const cakeItems = document.querySelectorAll('.cake-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
      });
    }, { threshold: 0.1 });

    cakeItems.forEach(item => observer.observe(item));

    return () => cakeItems.forEach(item => observer.unobserve(item));
  }, [activeCategory]);

  // update floating cart count from server (if logged in) or localStorage
  useEffect(() => {
    let mounted = true;

    const updateCount = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/getcartProduct', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) {
            if (mounted) setCartCount(0);
            return;
          }
          const data = await res.json();
          const count = Array.isArray(data) ? data.reduce((s, it) => s + (it.quantity || it.qunatity || 1), 0) : 0;
          if (mounted) setCartCount(count);
        } catch (e) {
          if (mounted) setCartCount(0);
        }
      } else {
        try {
          const localCart = JSON.parse(localStorage.getItem('cart')) || [];
          const count = Array.isArray(localCart) ? localCart.reduce((s, it) => s + (it.quantity || it.qunatity || 1), 0) : 0;
          if (mounted) setCartCount(count);
        } catch (e) {
          if (mounted) setCartCount(0);
        }
      }
    };

    updateCount();

    const onStorage = () => updateCount();
    window.addEventListener('storage', onStorage);
    const interval = setInterval(updateCount, 5000);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  const cakes = {
    featured: [
      { id: 1, name: 'GRB Ghee', price: 856, image: grbGhee },
      { id: 2, name: 'Daawat Basmati Rice', price: 112, image: Daawat },
      { id: 3, name: 'Fortune', price: 175, image: Fortune },
    ],
    birthday: [
      { id: 4, name: 'Birthday Blast', price: 39.99, image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
      { id: 5, name: 'Rainbow Surprise', price: 44.99, image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    ],
    wedding: [
      { id: 6, name: 'Elegant Wedding', price: 199.99, image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
      { id: 7, name: 'Royal Tier', price: 299.99, image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    ]
  };

  return (
    <div className="cake-shop-homepage">
      {/* Hero Section with Floating Navigation */}
      <header className={`hero-section ${isScrolled ? 'scrolled' : ''}`}>
        {/* <div className="floating-nav">
          <button 
            className={`floating-nav-item ${activeCategory === 'featured' ? 'active' : ''}`}
            onClick={() => setActiveCategory('featured')}
          >
            Featured
          </button>
          <button 
            className={`floating-nav-item ${activeCategory === 'birthday' ? 'active' : ''}`}
            onClick={() => setActiveCategory('birthday')}
          >
            Birthday
          </button>
          <button 
            className={`floating-nav-item ${activeCategory === 'wedding' ? 'active' : ''}`}
            onClick={() => setActiveCategory('wedding')}
          >
            Wedding
          </button>
          <button className="floating-nav-item cart-btn">
            <i className="bi bi-cart-fill"></i>
          </button>
        </div> */}
        
        <div className="hero-content text-center">
          <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">Sign of Purity</h1>
          <p className="lead animate__animated animate__fadeIn animate__delay-1s">
            Pure GRB ghee, crafted with care from the finest ingredients for rich taste and authentic aroma
          </p>
          <button className="btn btn-primary btn-lg mt-3 animate__animated animate__fadeIn animate__delay-2s" onClick={() => navigate('/pdisplay')}>
            Order Now
          </button>
        </div>
        
        <div className="hero-scroll-indicator animate__animated animate__bounce animate__infinite">
          <i className="bi bi-chevron-down"></i>
        </div>
      </header>

      {/* Cake Gallery Section */}
      <section className="cake-gallery py-5">
        <div className="container">
          <h2 className="text-center mb-5 section-title animate__animated animate__fadeIn">
            Our {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Collection
          </h2>
          
          <div className="row g-4">
            {cakes[activeCategory].map((cake) => (
              <div key={cake.id} className="col-md-4 cake-item" style={{ opacity: 0 }}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div className="cake-image-container">
                    <img 
                      src={cake.image} 
                      className="card-img-top cake-image" 
                      alt={cake.name}
                      loading="lazy"
                    />
                    <div className="cake-overlay">
                      <button className="btn btn-outline-light btn-sm me-2" onClick={() => navigate('/pdisplay')}>
                        <i className="bi bi-eye"></i> View
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/pdisplay')}>
                        <i className="bi bi-cart-plus"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{cake.name}</h5>
                    <p className="card-text text-muted">From ₹{cake.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="special-offer py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
                <div className="offer-content pe-md-5">
                <span className="badge bg-danger mb-3">Limited Time</span>
                <p className="mb-4">Experience the purity of GRB Dawat Ghee. Order now and avail 20% off. Offer valid until the end of this month</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    try {
                      localStorage.setItem('promo', JSON.stringify({ code: '20OFF', percent: 20 }));
                    } catch (e) {
                      console.error('Failed to save promo', e);
                    }
                    navigate('/pdisplay');
                  }}
                >
                  Claim Offer
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <img 
                 src={GRBAuth}
                alt="Custom Cake" 
                className="img-fluid rounded shadow offer-image animate__animated animate__pulse animate__infinite animate__slower"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials
      <section className="testimonials py-5">
        <div className="container">
          <h2 className="text-center mb-5">What Our Customers Say</h2>
          
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                  ))}
                </div>
                <p className="mb-4">"The chocolate cake was absolutely divine! It was the highlight of our party."</p>
                <div className="d-flex align-items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/women/32.jpg" 
                    alt="Customer" 
                    className="rounded-circle me-3" 
                    width="50"
                  />
                  <div>
                    <h6 className="mb-0">Sarah Johnson</h6>
                    <small className="text-muted">New York</small>
                  </div>
                </div>
              </div>
            </div> */}
            
            {/* <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                  ))}
                </div>
                <p className="mb-4">"I've ordered three cakes from Sign of Purity and each one has been perfect!"</p>
                <div className="d-flex align-items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/men/45.jpg" 
                    alt="Customer" 
                    className="rounded-circle me-3" 
                    width="50"
                  />
                  <div>
                    <h6 className="mb-0">Michael Chen</h6>
                    <small className="text-muted">Los Angeles</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="d-flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                  ))}
                </div>
                <p className="mb-4">"The wedding cake was stunning and tasted even better than it looked!"</p>
                <div className="d-flex align-items-center">
                  <img 
                    src="https://randomuser.me/api/portraits/women/68.jpg" 
                    alt="Customer" 
                    className="rounded-circle me-3" 
                    width="50"
                  />
                  <div>
                    <h6 className="mb-0">Emily Rodriguez</h6>
                    <small className="text-muted">Chicago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Newsletter
      <section className="newsletter py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-4">Join Our Sweet Community</h2>
          <p className="mb-4">Subscribe to get exclusive offers, cake tips, and more!</p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Your email address" 
                />
                <button className="btn btn-dark" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-dark text-white pt-4">
        <div className="container">
          <div className="row">

            {/* Company & Contact Info */}
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">Akash Agencies</h5>
              <p className="mb-1">
                8RJH+68V, S.B. Temple Rd,<br />
                Halbarga, Brhampur,<br />
                Kalaburagi, Karnataka – 585103
              </p>
              <p className="mb-0">
                Phone: <a href="tel:+919448117516" className="text-white text-decoration-none">
                  +91 94481 17516
                </a>
              </p>
            </div>

            {/* Footer Navigation (no icons) */}
            <div className="col-md-6 mb-3 text-md-end text-center">
              <h5 className="fw-bold">Quick Links</h5>
              <Link className="d-block text-white text-decoration-none mb-1" to="/">
                Home
              </Link>
              <Link className="d-block text-white text-decoration-none mb-1" to="/pdisplay">
                Cakes
              </Link>
              <Link className="d-block text-white text-decoration-none mb-1" to="/AddtoCart">
                Cart
              </Link>
              <Link className="d-block text-white text-decoration-none" to="/Signin">
                Login
              </Link>
            </div>

          </div>

          {/* Bottom center copyright */}
          <div className="row">
            <div className="col-12">
              <hr className="border-secondary" />
              <p className="text-center mb-0 pb-3">
                © 2026 Akash Agencies. All rights reserved.
              </p>
            </div>
          </div>
        </div>
    </footer>

      {/* Floating Cart Button
      <button
        className="floating-cart-btn btn btn-primary rounded-pill shadow-lg"
        onClick={() => navigate('/AddtoCart')}
        aria-label="Open cart"
      >
        <i className="bi bi-cart-fill me-2"></i>
        <span className="badge bg-danger">{cartCount || 0}</span>
      </button> */}

      {/* Add the animate.css CDN in your public/index.html */}
      <style jsx>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
        
        .cake-shop-homepage {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }
        
        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                      url(${GRBhome});
          background-size: cover;
          background-position: center;
          color: white;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 0 20px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .hero-section.scrolled {
          padding-top: 80px;
        }
        
        .floating-nav {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          background: rgba(255, 255, 255, 0.9);
          padding: 10px 20px;
          border-radius: 50px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .floating-nav.scrolled {
          top: 10px;
          padding: 8px 15px;
        }
        
        .floating-nav-item {
          background: none;
          border: none;
          padding: 8px 15px;
          margin: 0 5px;
          border-radius: 20px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .floating-nav-item:hover, .floating-nav-item.active {
          background: #ff6b6b;
          color: white;
        }
        
        .cart-btn {
          background: #ff6b6b;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
        }
        
        .hero-scroll-indicator {
          position: absolute;
          bottom: 30px;
          font-size: 2rem;
          animation-duration: 2s;
        }
        
        .cake-gallery {
          background: white;
        }
        
        .section-title {
          position: relative;
          padding-bottom: 15px;
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #ff6b6b;
        }
        
        .cake-image-container {
          position: relative;
          overflow: hidden;
          background-cover:cover;
          height: 250px;
          }
          
        .cake-image {
          
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .cake-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .cake-item:hover .cake-overlay {
          opacity: 1;
        }
        
        .cake-item:hover .cake-image {
          transform: scale(1.1);
        }
        
        .special-offer {
          position: relative;
          overflow: hidden;
        }
        
        .offer-image {
          transform: rotate(-5deg);
          border: 10px solid white;
        }
        
        .testimonials .card {
          transition: transform 0.3s ease;
        }
        
        .testimonials .card:hover {
          transform: translateY(-10px);
        }
        
        .floating-cart-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .newsletter {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
        }
        
        @media (max-width: 768px) {
          .floating-nav {
            padding: 8px 10px;
          }
          
          .floating-nav-item {
            padding: 5px 10px;
            font-size: 0.9rem;
          }
          
          .hero-content h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;