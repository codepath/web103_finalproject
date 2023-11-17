import React, { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";

const CreateReview = () => {
  const { id } = useParams();
  const [reviewData, setReviewData] = useState({
    product_id: id, // Assign the product ID from the URL
    user_id: 1, // Assuming you have a logged-in user with an ID
    rating: "",
    review_text: "",
    review_date: new Date().toISOString().split("T")[0], // Get today's date in YYYY-MM-DD format
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
        // Optionally, handle success state or redirect the user
      } else {
        console.error("Failed to create review");
        // Optionally, handle the failure case
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">Leave a Review</Typography>
      <TextField
        name="rating"
        label="Rating (1-5)"
        type="number"
        InputProps={{ inputProps: { min: 1, max: 5 } }}
        value={reviewData.rating}
        onChange={handleChange}
        required
      />
      <TextField
        name="review_text"
        label="Review Text"
        multiline
        value={reviewData.review_text}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Review
      </Button>
    </form>
  );
};

export default CreateReview;
