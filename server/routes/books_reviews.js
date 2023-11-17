import express from 'express'

import BooksReviewsController from '../controllers/books_reviews.js'

const BooksReviewsRouter = express.Router()

BooksReviewsRouter.get('/', BooksReviewsController.getBooksReviews)
BooksReviewsRouter.get('/:book_id', BooksReviewsController.getAllReviews)
BooksReviewsRouter.post('/:book_id', BooksReviewsController.createBookReview)

export default BooksReviewsRouter