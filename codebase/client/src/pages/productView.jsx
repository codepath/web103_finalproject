import React from 'react';
import Product from '../components/product'; // Adjust the path as needed

const ProductView = () => {
  return (
    <div>
      <Product
        imageUrl="https://dummyimage.com/600x700/dee2e6/6c757d.jpg"
        sku="BST-498"
        title="Shop item template"
        oldPrice="45.00"
        newPrice="40.00"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium at dolorem quidem modi. Nam sequi consequatur obcaecati excepturi alias magni, accusamus eius blanditiis delectus ipsam minima ea iste laborum vero?"
        quantity={1}
      />
    </div>
  );
};

export default ProductView;
