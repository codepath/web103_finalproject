import React, { useState } from 'react';
import '../styles/product.css';
import { useLocation } from 'react-router-dom';

const EditItem = () => {
  const location = useLocation();
  const productData = location.state.productData;
  const { category, title, price, imgSrc, imgHoverSrc, description, id, quantity: initialQuantity, color, metal } = productData;

  // State variables for editable fields
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPrice, setEditedPrice] = useState(price);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedImgUrl, setEditedImgUrl] = useState(imgSrc);
  const [editedQuantity, setEditedQuantity] = useState(initialQuantity);
  const [editedColor, setEditedColor] = useState(color);
  const [editedMetal, setEditedMetal] = useState(metal);

  const updateItem = async (e) => {
    e.preventDefault();
    try {    
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editedTitle,
          metal: editedMetal,
          color: editedColor,
          price: editedPrice,
          type: editedCategory,
          description: editedDescription,
          img_url: editedImgUrl,
          quantity: editedQuantity
        })
      };

      const response = await fetch(`http://localhost:3001/api/items/${id}`, options);
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle success if needed    
      window.location.href = '/edititems';

    } catch (error) {
      console.error('Error updating item:', error.message);
    }
  };

  const deleteItem = async (e) => {
    e.preventDefault();
    try {    
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      };
      const response = await fetch(`http://localhost:3001/api/items/${id}`, options);
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Handle success if needed    
      window.location.href = '/edititems';

    } catch (error) {
      console.error('Error updating item:', error.message);
    }
  };

  return (
    <>
      <h1 className="pageTitle">Edit Product</h1>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img className="card-img-top mb-5 mb-md-0" src={editedImgUrl} alt="..." />
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title:</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price:</label>
                <input
                  type="text"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description:</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="form-control fs-4 mb-3"
                  rows={4}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">In Stock:</label>
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  className="form-control fs-4 mb-3"
                  style={{ maxWidth: '5rem' }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">Color:</label>
                <input
                  type="text"
                  value={editedColor}
                  onChange={(e) => setEditedColor(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="metal" className="form-label">Metal:</label>
                <input
                  type="text"
                  value={editedMetal}
                  onChange={(e) => setEditedMetal(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category:</label>
                <input
                  type="text"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="imgUrl" className="form-label">Image URL:</label>
                <input
                type="text"
                id="imgUrl"
                value={editedImgUrl}
                onChange={(e) => setEditedImgUrl(e.target.value)}
                className="form-control fs-4 mb-3"
                />
            </div>
              <div className="login-button-container">
                <button className="buttonLogIn" onClick={updateItem}>Save</button>
                <button className="buttonLogIn" onClick={deleteItem}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditItem;
