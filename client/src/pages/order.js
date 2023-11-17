import React, { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order/getOrders"); // Replace with your endpoint to fetch orders
        if (!response.ok) {
          throw new Error("Error fetching orders");
        }
        const ordersData = await response.json();
        setOrders(ordersData); // Assuming the response has an 'orders' array
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Orders</h2>
      {orders && orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_date}</td>
                <td>${order.total_amount}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available</p>
      )}
    </div>
  );
};

export default Orders;
