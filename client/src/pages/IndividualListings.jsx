import React from 'react';

const IndividualListings = ({ match, userListings }) => {
  // Extract the listing ID from the URL parameter
  console.log(userListings);

  const listingId = match.params.id;

  // Fetch the details of the listing based on the ID
  // You may need to modify this part based on your data structure
  const listingDetails = userListings.filter(listing => listing.id === listingId);

  if (!listingDetails) {
    return <div>Listing not found</div>;
  }

  return (
    <div>
      <h1>{listingDetails.title}</h1>
      {/* Render additional details here */}
      <p>Price per night: {listingDetails.price}</p>
      <p>Image: <img src={listingDetails.img} alt={listingDetails.title} /></p>
    </div>
  );
};

export default IndividualListings;
