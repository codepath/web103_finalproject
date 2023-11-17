import express from 'express'
import ReviewsController from '../controllers/reviews.js'

const reviewsRouter = express.Router()

reviewsRouter.get('/', ReviewsController.getReviews)
// reviewsRouter.get(':id', ReviewsController.getReviewById)
reviewsRouter.get('/:book_id', ReviewsController.getReviewByBookId )
reviewsRouter.post('/:book_id', ReviewsController.createReview)
reviewsRouter.delete('/:id', ReviewsController.deleteReview)
reviewsRouter.patch('/:id', ReviewsController.updateReview)

export default reviewsRouter