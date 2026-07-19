import React from 'react';
import { MOCK_PRODUCTS } from '../mockData';
import '../styles/CatalogPage.css';
import { useState, useMemo } from 'react';  

import Filter from '../components/Filter';
import ProductCard from '../components/ProductCard';

const CatalogPage = () => {
  const [sortBy, setSortBy] = useState('score');
  const sortedProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];
    switch (sortBy) {
      case 'title': return result.sort((a, b) => a.name.localeCompare(b.name));
      case '-title': return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'price': return result.sort((a, b) => a.price - b.price);
      case '-price': return result.sort((a, b) => b.price - a.price);
      default: return result;
    }
  }, [sortBy]);

  return (
    <main className="catalog-container">
      

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>CURATED ESSENTIALS FOR FOCUSED LIVING</h1>
          <p>Minimalist tools, accessories, and apparel for the modern mind.</p>
        </div>
        <div className="hero-icon">
          {/* Placeholder for that image icon in your wireframe */}
          {/* <span className="icon-placeholder">🖼️</span> */}
        </div>
      </section>

      {/* Filter Row */}
      <Filter sortBy={sortBy} onSortChange={setSortBy} />
      <div className="product-grid">
        {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>     
    
    </main>
  );
};

export default CatalogPage;