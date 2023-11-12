import express from 'express'
import ReviewsController from '../controllers/reviews.js'

const reviewsRouter = express.Router()

reviewsRouter.get('/', ReviewsController.getReviews)
reviewsRouter.get('/:id', ReviewsController.getReviewById)
reviewsRouter.post('/', ReviewsController.createReview)
reviewsRouter.delete('/:id', ReviewsController.deleteReview)
reviewsRouter.patch('/:id', ReviewsController.updateReview)

export default reviewsRouter