import express from 'express'
import ReadersBooksController from '../controllers/readersbooks.js'

const readersbooksRouter = express.Router()

readersbooksRouter.get('/', ReadersBooksController.getReadersBooks)
readersbooksRouter.get('/books/:reader_id', ReadersBooksController.getAllBooks)
readersbooksRouter.get('/readers/:book_id', ReadersBooksController.getAllReaders)
readersbooksRouter.post('/', ReadersBooksController.createReaderBook)

export default readersbooksRouter