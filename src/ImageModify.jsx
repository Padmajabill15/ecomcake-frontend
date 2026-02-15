import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from './config';
import { useParams } from 'react-router-dom';

const EditProductImages = () => {
  const { id: pid } = useParams(); // Product ID from URL
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // Track each image's file

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    fetch(`${API_BASE_URL}/productimages/${pid}`)
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.log('Error:', err));
  };

  const handleFileChange = (imageid, file) => {
    setSelectedFiles({ ...selectedFiles, [imageid]: file });
  };

  const handleUpdate = (imageid) => {
    const selectedFile = selectedFiles[imageid];
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    fetch(`${API_BASE_URL}/updateproductimage/${imageid}`, {
      method: 'PUT',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchImages(); // Refresh the list
      })
      .catch(err => {
        alert('Update failed');
        console.log(err);
      });
  };

  const handleDelete = (imageid) => {
    if (!window.confirm('Are you sure to delete this image?')) return;

    fetch(`${API_BASE_URL}/deleteproductimage/${imageid}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchImages();
      })
      .catch(err => {
        alert('Delete failed');
        console.log(err);
      });
  };

  return (
    <div className="container mt-4">
      <h3 className='text-center'>Manage Images for Product ID: {pid}</h3>
      <hr />
      <div className="row">
        {images.map((img) => (
          <div key={img.imageid} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={`${API_BASE_URL}/upload/${img.imagepath}`}
                alt="product"
                className="card-img-top"
                style={{ height: '200px', objectFit: 'contain' }}
              />
              <div className="card-body">
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => handleFileChange(img.imageid, e.target.files[0])}
                />
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleUpdate(img.imageid)}
                  >
                    Update
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && <p>No images found for this product.</p>}
      </div>
    </div>
  );
};

export default EditProductImages;
