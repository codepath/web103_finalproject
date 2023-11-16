import express from 'express'
import UsersBooksController from '../controllers/users_books.js'

const router = express.Router()

router.post('/create/:book_id', UsersBooksController.createBookUser)
router.get('/users/:book_id', UsersBooksController.getBookUsers)
router.get('/books/:username', UsersBooksController.getUserBooks)

export default router
