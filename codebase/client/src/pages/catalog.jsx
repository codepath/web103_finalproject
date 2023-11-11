import React from "react";
import ProductCard from "../components/productCard";

const Catalog = () => {
  return (
     <section className="cards">
      <ProductCard
        category="Recipe"
        title="Crisp Spanish tortilla Matzo brei"
        author="Celeste Mills"
        imgSrc="https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        imgHoverSrc="https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        time="15 min"
      />
      <ProductCard
        category="Travel"
        title="Discover the sea"
        author="John Doe"
        imgSrc="https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        imgHoverSrc="https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260"
        time="5 min"
      />
    </section>
  )
}

export default Catalog;