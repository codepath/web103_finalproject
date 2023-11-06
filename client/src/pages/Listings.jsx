import React from "react";
import "./listings.css";
import ListingsContainer from "../containers/ListingsContainer";

const Listings = ({ data }) => {
  return (
    <div className="listings-container">
      <ListingsContainer data={data} />
    </div>
  );
};

export default Listings;
