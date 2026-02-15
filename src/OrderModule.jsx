import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderModule.css'; // Custom CSS for shadows, hover, and more

const OrderModule = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [trackingStatus, setTrackingStatus] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        const initialStatus = {};
        data.forEach(order => {
          initialStatus[order.orderid] = 'Processing';
        });
        setTrackingStatus(initialStatus);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleView = (orderid, billing_number) => {
    navigate(`/order/${orderid}/${billing_number}`);
  };

  const handleTrackingChange = (orderid, newStatus) => {
    setTrackingStatus(prev => ({
      ...prev,
      [orderid]: newStatus
    }));
  };

  const handleTrackingUpdate =async (orderid) => {
    const status = trackingStatus[orderid];
     const res = await fetch(`http://localhost:5000/api/update-shipping/${orderid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }), 
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message);
    } else {
      alert(result.message || 'Failed to update');
    }
  } 
  

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary fw-bold"> Order Payment Status Dashboard</h2>
      <div className="row">
        {orders.map((order) => (
          <div className="col-md-6 col-lg-4 mb-4" key={order.orderid}>
            <div className="custom-card h-100 shadow-lg border-0 rounded-4 p-3 position-relative bg-white">
              <span
                className={`badge status-badge position-absolute top-0 end-0 m-3 fs-6 fw-semibold rounded-pill ${
                  order.payment_status === 'Paid' ? 'bg-success' : 'bg-danger'
                }`}
              >
                {order.payment_status}
              </span>
              <br />

              <div className="card-body mt-3">
                <h5 className="card-title fw-bold text-primary">Billing #: {order.billing_number}</h5>
                <p className="card-text text-secondary mb-3">Order ID: {order.orderid}</p>

                <div className="mb-3">
                  <label htmlFor={`track-${order.orderid}`} className="form-label fw-semibold">
                    Tracking Status
                  </label>
                  <select
                    id={`track-${order.orderid}`}
                    className="form-select shadow-sm rounded-3"
                    value={trackingStatus[order.orderid] || ''}
                    onChange={(e) => handleTrackingChange(order.orderid, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button
                    className="btn btn-outline-success mt-2 w-100 rounded-3"
                    onClick={() => handleTrackingUpdate(order.orderid)}
                  >
                    ✅ Update Status
                  </button>
                </div>

                <button
                  className="btn btn-primary w-100 mt-2 rounded-3"
                  onClick={() => handleView(order.orderid, order.billing_number)}
                >
                   View Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderModule;
