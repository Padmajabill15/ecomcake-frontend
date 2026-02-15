import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/order-success',
      },
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="mt-4 text-center">
        <button className="btn btn-primary w-100" type="submit" disabled={!stripe}>
          Pay ₹{amount.toFixed(2)}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
