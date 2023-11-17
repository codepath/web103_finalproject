import React, { useState, useEffect } from "react";
import "./cart.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [sneakerDetails, setSneakerDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [payed, setPayed] = useState(false);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/cart/get-cart");
        if (!response.ok) {
          throw new Error("Error fetching cart items");
        }
        const cartData = await response.json();
        const transformedCart = Object.keys(cartData).map((productId) => ({
          productId: productId,
          quantity: cartData[productId],
        }));
        setCartItems(transformedCart);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError(error.message);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchSneakerData = async () => {
      const details = {};
      for (const item of cartItems) {
        const { productId } = item;
        if (!sneakerDetails[productId]) {
          try {
            const response = await fetch(`/api/sneakers/${productId}`);
            if (!response.ok) {
              throw new Error("Error fetching sneaker details");
            }
            const sneakerData = await response.json();
            details[productId] = sneakerData;
          } catch (error) {
            console.error("Error fetching sneaker details:", error);
            setError(error.message);
          }
        }
      }
      setSneakerDetails((prevState) => ({ ...prevState, ...details }));
    };

    if (cartItems.length > 0) {
      fetchSneakerData();
    }
  }, [cartItems]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      for (const item of cartItems) {
        const sneakerDetail = sneakerDetails[item.productId];
        if (sneakerDetail) {
          const price = sneakerDetail.price.toString();
          const moneyValue = parseFloat(price.replace("$", ""));
          total += moneyValue * parseInt(item.quantity);
        }
      }
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cartItems, sneakerDetails]);

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`/api/cart/remove-from-cart/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Remove the item from the cart on the client-side
        const updatedCart = cartItems.filter(
          (item) => item.productId !== productId
        );
        setCartItems(updatedCart);
      } else {
        // Handle errors if needed
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError(error.message);
    }
  };
  const createOrder = async () => {
    try {
      const response = await fetch("/api/order/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // You can pass any additional data needed in the request body
        body: JSON.stringify({ sneakerDetails, totalPrice }),
      });
      setPayed(true);
      if (response.ok) {
        const data = await response.json();

        console.log("Order created:", data);
      } else {
        console.error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle errors if needed
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Cart Items</h2>
      <div className="cart-container">
        {!payed && cartItems.length > 0 ? (
          cartItems.map((item) => {
            const sneakerDetail = sneakerDetails[item.productId];
            return (
              sneakerDetail && (
                <div className="small-card" key={item.productId}>
                  <img
                    className="small-card-image"
                    src={sneakerDetail.image_url}
                    alt={sneakerDetail.name}
                  />
                  <div className="small-card-details">
                    <h3>{sneakerDetail.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <button onClick={() => removeFromCart(item.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
              )
            );
          })
        ) : payed ? (
          <p>Payment Done successfully</p>
        ) : (
          <p>No items in the cart</p>
        )}
      </div>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <button onClick={createOrder}>Pay Now</button>
    </div>
  );
};

export default CartPage;
