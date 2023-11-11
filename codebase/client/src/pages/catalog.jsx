import React from "react";
import ProductCard from "../components/productCard";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";

const Catalog = () => {
  return (
    <MDBContainer fluid className="my-5 text-center">
      <h4 className="mt-4 mb-5">
        <strong>Product Listing</strong>
      </h4>

      <MDBRow>
        <MDBCol md="12" lg="4" className="mb-4">
          <ProductCard
            imageUrl="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/new/img(1).webp"
            price="$123"
          />
        </MDBCol>

        {/* Repeat the same structure for other ProductCard components */}
      </MDBRow>

      <MDBRow>
        {/* Repeat the same structure for the second row of ProductCard components */}
      </MDBRow>
    </MDBContainer>
  );
}

export default Catalog;