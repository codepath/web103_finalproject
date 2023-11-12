// components/Catalog.jsx
import React from "react";
import ProductCard from "../components/productCard";
import Dropdown from "../components/dropdown";
import "../styles/catalog.css";

const Liked = () => {
  const dropdownOptions = [
    ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories'],
    ['bracelets', 'earrings', 'necklaces & pendants', 'rings', 'other accessories']
  ];

  return (
    <>
      <h1 className="pageTitle">Liked</h1>
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
          imgSrc="https://images.unsplash.com/photo-1600525990321-9b74f0b86cdc?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY5OTY1NDYwMXw&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400"
          imgHoverSrc="https://images.unsplash.com/photo-1600525990321-9b74f0b86cdc?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY5OTY1NDYwMXw&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400"
        />
        <ProductCard
          category="bracelet"
          title="Gold plated bracelet with cross charm"
          price="25"
          imgSrc="https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY5OTY1NDYwMXw&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400"
          imgHoverSrc="https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&amp;cs=tinysrgb&amp;fit=max&amp;fm=jpg&amp;ixid=M3w5MTMyMXwwfDF8cmFuZG9tfHx8fHx8fHx8MTY5OTY1NDYwMXw&amp;ixlib=rb-4.0.3&amp;q=80&amp;w=400"
        />
      </section>
    </>
  );
};

export default Liked;
