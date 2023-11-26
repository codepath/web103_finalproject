import React from "react";

const Review = ({ id, rating, reviewText }) => {
  return (
    <div className="review">
      {/* <p>Review ID: {id}</p>  */}
      <p>Rating: {rating}</p>
      <p>Review: {reviewText}</p>
      <hr />
    </div>
  );
};

export default Review;
