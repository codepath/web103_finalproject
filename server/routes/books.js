import express from 'express'
import BooksController from '../controllers/books.js'

const booksRouter = express.Router()

booksRouter.get('/', BooksController.getBooks)
booksRouter.get('/:id', BooksController.getBookById)
booksRouter.post('/', BooksController.createBook)
booksRouter.delete('/:id', BooksController.deleteBook)
booksRouter.patch('/:id', BooksController.updateBook)

export default booksRouter