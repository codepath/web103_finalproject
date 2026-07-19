import React from 'react';
import '../styles/ProductCard.css';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi"; 

const ProductCard = ({ product }) => {

  const handleAddToCart = (e) => {
    // This is CRITICAL: It stops the Link from navigating 
    // to the details page when you just want to add to cart.
    e.preventDefault();
    e.stopPropagation();
    console.log("Added to cart:", product.name);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
    <article className="product-card">
      <div className="image-container">
        <img src={product.image_url} alt={product.name} />
      </div>
      
      <div className="card-body">
        <span className="category-label">{product.category}</span>
        <h5 className="product-name">{product.name}</h5>
        
        <div className="price-row">
          <span className="price">${product.price.toFixed(2)}</span>
        </div>
        
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <FiShoppingCart style={{ marginRight: '8px' }} /> ADD TO CART
        </button>
      </div>
    </article>
    </Link>
  );
};

export default ProductCard;