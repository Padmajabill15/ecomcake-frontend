import React from 'react';
import styles from './OrderProgress.module.css';

const OrderProgress = ({ status }) => {
  const steps = ['Order Processed', 'Order Shipped', 'Order En Route', 'Order Arrived'];
  const statusIndex = {
    'Processed': 0,
    'Shipped': 1,
    'En Route': 2,
    'Arrived': 3
  };

  const currentStep = statusIndex[status] ?? 0;
const icons = {
  Processed: "/images/processed.png",
  Shipped: "/images/shipped.png",
  "En Route": "/images/enroute.png",
  Arrived: "/images/arrived.png",
};
  return (
    <div className={styles.cardOrder}>
      <div className={styles.top}>
     <ul id="progressbar">
  {['Processed', 'Shipped', 'En Route', 'Arrived'].map((step, index) => (
    <li key={index} className={index <= currentStep ? 'active' : ''}>
      <div className="iconContent">
        <img src={icons[step]} alt={step} className="icon" />
        {`Order ${step}`}
      </div>
    </li>
  ))}
</ul>

        <div className="d-flex justify-content-between">
          <div className={styles.iconContent}>
            <img src="https://i.imgur.com/9nnc9Et.png" className={styles.icon} alt="" />
            <p><strong>Order<br />Processed</strong></p>
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
      </div>
    </div>
  );
};

export default OrderProgress;
