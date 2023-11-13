import React from 'react';
import listings from '../jsons/listings.json';

function ProfileListing() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className='text-center mb-4'>Listings</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map(listing => (
          <li key={listing.listing_id} className="bg-white p-6 rounded-md shadow-md w-full mb-4">
            <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
            <p className="text-gray-600">Property ID: {listing.property_id}</p>
            <p className="text-gray-600">Price per night: {listing.price_per_night}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileListing;
