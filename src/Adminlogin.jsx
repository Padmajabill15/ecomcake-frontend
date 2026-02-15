import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './regitsr.css';

function Adminlogin({ updaterole }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const dataHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    setError(''); // Clear error on input change
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/admiLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        localStorage.setItem('adminEmail', formData.email); // Store admin email
        updaterole(result.role);
        navigate('/addProducts');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page" style={{
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
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h2 style={{
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '8px'
                  }}>Admin Portal</h2>
                  <p style={{
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}>Akash Agencies</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center" role="alert" style={{
                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                    borderColor: '#e63946',
                    color: '#fff'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e63946" viewBox="0 0 16 16" className="me-2">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={submitHandler}>
                  {/* Email Input */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label small mb-1" style={{ 
                      color: '#fff',
                      fontWeight: '500'
                    }}>Admin Email</label>
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
                        placeholder="admin@sweetdelights.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label small mb-1" style={{ 
                      color: '#fff',
                      fontWeight: '500'
                    }}>Admin Password</label>
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

                  {/* Remember Me */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                        style={{ backgroundColor: '#fff', borderColor: '#d4a373' }}
                      />
                      <label className="form-check-label small" htmlFor="remember" style={{ color: '#fff' }}>
                        Remember this device
                      </label>
                    </div>
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
                        Authenticating...
                      </>
                    ) : (
                      'ACCESS ADMIN DASHBOARD'
                    )}
                  </button>
                </form>

                {/* Security Notice */}
                <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
                  <p className="small mb-0" style={{ color: '#fff' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#d4a373" viewBox="0 0 16 16" className="me-1">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                    Restricted access. Unauthorized attempts are prohibited.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adminlogin;