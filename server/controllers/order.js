import { pool } from "../config/database.js";

// Controller function to create an order from the user's cart
export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const cart = req.session.cart || {};

    if (Object.keys(cart).length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Step 1: Create the order
    const orderResult = await pool.query(
      `INSERT INTO orders (userid, createdat) VALUES ($1, NOW()) RETURNING id`,
      [userId]
    );

    const orderId = orderResult.rows[0].id;

    // Step 2: Create order items for each item in the cart
    const cartItemIds = Object.keys(cart);

    for (const cartItemId of cartItemIds) {
      const sneakerId = parseInt(cartItemId);
      const quantity = cart[cartItemId];

      await pool.query(
        `INSERT INTO orderitems (orderid, sneakerid, quantity, createdat)
         VALUES ($1, $2, $3, NOW())`,
        [orderId, sneakerId, quantity]
      );

      // want to update stock quantities, calculate the total, etc.
    }

    req.session.cart = {};

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
