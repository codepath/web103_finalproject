import React from 'react';

const checkoutItem = ({ item }) => {
  const { imageSrc, title, rating, color, price, quantity, total } = item;

  return (
    <div className="card border shadow-none">
      <div className="card-body">
        <div className="d-flex align-items-start border-bottom pb-3">
          <div className="me-4">
            <img src={imageSrc} alt="" className="avatar-lg rounded" />
          </div>
          <div className="flex-grow-1 align-self-center overflow-hidden">
            <div>
              <h5 className="text-truncate font-size-18">
                <a href="#" className="text-dark">{title}</a>
              </h5>
              <p className="text-muted mb-0">
                {rating.map((star, index) => (
                  <i key={index} className="bx bxs-star text-warning"></i>
                ))}
              </p>
              <p className="mb-0 mt-1">Color : <span className="fw-medium">{color}</span></p>
            </div>
          </div>
          <div className="flex-shrink-0 ms-2">
            <ul className="list-inline mb-0 font-size-16">
              <li className="list-inline-item">
                <a href="#" className="text-muted px-1">
                  <i className="mdi mdi-trash-can-outline"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-muted px-1">
                  <i className="mdi mdi-heart-outline"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="row">
            <div className="col-md-4">
              <div className="mt-3">
                <p className="text-muted mb-2">Price</p>
                <h5 className="mb-0 mt-2">
                  <span className="text-muted me-2"><del className="font-size-16 fw-normal">${price.old}</del></span>
                  ${price.new}
                </h5>
              </div>
            </div>
            <div className="col-md-5">
              <div className="mt-3">
                <p className="text-muted mb-2">Quantity</p>
                <div className="d-inline-flex">
                  <select className="form-select form-select-sm w-xl" value={quantity}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mt-3">
                <p className="text-muted mb-2">Total</p>
                <h5>${total}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default checkoutItem;
