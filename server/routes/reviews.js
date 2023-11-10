import express from "express";

import CommentsController from "../controllers/reviews.js";

const router = express.Router();

router.get("/", CommentsController.getReviews);
router.get("/:sneaker_id", CommentsController.getProductReviews);
router.post("/:sneaker_id", CommentsController.createReview);
router.delete("/:id", CommentsController.deleteReview);
router.patch("/:id", CommentsController.updateReview);

export default router;
