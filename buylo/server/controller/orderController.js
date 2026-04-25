import { client } from "../config/database.js";
import { isAddressValid, isPhoneNumberValid } from "../utils/validators.js";

export const addShippingAddress = async (req, res) => {
  const {
    userId,
    phone_number,
    address_line_1,
    address_line_2,
    city,
    state,
    zipcode,
  } = req.body;

  try {
    //All input fields validation || Passed ✅
    if (!address_line_1 || !city || !state || !zipcode || !phone_number) {
      return res.status(400).json({ message: "All fields must be filled" });
    }

    //Valid address validation || Passed ✅
    if (!isAddressValid(address_line_1)) {
      return res.status(400).json({ message: "Invalid address" });
    }

    //City length validation || Passed ✅
    if (city.trim().length < 3) {
      return res.status(400).json({ message: "City is too short" });
    }

    //Valid zip code validation || Passed ✅
    if (zipcode.length < 5) {
      return res.status(400).json({ message: "Zip code is invalid" });
    }

    if (!isPhoneNumberValid(phone_number)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    await client.query(
      `
      UPDATE users
      SET phone_number=$1, address_line_1=$2, address_line_2=$3, city=$4, state=$5, zipcode=$6
      WHERE id=$7
      `,
      [
        phone_number,
        address_line_1,
        address_line_2,
        city,
        state,
        zipcode,
        userId,
      ],
    );

    return res.status(201).json({ message: "Address added successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createNewOrder = async (req, res) => {
  const { userId, cartId } = req.body;

  if (!userId || !cartId) {
    return res.status(400).json({ message: "Data not provided" });
  }

  try {
    await client.query("BEGIN");

    //Get users' shipping address
    const userInfo = await client.query(
      `
      SELECT json_agg(json_build_object('address_line_1', u.address_line_1, 
      'address_line_2', u.address_line_2, 
      'city', u.city, 'state', u.state, 
      'zipcode', u.zipcode)) as shipping_address
      FROM users u
      WHERE id=$1
      `,
      [userId],
    );

    if (userInfo.rows[0].shipping_address === null) {
      return res
        .status(400)
        .json({ message: "Shipping address not available" });
    }

    const shippingAddress = userInfo.rows[0].shipping_address[0];

    const cartCheck = await client.query(
      "SELECT id FROM cart WHERE id=$1 AND user_id=$2",
      [cartId, userId],
    );

    if (!cartCheck.rows[0]) {
      return res.status(403).json({ message: "Invalid cart" });
    }

    const userCartId = cartCheck.rows[0].id;

    const cartItems = await client.query(
      `
      SELECT json_agg(json_build_object('product_id', p.id, 'quantity', ci.quantity, 
      'price_at_add', ci.price_at_add)) as items_ordered,
      c.total_price
      FROM cart c
      JOIN cart_items ci
      ON c.id=ci.cart_id
      JOIN products p
      ON ci.product_id=p.id
      WHERE c.user_id=$1
      GROUP BY c.total_price
      `,
      [userId],
    );

    if (cartItems.rows[0]?.items_ordered === null) {
      return res.status(400).json({ message: "No items in cart" });
    }

    const itemsOrdered = cartItems.rows[0].items_ordered;

    const newOrder = await client.query(
      `
      INSERT INTO orders(user_id, total_price, shipping_address)
      VALUES($1, $2, $3) RETURNING id
      `,
      [userId, cartItems.rows[0].total_price, shippingAddress],
    );

    if (newOrder.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Order not processed. Try again" });
    }

    const orderId = newOrder.rows[0].id;

    for (const item of itemsOrdered) {
      await client.query(
        `
        INSERT INTO order_items(order_id, product_id, quantity, price_at_purchase)
        VALUES($1, $2, $3, $4)
        `,
        [orderId, item.product_id, item.quantity, item.price_at_add],
      );
    }

    //Clear cart items when order is processed successfully
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id=$1
      `,
      [userCartId],
    );

    //Clear total price in cart when order is processed successfully
    await client.query(
      `
      UPDATE cart
      SET total_price=0
      WHERE user_id=$1
      `,
      [userId],
    );

    //Update product quantity
    for (const item of itemsOrdered) {
      await client.query(
        `
        UPDATE products set current_stock = current_stock - $1
        WHERE id=$2
        `,
        [item.quantity, item.product_id],
      );
    }

    await client.query("COMMIT");

    return res
      .status(201)
      .json({ message: "Order has been processed successfully" });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await client.query(`
      SELECT CONCAT(u.first_name,' ', u.last_name) as customer_name,
      o.status as order_status, count(*) as total_items_ordered,
      json_agg(json_build_object('product_name', p.name, 'product_image', p.image , 
      'quantity',oi.quantity, 'price_at_purchase', oi.price_at_purchase)) as items_ordered, 
      o.created_at as order_date
      FROM orders o 
      JOIN users u 
      ON o.user_id=u.id
      JOIN order_items oi 
      ON o.id=oi.order_id
      JOIN products p 
      ON oi.product_id=p.id
      GROUP BY o.created_at, o.status, u.first_name, u.last_name
      `);

    if (orders.rowCount === 0) {
      return res.status(400).json({ message: "No orders available" });
    }

    return res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "Data not provided" });
    }

    const checkUser = await client.query(
      `
      SELECT id FROM users WHERE id=$1
      `,
      [userId],
    );

    if (checkUser.rowCount === 0) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const orders = await client.query(
      `
      SELECT o.created_at as order_date, o.total_price, o.status,
      o.shipping_address,
      json_agg(json_build_object('product_name', p.name, 'product_image', p.image,
      'quantity', oi.quantity, 'price_at_purchase', oi.price_at_purchase)) as items_ordered
      FROM orders o
      JOIN order_items oi
      ON o.id=oi.order_id
      JOIN products p
      ON oi.product_id=p.id
      WHERE user_id=$1
      GROUP BY o.created_at, o.total_price, o.status, o.shipping_address
      `,
      [userId],
    );

    if (orders.rowCount === 0) {
      return res.status(400).json({ message: "No orders available" });
    }

    return res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
