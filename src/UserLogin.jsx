import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './regitsr.css';

function UserLogin({ updaterole }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dataHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await fetch('http://localhost:5000/userLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let result = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        updaterole(result.role);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length > 0) {
          let cartResponse = await fetch('http://localhost:5000/addtocart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(cart),
          });

          let cartResult = await cartResponse.json();
          if (cartResponse.status === 200) {
            localStorage.removeItem('cart');
          }
          alert(cartResult.message);
          navigate('/AddtoCart');
        } else {
          navigate('/');
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{
      backgroundColor: '#f8f5f2',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-7">
            <div className="card border-0 shadow-sm" style={{
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'rgb(147 51 127 / 40%)'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f3e9e1',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4a373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <h2 style={{
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '8px'
                  }}>Welcome Back</h2>
                  <p style={{
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}>Sign in to your account</p>
                </div>

                <form onSubmit={submitHandler}>
                  {/* Email Input */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label small mb-1" style={{ 
                      color: '#fff',
                      fontWeight: '500'
                    }}>Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0" style={{ color: '#fff' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                        </svg>
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-2"
                        style={{
                          borderColor: '#ddd',
                          borderRadius: '8px',
                          padding: '12px 15px',
                          backgroundColor: '#fff'
                        }}
                        name="email"
                        value={formData.email}
                        onChange={dataHandler}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label small mb-1" style={{ 
                      color: '#fff',
                      fontWeight: '500'
                    }}>Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0" style={{ color: '#fff' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-2"
                        style={{
                          borderColor: '#ddd',
                          borderRadius: '8px',
                          padding: '12px 15px',
                          backgroundColor: '#fff'
                        }}
                        name="password"
                        value={formData.password}
                        onChange={dataHandler}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                        style={{ backgroundColor: '#fff', borderColor: '#d4a373' }}
                      />
                      <label className="form-check-label small" htmlFor="remember" style={{ color: '#fff' }}>
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgotpassword" className="small text-decoration-none" style={{ 
                      color: '#d4a373',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#b58463';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#d4a373';
                    }}>
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn w-100 py-3 fw-bold"
                    style={{
                      backgroundColor: '#d4a373',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      transition: 'all 0.3s',
                      fontSize: '1rem'
                    }}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c38e70';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#d4a373';
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'SIGN IN'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="d-flex align-items-center my-4">
                  <div className="border-top flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.3)' }}></div>
                  <span className="px-2 small" style={{ color: '#fff' }}>OR</span>
                  <div className="border-top flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.3)' }}></div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="small mb-0" style={{ color: '#fff' }}>Don't have an account?</p>
                  <Link to="/Signup" className="small fw-bold text-decoration-none" style={{ 
                    color: '#d4a373',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#b58463';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#d4a373';
                  }}>
                    CREATE ACCOUNT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;