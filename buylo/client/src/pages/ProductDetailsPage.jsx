import { React, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart , FiShoppingCart } from "react-icons/fi"; // Feather: Thin, modern outline


import { MOCK_PRODUCTS } from '../mockData';

import '../styles/ProductDetailsPage.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [selectedQty, setSelectedQty] = useState(1);
  
  // Find the product by ID (matching the URL param)
  const product = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));

  // Handle case where product isn't found
  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="contrast">Return to Catalog</Link>
      </div>
    );
  }

  // Generate numbers from 1 up to the total stock (max 10 for clean UI)
  const stockLimit = Math.min(product.quantity, 10);
  const qtyOptions = Array.from({ length: stockLimit }, (_, i) => i + 1);

  return (
    <main className="details-container">
      <nav aria-label="breadcrumb">
        <ul>
          <li><Link to="/">Shop</Link></li>
          <li>{product.category}</li>
          <li>{product.name}</li>
        </ul>
      </nav>

      <div className="product-layout">
        {/* Left Side: Large Image */}
        <div className="product-image-section">
          <img src={product.image_url} alt={product.name} />
        </div>

        {/* Right Side: Info & Actions */}
        <div className="product-info-section">
          <span className="brand-tag">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          
          <div className="detail-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="stock-info">
            <p>{product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}</p>
          </div>
          <div className="quantity-selector">
            <label htmlFor="qty">Quantity:</label>
            <select 
                id="qty" 
                value={selectedQty} 
                onChange={(e) => setSelectedQty(e.target.value)}
              >
                {qtyOptions.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
          </select>
          </div>
          <div className="action-row">
            <button className="add-to-cart-large">
                   <FiShoppingCart style={{ marginRight: '8px' }} />
                    ADD TO CART  
          </button>
            <button className="secondary outline wishlist-btn">
              <FiHeart className="wishlist-icon" />
                    WISHLIST
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;