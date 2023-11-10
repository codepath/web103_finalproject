export const addToCart = (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.session.cart || {};

  if (!cart[productId]) {
    cart[productId] = 0;
  }

  cart[productId] += quantity;

  req.session.cart = cart;
  res.status(201).json({ message: "Item added to cart" });
};

export const getCart = (req, res) => {
  const cart = req.session.cart || {};
  res.status(200).json(cart);
};

export const updateCartItemQuantity = (req, res) => {
  const itemId = req.params.productId;
  const newQuantity = req.body.quantity;
  const cart = req.session.cart || {};

  if (cart[itemId] !== undefined) {
    cart[itemId] = newQuantity;
    req.session.cart = cart;
    res.status(200).json({ message: "Cart item quantity updated" });
  } else {
    res.status(404).json({ error: "Item not found in the cart" });
  }
};

export const removeFromCart = (req, res) => {
  const itemId = req.params.productId;
  const cart = req.session.cart || {};

  if (cart[itemId] !== undefined) {
    delete cart[itemId];
    req.session.cart = cart;
    res.status(200).json({ message: "Item removed from the cart" });
  } else {
    res.status(404).json({ error: "Item not found in the cart" });
  }
};
