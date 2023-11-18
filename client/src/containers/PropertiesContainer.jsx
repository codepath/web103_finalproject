import React, { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard.jsx";
import { useSelector } from "react-redux";

const PropertiesContainer = () => {
  //const userProperties = useSelector((state => state.properties?.userProperties))

  useEffect(() => {});

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((property) => (
        <div className="row-span-3">
          <PropertyCard key={property.id} property={property} />
        </div>
      ))}
    </div>
  );
};

export default PropertiesContainer;
