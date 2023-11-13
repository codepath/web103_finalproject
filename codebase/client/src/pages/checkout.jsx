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
  const items = [itemData1, itemData1, itemData1];

  return (
    <>
    <h1 className='pageTitle'>Bag</h1>
    <div className="containerC">
      <div className="row">
        {/* Left Column for Items */}
        <div className="col-lg-8">
          {items.map((item, index) => (
            <ItemComponent key={index} item={item} />
          ))}
        </div>

        {/* Right Column for Summary and Buttons */}
        <div className="col-lg-4">
          <div className="mt-5 mt-lg-0">
            <CheckoutSummaryComponent items={items} />

            {/* Continue Shopping and Checkout buttons */}
            <div className="row my-4">
              <div className="col-sm-6">
                <a href="ecommerce-products.html" className="btn btn-link text-muted">
                  <i className="mdi mdi-arrow-left me-1"></i> Continue Shopping
                </a>
              </div>
              <div className="col-sm-6">
                <div className="text-sm-end mt-2 mt-sm-0">
                  <a href="ecommerce-checkout.html" className="buttonLogIn">
                    <i className="mdi mdi-cart-outline me-1"></i> Checkout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
