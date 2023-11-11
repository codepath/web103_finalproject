import React from "react";
import { MDBRipple } from "mdb-react-ui-kit";

function ProductCard({ imageUrl, price }) {
  return (
    <MDBRipple
      rippleColor="dark"
      rippleTag="div"
      className="bg-image rounded hover-zoom shadow-1-strong"
    >
      <img src={imageUrl} fluid="true" className="w-100" />
      <a href="#!">
        <div
          className="mask"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="d-flex justify-content-start align-items-start h-100">
            <h5>
              <span className="badge bg-light pt-2 ms-3 mt-3 text-dark">
                {price}
              </span>
            </h5>
          </div>
        </div>
        <div className="hover-overlay">
          <div
            className="mask"
            style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
          ></div>
        </div>
      </a>
    </MDBRipple>
  );
}

export default ProductCard;
