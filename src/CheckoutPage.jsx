import React, { useState } from 'react';
import { API_BASE_URL } from './config';
import styles from './Components/PaymentForm.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckoutPage = () => {
    const location = useLocation();
    const state = location?.state || {};
    const cartData = state?.cartItems || [];
    const totalPrice = state?.total || 0;
    const totalQuantity = state?.totalQuantity || 0;
    const navigate = useNavigate();
    console.log(cartData)
    console.log(totalPrice)
    const [address, setAddress] = useState({
        area: '',
        city: '',
        landmark: '',
        zipcode: ''
    });

    const [showPopup, setShowPopup] = useState(false);
    const [paymentMode, setPaymentMode] = useState('');

    const generateBillingNumber = () => {
        const now = new Date();
        return `BILL${now.getTime()}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handlePayment = async (mode) => {
        const { area, city, landmark, zipcode } = address;

        if (!area || !city || !zipcode) {
            alert("Please fill in all required address fields.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to continue.');
            navigate('/userlogin');
            return;
        }

        const billNumber = generateBillingNumber();
        const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        try {
            const res = await fetch(`${API_BASE_URL}/placeorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    billing_number: billNumber,
                    payment_mode: mode,
                    total_amount: totalPrice,
                    order_date: orderDate,
                    delivery_status: 'Pending',
                    payment_status: mode === 'COD' ? 'Pending' : 'Paid',
                    area,
                    city,
                    landmark,
                    zipcode,
                    cartItems: cartData
                })
            });

            const result = await res.json();

            if (result.success) {
                localStorage.removeItem('cart');
                alert(`✅ Order Placed!\nBilling No: ${billNumber}\nMode: ${mode}`);
                if (mode === 'Online') {
                    navigate('/payment-success', { state: { billNumber, total: totalPrice } });
                } else {
                    navigate('/myOrders');
                }
            } else {
                alert('❌ Failed to place order. Try again.');
            }

        } catch (error) {
            console.error(error);
            alert('❌ Server Error.');
        }
    };

    const renderCardForm = () => (
        <>
            <div className="mb-2">
                <label className="form-label">Card Number</label>
                <input className="form-control" placeholder="1234 5678 9012 3456" maxLength="19" />
            </div>
            <div className="row mb-2">
                <div className="col">
                    <label className="form-label">Expiry</label>
                    <input className="form-control" placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="col">
                    <label className="form-label">CVV</label>
                    <input className="form-control" placeholder="123" maxLength="3" />
                </div>
            </div>
            <div className="mb-2">
                <label className="form-label">Cardholder Name</label>
                <input className="form-control" placeholder="John Doe" />
            </div>
        </>
    );

    return (
        <div className={`${styles.container} mt-5 px-5`}>
            <div className="mb-4">
                <h2>Confirm Order and Pay</h2>
                <span>Please make the payment to proceed with your order.</span>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className={`${styles.card} p-3`}>
                        <h6 className="text-uppercase">Billing Address</h6>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                <small>TOTAL AMOUNT</small>
                                <input type="text" readOnly value={`₹${totalPrice}`} className="form-control mt-2" />
                            </div>
                            {/* <div className="col-md-6">
                                <small>TOTAL QUANTITY</small>
                                <input type="text" className="form-control mt-2" />
                            </div> */}
                            <div className="col-md-6 mt-5">
                                <input
                                    type="text"
                                    name="area"
                                    className="form-control"
                                    placeholder="Area"
                                    value={address.area}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    placeholder="City"
                                    value={address.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <input
                                    type="text"
                                    name="landmark"
                                    className="form-control"
                                    placeholder="Landmark"
                                    value={address.landmark}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-6 mt-3">
                                <input
                                    type="text"
                                    name="zipcode"
                                    className="form-control"
                                    placeholder="Zip Code"
                                    value={address.zipcode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-3">
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                setPaymentMode('Online');
                                setShowPopup(true);
                            }}
                        >
                            Pay Online
                        </button>
                        <button
                            className="btn btn-warning"
                            onClick={() => {
                                setPaymentMode('COD');
                                setShowPopup(true);
                            }}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className={`${styles.cardBlue} card p-3 text-white mb-3`}>
                        <span>You have to pay</span>
                        <div className="d-flex flex-row align-items-end mb-3">
                            <h1 className="mb-0">₹{totalPrice}</h1><span>.00</span>
                        </div>
                        <span>Enjoy features and perks after payment</span>
                        <div className={styles.hightlight}>
                            <span>100% Guaranteed support and updates for 5 years.</span>
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="modal d-block bg-dark bg-opacity-75">
                    <div className="modal-dialog">
                        <div className="modal-content p-4">
                            <h5 className="modal-title mb-3">Confirm Order</h5>
                            <p><strong>Payment Mode:</strong> {paymentMode}</p>

                            <div className="mb-2">
                                <label className="form-label">Total Amount</label>
                                <input type="text" readOnly className="form-control" value={`₹${totalPrice}`} />
                            </div>


                            {paymentMode === 'Online' && (
                                <>
                                    <hr />
                                    <h6 className="mb-3">💳 Card Payment Details</h6>
                                    {renderCardForm()}
                                </>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowPopup(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowPopup(false);
                                        handlePayment(paymentMode);
                                    }}
                                >
                                    Confirm & Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
