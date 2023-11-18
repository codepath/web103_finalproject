import React from "react";
import ListingCard from "../components/ListingCard";

const ListingsContainer = ({ data }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.map((listing) => (
        <div className="row-span-3">
          <ListingCard key={listing.id} listing={listing} />
        </div>
      ))}
    </div>
  );
};

export default ListingsContainer;
