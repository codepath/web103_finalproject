import express from 'express'
import ReviewsController from '../controllers/reviews.js'

const reviewsRouter = express.Router()

reviewsRouter.get('/', ReviewsController.getReviews)
reviewsRouter.get('/:id', ReviewsController.getReviewById)

export default reviewsRouter