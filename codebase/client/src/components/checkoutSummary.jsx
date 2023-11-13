import React from 'react';

const CheckoutSummary = ({ subTotal, discount, shippingCharge, tax, total }) => {
  return (
    <div className="card border shadow-none">
      <div className="card-header bg-transparent border-bottom py-3 px-4">
        <h5 className="font-size-16 mb-0">Order Summary <span className="float-end">#MN0124</span></h5>
      </div>
      <div className="card-body p-4 pt-2">
        <div className="table-responsive">
          <table className="table mb-0">
            <tbody>
              <tr>
                <td>Sub Total :</td>
                <td className="text-end">${subTotal}</td>
              </tr>
              <tr>
                <td>Discount :</td>
                <td className="text-end">- ${discount}</td>
              </tr>
              <tr>
                <td>Shipping Charge :</td>
                <td className="text-end">${shippingCharge}</td>
              </tr>
              <tr>
                <td>Estimated Tax :</td>
                <td className="text-end">${tax}</td>
              </tr>
              <tr className="bg-light">
                <th>Total :</th>
                <td className="text-end">
                  <span className="fw-bold">
                    ${total}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
