// components/Catalog.jsx
import React from "react";
import ProductCard from "../components/productCard";
import Dropdown from "../components/dropdown";
import "../styles/catalog.css";

const Catalog = () => {
  const dropdownOptions = [
    ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories'],
    ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories']
  ];

  return (
    <>
      <h1 className="pageTitle">Catalog</h1>
      <div className="dropdowns">
        {dropdownOptions.map((options, index) => (
          <Dropdown key={index} title="Type" options={options} id={`dropdown-${index}`} />
        ))}
      </div>
      <section className="cards">
        <ProductCard
          category="bracelet"
          title="Gold plated bracelet with heart charm" 
          price="25"
          imgSrc="https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
          imgHoverSrc="https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        />
        <ProductCard
          category="bracelet"
          title="Gold plated bracelet with cross charm"
          price="25"
          imgSrc="https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
          imgHoverSrc="https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        />
      </section>
    </>
  );
};

export default Catalog;
