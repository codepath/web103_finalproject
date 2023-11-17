import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Review from "../components/CommentBtn";
import "./SneakerDetails.css";

const SneakerDetails = ({ data }) => {
  const { id } = useParams();
  const [post, setPost] = useState({
    id: 0,
    name: "",
    description: "",
    sizes: "",
    price: "",
    image_url: "",
  });
  const [comments, setComments] = useState([]);
  const addToCart = async () => {
    try {
      const response = await fetch(`/api/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        console.log("Sneaker added to cart successfully!");
      } else {
        console.error("Failed to add sneaker to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const fetchExistingReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching existing reviews:", error);
    }
  };

  useEffect(() => {
    const result = data.find((item) => item.id === parseInt(id));

    if (result) {
      setPost({
        id: parseInt(result.id),
        name: result.name,
        description: result.description,
        sizes: result.size,
        price: result.price,
        image_url: result.image_url,
      });
    }

    fetchExistingReviews();
  }, [data, id]);

  return (
    <div className="out">
      <div className="details-banner">
        <h3 className="brand_name">{post.name}</h3>
        <div className="details-container">
          <p className="details-description">{post.description}</p>
        </div>
      </div>

      <div className="flex-container">
        <div
          className="left-side"
          style={{ backgroundImage: `url(${post.image_url})` }}
        ></div>
        <div className="right-side">
          <p>{"✔️ Sizes: " + post.sizes}</p>
          <p className="details-price">{"🏷️ Price: " + post.price}</p>
          <p className="right-side-brand_name">{post.name}</p>
          <button className="add-to-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
          <Link to={`/reviews/create/${id}`}>
            <button className="addCommentBtn">Create Review</button>
          </Link>
          <Link to={`/edit/${id}`}>
            <button className="addCommentBtn">Edit Sneaker</button>
          </Link>
        </div>
      </div>
      <div className="flex-container">
        <div className="comments-container">
          <div className="comments">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <Review
                  key={comment.review_id}
                  id={comment.review_id}
                  rating={comment.rating}
                  reviewText={comment.review_text}
                />
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SneakerDetails;
