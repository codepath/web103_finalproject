import React from 'react';
import ItemComponent from '../components/checkoutItem';
import CheckoutSummaryComponent from '../components/checkoutSummary';
import '../styles/checkout.css';

const Checkout = () => {
  const itemData1 = {
    imageSrc: 'https://www.bootdey.com/image/380x380/008B8B/000000',
    title: 'Waterproof Mobile Phone',
    rating: [1, 2, 3, 4, 5],
    color: 'Gray',
    price: { old: 500, new: 450 },
    quantity: 2,
    total: 900,
  };

  const itemData2 = {
    // ... (similar structure as itemData1 for the second item)
  };

  const itemData3 = {
    // ... (similar structure as itemData1 for the third item)
  };

  // const items = [itemData1, itemData2, itemData3];
  const items = [itemData1];

  return (
    <div className="container">
      <div className="row">
        <div className="col-xl-8">
          {items.map((item, index) => (
            <ItemComponent key={index} item={item} />
          ))}
          <CheckoutSummaryComponent items={items} />
        </div>
        {/* ... (rest of your component) */}
      </div>
    </div>
  );
};

export default Checkout;
