import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ role }) {
  console.log("role", role);

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="#">
          <i className="bi bi-cupcake me-2"></i>Akash Agencies
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!role ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white active" to="/">
                    <i className="bi bi-house-door me-1"></i>Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white active" to="/pdisplay">
                    <i className="bi bi-cupcake me-1"></i>Our Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Signup">
                    <i className="bi bi-person-plus me-1"></i>Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Signin">
                    <i className="bi bi-box-arrow-in-right me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white active" to="/AddtoCart">
                    <i className="bi bi-cart me-1"></i>Cart
                  </Link>
                </li>
              </>
            ) : role === "User" ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white active" to="/pdisplay">
                    <i className="bi bi-cupcake me-1"></i>Our Procucts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/AddtoCart">
                    <i className="bi bi-cart me-1"></i>Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white active" to="/myOrders">
                    <i className="bi bi-bag-check me-1"></i>My Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Logout">
                    <i className="bi bi-box-arrow-right me-1"></i>Sign Out
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/addProducts">
                    <i className="bi bi-plus-circle me-1"></i>Add Procucts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/productModify">
                    <i className="bi bi-pencil-square me-1"></i>Edit Procucts
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/orderModule">
                    <i className="bi bi-clipboard-check me-1"></i>Manage Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Logout">
                    <i className="bi bi-box-arrow-right me-1"></i>Sign Out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
