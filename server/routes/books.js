import express from 'express'
import BooksController from '../controllers/books.js'

const booksRouter = express.Router()

booksRouter.get('/', BooksController.getBooks)
booksRouter.get('/:id', BooksController.getBookById)

export default booksRouter