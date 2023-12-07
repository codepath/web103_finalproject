import React, { useState } from 'react';
import { storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import '../styles/product.css';

const AddItem = () => {
  // State variables for editable fields
  const [editedCategory, setEditedCategory] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedImgUrl, setEditedImgUrl] = useState('');
  const [editedQuantity, setEditedQuantity] = useState('');
  const [editedColor, setEditedColor] = useState('');
  const [editedMetal, setEditedMetal] = useState('');

  const allInputs = {imgUrl: ''}
    const [imageAsFile, setImageAsFile] = useState('')
    const [imageAsUrl, setImageAsUrl] = useState(allInputs)

  const handleImageAsFile = (e) => {
      const image = e.target.files[0]
      setImageAsFile(image)
  }

  const handleFireBaseUpload = async (e) => {
    e.preventDefault();

    if (!imageAsFile) {
      console.error('No image file selected');
      return;
    }

    const storageRef = ref(storage, `images/${imageAsFile.name}`);

    try {
      await uploadBytes(storageRef, imageAsFile);
      const imageUrl = await getDownloadURL(storageRef);
      setEditedImgUrl(imageUrl);
      console.log('File uploaded:', imageUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  const addItem = async (e) => {
    e.preventDefault();
    try {    
      const options = {
        method: 'POST',
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

      const response = await fetch(`http://localhost:3001/api/items`, options);
    
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
      <h1 className="pageTitle">Add Product</h1>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img className="card-img-top mb-5 mb-md-0" src={editedImgUrl} alt="..." />
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Name:</label>
                <input
                  type="text"
                  id="title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category:</label>
                <input
                  type="text"
                  id="category"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price:</label>
                <input
                  type="text"
                  id="price"
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
                <label htmlFor="metal" className="form-label">Metal:</label>
                <input
                  type="text"
                  id="metal"
                  value={editedMetal}
                  onChange={(e) => setEditedMetal(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">Color:</label>
                <input
                  type="text"
                  id="color"
                  value={editedColor}
                  onChange={(e) => setEditedColor(e.target.value)}
                  className="form-control fs-4 mb-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">In Stock:</label>
                <input
                  type="number"
                  id="quantity"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  className="form-control fs-4 mb-3"
                  style={{ maxWidth: '5rem' }}
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
                <button className="buttonLogIn" onClick={addItem}>Create</button>
              </div>
            </div>
          </div>
        </div>

        <img src={imageAsUrl.imgUrl} alt="image tag" />

        <form onSubmit={handleFireBaseUpload}>
        <input 
          type="file"
          onChange={handleImageAsFile}
        />
        <button>upload to firebase</button>
      </form>

      </section>
    </>
  );
};

export default AddItem;
