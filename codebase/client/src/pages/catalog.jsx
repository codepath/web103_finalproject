// components/Catalog.jsx
import React from "react";
import {useState, useEffect} from 'react';
import ProductCard from "../components/productCard";
import Dropdown from "../components/dropdown";
import "../styles/catalog.css";

const Catalog = () => {
  const dropdownOptions = [
    ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories'],
    ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories']
  ];
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
    const queryParams = {
      minPrice: 10,
      maxPrice: 100,
      color: 'silver',
      type: 'bracelets',
      metal: 'silver',
    };
    
    const queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    
    try {
      console.log(queryString)
      const response = await fetch(`http://localhost:3001/api/items/filter?${queryString}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      
      const data = await response.json();
      console.log(data);
      setItems(data);
    } catch (error) {
      console.error('Error:', error);
    }    
  }
  fetchItems();
  }, []);


  return (
    <>
      <h1 className="pageTitle">Catalog</h1>
      <div className="dropdowns">
        {dropdownOptions.map((options, index) => (
          <Dropdown key={index} title="Category" options={options} id={`dropdown-${index}`} />
        ))}
      </div>
      <section className="cards">
        { items.length === 0 ? <p>No items found.</p> : items.map((item) => (
          <ProductCard
            category={item.type}
            title={item.title}
            price={item.price}
            imgSrc={item.img_url}
            imgHoverSrc={item.img_url}
          />
        ))
        }
      </section>
    </>
  );
};

export default Catalog;
