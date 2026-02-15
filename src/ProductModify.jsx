import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductModify = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/allproducts');
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('http://localhost:5000/category');
    const data = await res.json();
    setCategories(data);
  };

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleSave = async (product) => {
    try {
      const res = await fetch(`http://localhost:5000/updateproduct/${product.productsid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productsname: product.productsname,
          price: product.price,
          model: product.model,
          catgoeryid: product.catgoeryid,
        }),
      });

      const result = await res.json();
      alert(result.message || 'Product updated successfully');
      setEditRow(null);
      fetchProducts(); // Refresh data
    } catch (error) {
      alert('Error updating product');
      console.error(error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.productsname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Watch Collection Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/addProducts')}
        >
          + Add New Timepiece
        </button>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-0 py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search watches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end mt-3 mt-md-0">
              <span className="badge bg-light text-dark">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Image</th>
                <th>Model</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <h5>No watches found</h5>
                    <p className="text-muted">Try adjusting your search or add a new product</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, index) => (
                  <tr key={p.productsid} className={editRow === index ? 'table-active' : ''}>
                    <td>
                      <div className="position-relative">
                        <img
                          src={`http://localhost:5000/upload/${p.imagepath}`}
                          alt={p.productsname}
                          className="img-thumbnail"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                        <button 
                          className="btn btn-sm btn-outline-primary position-absolute bottom-0 start-0"
                          style={{ transform: 'translateY(50%)' }}
                          onClick={() => navigate(`/editimage/${p.productsid}`)}
                          title="Edit image"
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${editRow === index ? '' : 'bg-white border-0'}`}
                        value={p.model}
                        onChange={(e) => handleChange(index, 'model', e.target.value)}
                        disabled={editRow !== index}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`form-control form-control-sm ${editRow === index ? '' : 'bg-white border-0'}`}
                        value={p.productsname}
                        onChange={(e) => handleChange(index, 'productsname', e.target.value)}
                        disabled={editRow !== index}
                      />
                    </td>
                    <td>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className={`form-control ${editRow === index ? '' : 'bg-white border-0'}`}
                          value={p.price}
                          onChange={(e) => handleChange(index, 'price', e.target.value)}
                          disabled={editRow !== index}
                        />
                      </div>
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${editRow === index ? '' : 'bg-white border-0'}`}
                        value={p.catgoeryid}
                        onChange={(e) => handleChange(index, 'catgoeryid', e.target.value)}
                        disabled={editRow !== index}
                      >
                        {categories.map((c) => (
                          <option key={c.categoryid} value={c.categoryid}>
                            {c.categoeryname}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {editRow === index ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleSave(p)}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditRow(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setEditRow(index)}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductModify;
