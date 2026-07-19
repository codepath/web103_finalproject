import { client } from "../config/database.js";

export const addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "userId and productId are required" });
  }

  try {
    //Query Cart ID
    const result = await client.query(
      `
        SELECT id FROM Cart
        WHERE user_id=$1
        `,
      [userId],
    );

    if (result.rowCount === 0)
      return res.status(400).json({ message: "Cart not found" });

    const cartId = result.rows[0].id;

    //Check if product exist
    const productInStock = await client.query(
      `
            SELECT current_stock, price
            FROM Products
            WHERE id=$1
            `,
      [productId],
    );

    //Check if product exist in database
    if (productInStock.rowCount === 0) {
      return res.status(400).json({ message: "Product is not available" });
    }

    //Check if the product is already in cart
    const cartInfo = await client.query(
      `
        SELECT ci.id, ci.quantity
        FROM Cart_Items ci
        WHERE cart_id=$1 AND product_id=$2
        `,
      [cartId, productId],
    );

    //Check if cart exist
    if (cartInfo.rowCount > 0) {
      if (
        productInStock.rows[0].current_stock >=
        cartInfo.rows[0].quantity + 1
      ) {
        //Update quantity in cart to quantity + 1
        await client.query(
          `
                UPDATE Cart_Items
                SET quantity = quantity + 1
                WHERE cart_id=$1 AND product_id=$2
                `,
          [cartId, productId],
        );

        //Update total price in cart
        await client.query(
          `
                UPDATE Cart
                SET total_price = (
                SELECT SUM(price_at_add * quantity)
                FROM Cart_Items
                WHERE cart_id=$1
                ) WHERE id=$1
                `,
          [cartId],
        );

        return res.status(200).json({ message: "Cart updated" });
      } else {
        return res.status(400).json({
          message: "You've reached the maximum quantity for this item",
        });
      }
    } else {
      if (productInStock.rows[0].current_stock >= 1) {
        //Insert product into the cart
        await client.query(
          `
                INSERT INTO Cart_Items (cart_id, product_id, quantity, price_at_add)
                VALUES ($1, $2, $3, $4)
                `,
          [cartId, productId, 1, productInStock.rows[0].price],
        );

        //Update total price in cart
        await client.query(
          `
                UPDATE Cart
                SET total_price = (
                SELECT SUM(price_at_add * quantity)
                FROM Cart_Items
                WHERE cart_id=$1
                ) WHERE id=$1
                `,
          [cartId],
        );

        return res.status(201).json({ message: "Item added to cart" });
      } else {
        return res.status(400).json({
          message: "You've reached the maximum quantity for this item",
        });
      }
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartByUser = async (req, res) => {
  const { userId, cartId } = req.body;

  try {
    if (!userId || !cartId) {
      return res.status(400).json({ message: "Data not provided" });
    }

    const checkUser = await client.query(
      `
      SELECT c.id
      FROM cart c
      WHERE c.user_id=$1
      `,
      [userId],
    );

    if (checkUser.rowCount === 0) {
      return res.status(400).json({ message: "No cart available" });
    }

    const cartItems = await client.query(
      `
      SELECT json_agg(json_build_object('name', p.name, 'quantity', ci.quantity, 'price_at_add', ci.price_at_add)) as items_in_cart,
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

    if (cartItems.rowCount === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    return res.status(200).json(cartItems.rows[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
