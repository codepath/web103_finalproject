import { pool } from "../config/database.js";
import axios from "axios";
const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    console.log("UserID", userId);
    const { sneakerDetails, totalPrice } = req.body;
    console.log(sneakerDetails, totalPrice);
    const sneakers = Object.values(sneakerDetails);
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, order_date, total_amount, status)
       VALUES ($1, NOW(), $2, 'Pending') RETURNING id`,
      [userId, totalPrice]
    );

    const orderId = orderResult.rows[0].id;

    for (const sneaker of sneakers) {
      // Retrieve sneaker details
      const response = await axios.get(
        `http://localhost:3000/api/cart/getProductQuantity/${sneaker.id}`
      );

      const { quantity } = response.data;
      console.log("quantity", quantity);
      const pricePerUnit = parseFloat(sneaker.price.replace("$", ""));
      console.log("sneakerPrivce", pricePerUnit);
      const totalPrice = pricePerUnit * parseInt(quantity);
      await pool.query(
        `INSERT INTO order_details (order_id, sneaker_id, quantity, price_per_unit, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, sneaker.id, quantity, pricePerUnit, totalPrice]
      );
    }
    req.session.cart = {};

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await pool.query(
      `SELECT * FROM orders ORDER BY order_date DESC`
    );
    res.status(201).json(orders.rows); // Pass fetched orders to the template
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default {
  getOrders,
  createOrderFromCart,
};
