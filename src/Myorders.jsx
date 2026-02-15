import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';
import { useNavigate } from 'react-router-dom';
import './OrderModule.css';
import OrderProgress from './OrderProgress'; // 🔹 Import the progress component
import styles from './OrderProgress.module.css';
const Myorders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const steps = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/myOrders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const getStepClass = (currentStatus, stepIndex) => {
    const currentIndex = steps.indexOf(currentStatus);
    return stepIndex <= currentIndex ? 'step completed' : 'step';
  };

  const getProgressWidth = (currentStatus) => {
    const index = steps.indexOf(currentStatus);
    const percentage = (index / (steps.length - 1)) * 100;
    return `${percentage}%`;
  };
  const handleView = (orderid, billing_number) => {
    navigate(`/order/${orderid}/${billing_number}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary fw-bold"></h2>
      <div className="row">
        {orders.map((order) => (
          <div className="col-md-6 col-lg-12 mb-4 " key={order.orderid}>
            <br />
            <div className="custom-card h-100 shadow-lg border-0 rounded-4 p-4 position-relative bg-white">
              <span
                className={`badge status-badge position-absolute top-0 end-0 m-3 fs-6 fw-semibold rounded-pill ${order.payment_status === 'Paid' ? 'bg-success' : 'bg-danger'}`}
              >
                {order.payment_status}
              </span>

              <div className="card-body mt-3">
                <h5 className="card-title fw-bold">
                  <span className='text-primary'>Billing # :</span> {order.billing_number}
                </h5>
                <p className="card-text text-secondary mb-3">Order ID: {order.orderid}</p>
                <h4 className="card-text text-warning mb-3">Amount: ₹ {order.total_amount}/-</h4>
                {/* 🔹 Order progress bar component */}
                <div className="tracking-steps-wrapper mb-3">
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: getProgressWidth(order.Shiffing || 'Processing') }}
                    ></div>
                  </div>

                  <div className="tracking-steps">
                    {steps.map((step, index) => (
                      <div key={index} className={getStepClass(order.Shiffing || 'Processing', index)}>
                        <div className="circle">{index + 1}</div>
                        <div className="label">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className={styles.iconContent}>
                    <img src="https://i.imgur.com/9nnc9Et.png" className={styles.icon} alt="" />
                    <p><strong>Order<br />Processed</strong></p>
                  </div>
                  <div className={styles.iconContent}>
                    <img src="https://i.imgur.com/KtB7jZV.png" className={styles.icon} alt="" />
                    <p><strong>Order<br />Packed</strong></p>
                  </div>
                  <div className={styles.iconContent}>
                    <img src="https://i.imgur.com/u1AzR7w.png" className={styles.icon} alt="" />
                    <p><strong>Order<br />Shipped</strong></p>
                  </div>
                  <div className={styles.iconContent}>
                    <img src="https://i.imgur.com/TkPm63y.png" className={styles.icon} alt="" />
                    <p><strong>Order<br />En Route</strong></p>
                  </div>
                  <div className={styles.iconContent}>
                    <img src="https://i.imgur.com/HdsziHP.png" className={styles.icon} alt="" />
                    <p><strong>Order<br />Arrived</strong></p>
                  </div>
                </div>
                <button
                  style={{ float: "center" }}
                  className='btn btn-primary col-lg-2 mt-3 mb-3'
                  onClick={() => handleView(order.orderid, order.billing_number)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Progress Bar Styles */}
      <style>{`
        .tracking-steps-wrapper {
          position: relative;
          margin-top: 20px;
        }

        .progress-bar-track {
          height: 4px;
          background-color: #dee2e6;
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          z-index: 0;
          border-radius: 4px;
        }

        .progress-bar-fill {
          height: 4px;
          background-color: #28a745;
          border-radius: 4px;
          transition: width 0.4s ease-in-out;
        }

        .tracking-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .step {
          text-align: center;
          flex: 1;
        }

        .step .circle {
          width: 30px;
          height: 30px;
          line-height: 30px;
          border-radius: 50%;
          background-color: #dee2e6;
          margin: 0 auto;
          color: #fff;
          font-weight: bold;
        }

        .step.completed .circle {
          background-color: #28a745;
        }

        .step .label {
          font-size: 12px;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default Myorders;
