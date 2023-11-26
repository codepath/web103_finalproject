import React, { useState } from "react";
import { useParams } from "react-router-dom";

const CreateReview = () => {
  const { id } = useParams();
  const [reviewData, setReviewData] = useState({
    product_id: id,
    user_id: 1,
    rating: "",
    review_text: "",
    review_date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        console.log("Review created successfully!");
      } else {
        console.error("Failed to create review");
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Leave a Review</h2>
      <label>
        Rating (1-5)
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          value={reviewData.rating}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Review Text
        <textarea
          name="review_text"
          value={reviewData.review_text}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default CreateReview;
