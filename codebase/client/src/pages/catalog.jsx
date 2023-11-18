// components/Catalog.jsx
import React from "react";
import {useState, useEffect} from 'react';
import ProductCard from "../components/productCard";
import Dropdown from "../components/dropdown";
import "../styles/catalog.css";

const Catalog = () => {
  const [options, setOptions] = useState({
  type: ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories'], 
  color: ['silver', 'gold', 'rose gold', 'multi-color'],
  metal: ['silver', 'gold', 'rose gold'],
  minPrice: [10, 20, 50, 100, 200],
  maxPrice: [20, 50, 100, 200, 500]
  });

  const [params, setParams] = useState({minPrice: undefined, maxPrice: undefined, color: '', type: '', metal: '', });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
    
      const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
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
  }, [params]);


  return (
    <>
      <h1 className="pageTitle">Catalog</h1>
      <div className="dropdowns">
          <Dropdown title="Category" options={options.type} params={params} setParams={setParams} filter="type"/>
          <Dropdown title="Color" options={options.color} params={params} setParams={setParams} filter="color"/>
          <Dropdown title="Metal" options={options.metal} params={params} setParams={setParams} filter="metal"/>
          <Dropdown title="Min Price" options={options.minPrice} params={params} setParams={setParams} filter="minPrice"/>
          <Dropdown title="Max Price" options={options.maxPrice} params={params} setParams={setParams} filter="maxPrice"/>
      </div>
      <section className="cards">
        { items.length === 0 ? <p>No items found.</p> : items.map((item) => (
          <ProductCard
            category={item.type}
            title={item.title}
            price={item.price}
            imgSrc={item.img_url}
            imgHoverSrc={item.img_url}
            description={item.description}
            id={item.id}
            quantity={item.quantity}
            color={item.color}
            metal={item.metal}
          />
        ))
        }
      </section>
    </>
  );
};

export default Catalog;
