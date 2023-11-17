import React, { useState } from 'react';
import '../styles/product.css';
import { useLocation } from 'react-router-dom';

const EditItem = () => {
  const location = useLocation();
  const productData = location.state.productData;
  const { category, title, price, imgSrc, imgHoverSrc, description, id, quantity: initialQuantity } = productData;

  // State variables for editable fields
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedQuantity, setEditedQuantity] = useState(initialQuantity);

  const updateItem = async (e) => {
    e.preventDefault();
    const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editedTitle,
          price: editedPrice,
          description: editedDescription,
          quantity: editedQuantity
        })
    }
    
    await fetch(`http://localhost:3001/api/items/` + id, options)
    // window.location.href = '/edititems'
  }

  return (
    <>
      <h1 className="pageTitle">Edit Product</h1>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img className="card-img-top mb-5 mb-md-0" src={imgSrc} alt="..." />
            </div>
            <div className="col-md-6">
              <div className="small mb-1">ID: {id}</div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="form-control fs-4 mb-3"
              />
              <input
                type="text"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="form-control fs-4 mb-3"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="form-control fs-4 mb-3"
                rows={4}
              ></textarea>
              <div className="d-flex align-items-center">
                <p className="lead bold me-2">In Stock:</p>
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  className="form-control fs-4 mb-3"
                  style={{ maxWidth: '5rem' }}
                />
              </div>
              <button className="buttonLogIn" onClick={updateItem}>Save</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditItem;