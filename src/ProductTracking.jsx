import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

const ProductTracking = () => {
  const [products, setProducts] = useState([]);
     const { id, billNumber } = useParams();
  const steps = ["Order Confirmed", "Packed", "Shipped", "Delivered"];

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (token) {
       
        try {
          const response = await fetch(`http://localhost:5000/productTracking/${billNumber}`, {
          
           headers: {
        'Authorization': `Bearer ${token}`
      }
          
          });

          const result = await response.json();
          setProducts(result);
        } catch (error) {
          console.error("Error fetching tracking data:", error);
        }
      }
    };

    fetchOrders();
  }, []);

  const getProgressWidth = (status) => {
    switch (status) {
      case "Order Confirmed":
        return "5%";
      case "Packed":
        return "33%";
      case "Shipped":
        return "66%";
      case "Delivered":
        return "100%";
      default:
        return "5%";
    }
  };

  const getStepClass = (status, index) => {
    const statusIndex = steps.indexOf(status);
    return index <= statusIndex ? "step completed" : "step";
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4">My Orders</h3>

      {products.map((item) => (
        <div className="order-card shadow-lg p-4 mb-5 rounded" key={item.productsid}>
          <div className="d-flex justify-content-between align-items-start flex-wrap">
            <div className="d-flex">
              <img style={{height:"100px"}}
                src={`http://localhost:5000/upload/${item.imagepath}`}
                alt={item.productname}
                className="order-image me-3"
              />
              <div>
                <h5>{item.productname}</h5>
                <p className="text-muted mb-1">By: {item.productsname || "Brand Name"}</p>
                <p className="mb-1">Quantity: {item.quantity}</p>
              
              </div>
            </div>

            <div className="text-end">
              <span className="badge bg-warning text-dark mb-2">
                {item.Shiffing || "Processing"}
              </span>
              <p className="text-muted mb-1">Total Amount </p>
              <p className="mb-0 fw-semibold text-primary">₹{item.price}</p>
             
            </div>
          </div>

       
        </div>
      ))}

    </div>
  );
};

export default ProductTracking;
