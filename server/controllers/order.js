import { pool } from "../config/database.js";

export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    // Get the cart from the session
    const cart = req.session.cart || {};

    // Check if the cart is empty
    if (Object.keys(cart).length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    let totalAmount = 0;

    const cartItemIds = Object.keys(cart);
    for (const cartItemId of cartItemIds) {
      const sneakerId = parseInt(cartItemId);
      const quantity = cart[cartItemId];
      const sneakerDetails = await pool.query(
        `SELECT price FROM sneakers WHERE id = $1`,
        [sneakerId]
      );

      const pricePerUnit = sneakerDetails.rows[0].price;
      const totalPrice = quantity * pricePerUnit;

      totalAmount += totalPrice;
    }
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, order_date, total_amount, status)
       VALUES ($1, NOW(), $2, 'Pending') RETURNING id`,
      [userId, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    for (const cartItemId of cartItemIds) {
      const sneakerId = parseInt(cartItemId);
      const quantity = cart[cartItemId];

      // Retrieve sneaker details
      const sneakerDetails = await pool.query(
        `SELECT price FROM sneakers WHERE id = $1`,
        [sneakerId]
      );

      const pricePerUnit = sneakerDetails.rows[0].price;
      const totalPrice = quantity * pricePerUnit;

      await pool.query(
        `INSERT INTO order_details (order_id, sneaker_id, quantity, price_per_unit, total_price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, sneakerId, quantity, pricePerUnit, totalPrice]
      );
    }
    req.session.cart = {};

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
