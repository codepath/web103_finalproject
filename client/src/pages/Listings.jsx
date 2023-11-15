// Listings.js
import React from 'react';
import ListingsContainer from '../containers/ListingsContainer';

const Listings = ({ data }) => {
  return (
    <div className="h-screen mt-6 mb-6 mx-6">
      <ListingsContainer data={data} />
    </div>
  );
};


export default Listings;
