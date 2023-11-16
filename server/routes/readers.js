import express from 'express'
import ReadersController from '../controllers/readers.js'

const readersRouter = express.Router()

readersRouter.get('/', ReadersController.getReaders)
readersRouter.get('/:id', ReadersController.getReaderById)

export default readersRouter