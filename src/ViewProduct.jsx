import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewProduct = () => {
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  console.log(id)
  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    const response = await fetch(`http://localhost:5000/product/view/${id}`);
    const result = await response.json();
    setProduct(result);
    if (result.images && result.images.length > 0) {
      setMainImage(`http://localhost:5000/upload/${result.images[0].imagepath}`);
    }
  };

  const handleImageChange = (index) => {
    setMainImage(`http://localhost:5000/upload/${product.images[index].imagepath}`);
    setActiveIndex(index);
  };

  const handleAddToCart = async () => {
    // Check quantity limit
    if (quantity > 10) {
      const whatsappLink = 'https://wa.me/919448117516?text=Hello, I want to order more than 10 items per product.';
      alert(`Max 10 items per product.\n\nFor bulk orders (>10 items), please contact:\n📞 9448117516\n\nOr message us on WhatsApp.`);
      window.open(whatsappLink, '_blank');
      return; // prevent adding to cart
    }

    const token = localStorage.getItem("token"); // Assumes JWT is stored here

    const cartItem = [{
      productsid: id,
      qunatity: quantity
    }];

    // If user is not logged in, persist cart locally
    if (!token) {
      try {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = localCart.findIndex(item => String(item.productsid) === String(id));

        if (existingIndex === -1) {
          // store a compact product object to local cart
          const productSnapshot = {
            productsid: id,
            productsname: product.productsname,
            price: product.price,
            imagepath: product.images && product.images[0] ? product.images[0].imagepath : null,
            quantity: quantity
          };
          localCart.push(productSnapshot);
        } else {
          localCart[existingIndex].quantity = (localCart[existingIndex].quantity || 1) + quantity;
        }

        localStorage.setItem('cart', JSON.stringify(localCart));
        alert('Added to cart (local)');
        return;
      } catch (err) {
        console.error('Local add to cart failed', err);
        alert('Failed to add to cart');
        return;
      }
    }

    // Logged-in flow: send to server
    try {
      const res = await fetch('http://localhost:5000/addtocarts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      const data = await res.json();
      if (res.ok) alert(data.message || 'Added to cart');
      else alert(data.message || 'Failed to add to cart');
    } catch (err) {
      console.error('Add to cart failed', err);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Images */}
        <div className="col-md-6 mb-4">
          <img src={mainImage} style={{ height: "70vh", width: "100%" }} alt="Product" className="img-fluid rounded mb-3" />
          <div className="d-flex justify-content-between">
            {product.images && product.images.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/upload/${img.imagepath}`}
                alt={`Thumb ${index + 1}`}
                className={`rounded ${activeIndex === index ? 'border border-primary' : ''}`}
                onMouseOver={() => handleImageChange(index)}
                style={{ cursor: 'pointer', width: '18%' }}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h2>{product.productsname}</h2>
          <p className="text-muted">Model: {product.model}</p>
          <div>
            <span className="h4">₹{product.price}</span>
          </div>
          <p>High-quality product to meet your expectations.</p>

          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">Quantity:</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              min="1"
              max="10"
              style={{ width: '80px' }}
              onChange={(e) => {
                const newQty = Number(e.target.value);
                if (newQty > 10) {
                  const whatsappLink = 'https://wa.me/919448117516?text=Hello, I want to order more than 10 items per product.';
                  alert(`Max 10 items per product.\n\nFor bulk orders (>10 items), please contact:\n📞 9448117516\n\nOr message us on WhatsApp.`);
                  window.open(whatsappLink, '_blank');
                  setQuantity(10);
                } else if (newQty >= 1) {
                  setQuantity(newQty);
                }
              }}
            />
          </div>

          <button className="btn btn-outline-secondary btn-lg mb-3" onClick={handleAddToCart}>
            <i className="bi bi-heart"></i> Add to CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
