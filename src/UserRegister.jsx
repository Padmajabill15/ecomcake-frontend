import React, { useState } from 'react';
import { API_BASE_URL } from './config';
import CityList from './Components/CityList';
import OtpVerification from './Components/OtpVerification';
import { Link, useNavigate } from 'react-router-dom';
import './regitsr.css'
function UserRegister() {
    const [formdata, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        city: "",
    });

    const [errors, setErrors] = useState({});
    const [sentOtp, setSentOtp] = useState(false);
    const [timer, setTimer] = useState(120);
    const [disableResndButton, setDisableResndButton] = useState(true);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const regex = {
        firstName: /^[A-Za-z\s]{2,}$/,
        lastName: /^[A-Za-z\s]{2,}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^.{8,12}$/ // 8-12 characters, any character
    };

    const validate = () => {
        const newErrors = {};

        if (!regex.firstName.test(formdata.firstName)) {
            newErrors.firstName = "First name must be at least 2 letters";
        }

        if (!regex.lastName.test(formdata.lastName)) {
            newErrors.lastName = "Last name must be at least 2 letters";
        }

        if (!regex.email.test(formdata.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!regex.password.test(formdata.password)) {
            newErrors.password = "Password must be 8-12 characters";
        }

        if (!formdata.city) {
            newErrors.city = "Please select your city";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const verifyOtp = async (otp) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/verifyOtp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailid: formdata.email, otp }),
            });

            const result = await response.json();
            if (response.status === 200) {
                alert(result.message);
                navigate('/Signin');
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("An error occurred during verification");
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        setDisableResndButton(true);
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setDisableResndButton(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formDataHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/userRegister`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formdata)
            });

            const result = await response.json();

            if (response.status === 400) {
                alert(result.message);
                return;
            }

            if (response.status === 200) {
                alert(result.message);
                setSentOtp(true);
                setTimer(120);
                startTimer();
            }
        } catch (error) {
            alert("An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    const handleCityData = (cityid) => {
        setFormData(prev => ({ ...prev, city: cityid }));
        setErrors(prev => ({ ...prev, city: "" }));
    };

    return (
        <div className="register-page">

            {!sentOtp ? (
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-md-7">
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
                                        }}>Create Account</h2>
                                        <p style={{
                                            color: '#fff',
                                            fontSize: '0.9rem'
                                        }}>Join our community</p>
                                    </div>

                                    <form onSubmit={submitHandler} noValidate>
                                        <div className="row">
                                            {/* First Name */}
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="firstName" className="form-label small mb-1" style={{
                                                    color: '#fff',
                                                    fontWeight: '500'
                                                }}>First Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                    style={{
                                                        borderColor: errors.firstName ? '#e63946' : '#ddd',
                                                        borderRadius: '8px',
                                                        padding: '12px 15px',
                                                        backgroundColor: errors.firstName ? '#fffafa' : '#fff'
                                                    }}
                                                    name="firstName"
                                                    value={formdata.firstName}
                                                    onChange={formDataHandler}
                                                    placeholder="John"
                                                    required
                                                />
                                                {errors.firstName && <div className="invalid-feedback d-block" style={{
                                                    color: '#e63946',
                                                    fontSize: '0.8rem'
                                                }}>{errors.firstName}</div>}
                                            </div>

                                            {/* Last Name */}
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="lastName" className="form-label small mb-1" style={{
                                                    color: '#fff',
                                                    fontWeight: '500'
                                                }}>Last Name</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                    style={{
                                                        borderColor: errors.lastName ? '#e63946' : '#ddd',
                                                        borderRadius: '8px',
                                                        padding: '12px 15px',
                                                        backgroundColor: errors.lastName ? '#fffafa' : '#fff'
                                                    }}
                                                    name="lastName"
                                                    value={formdata.lastName}
                                                    onChange={formDataHandler}
                                                    placeholder="Doe"
                                                    required
                                                />
                                                {errors.lastName && <div className="invalid-feedback d-block" style={{
                                                    color: '#fff',
                                                    fontSize: '0.8rem'
                                                }}>{errors.lastName}</div>}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label small mb-1" style={{
                                                color: '#fff',
                                                fontWeight: '500'
                                            }}>Email</label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                style={{
                                                    borderColor: errors.email ? '#e63946' : '#ddd',
                                                    borderRadius: '8px',
                                                    padding: '12px 15px',
                                                    backgroundColor: errors.email ? '#fffafa' : '#fff'
                                                }}
                                                name="email"
                                                value={formdata.email}
                                                onChange={formDataHandler}
                                                placeholder="your@email.com"
                                                required
                                            />
                                            {errors.email && <div className="invalid-feedback d-block" style={{
                                                color: '#e63946',
                                                fontSize: '0.8rem'
                                            }}>{errors.email}</div>}
                                        </div>

                                        {/* Password */}
                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label small mb-1" style={{
                                                color: '#fff',
                                                fontWeight: '500'
                                            }}>Password</label>
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                style={{
                                                    borderColor: errors.password ? '#e63946' : '#ddd',
                                                    borderRadius: '8px',
                                                    padding: '12px 15px',
                                                    backgroundColor: errors.password ? '#fffafa' : '#fff'
                                                }}
                                                name="password"
                                                value={formdata.password}
                                                onChange={formDataHandler}
                                                placeholder="••••••••"
                                                required
                                            />
                                            {errors.password && <div className="invalid-feedback d-block" style={{
                                                color: '#fff',
                                                fontSize: '0.8rem'
                                            }}>{errors.password}</div>}
                                            <small className="d-block mt-1" style={{
                                                color: '#888',
                                                fontSize: '0.8rem'
                                            }}>Password must be 8-12 characters</small>
                                        </div>

                                        {/* City */}
                                        <div className="mb-4">
                                            <label className="form-label small mb-1" style={{
                                                color: '#fff',
                                                fontWeight: '500'
                                            }}>City</label>
                                            <CityList
                                                onSelectCity={handleCityData}
                                                className={errors.city ? 'is-invalid' : ''}
                                                style={{
                                                    borderColor: errors.city ? '#e63946' : '#ddd',
                                                    borderRadius: '8px',
                                                    padding: '12px 15px',
                                                    backgroundColor: errors.city ? '#fffafa' : '#fff',
                                                    width: '100%'
                                                }}
                                            />
                                            {errors.city && <div className="invalid-feedback d-block" style={{
                                                color: '#e63946',
                                                fontSize: '0.8rem'
                                            }}>{errors.city}</div>}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="btn w-100 py-3 fw-bold mt-2"
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
                                                    Creating account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </button>

                                        {/* Login Link */}
                                        <div className="text-center mt-4">
                                            <p className="small mb-0" style={{ color: '#666' }}>Already have an account?</p>
                                            <Link to="/Signin" className="small fw-bold text-decoration-none" style={{
                                                color: '#d4a373',
                                                transition: 'all 0.3s'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = '#b58463';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = '#d4a373';
                                                }}>
                                                Sign in instead
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <OtpVerification
                    verifyOtp={verifyOtp}
                    disableResndButton={disableResndButton}
                    timer={timer}
                    submitHandler={submitHandler}
                    loading={loading}
                    style={{
                        backgroundColor: '#ffffff',
                        borderColor: '#ddd'
                    }}
                />
            )}
        </div>
    );
}

export default UserRegister;