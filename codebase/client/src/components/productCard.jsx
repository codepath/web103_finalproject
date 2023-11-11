import React from "react";
import "../styles/productCard.css";

function ProductCard({ imageUrl, price }) {
  return (
    <>
          <div class="product">
          <div class="imgbox"> 
          <img src="https://i.imgur.com/iDwDQ4o.png"/> 
          </div>
          <div class="specifies">
              <h2>Analog Watch 
              <br/> 
              <span>Rolex</span>
              </h2>
              <div class="price">$1500</div> <label>Size</label>
              <ul>
                  <li>10MM</li>
                  <li>20MM</li>
                  <li>30MM</li>
                  <li>40MM</li>
                  <li>50MM</li>
              </ul> <label>Colors</label>
              <ul class="colors">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
              </ul> <button class="btn btn-primary">Buy Now</button>
          </div>
      </div>
    </>
  );
}

export default ProductCard;
