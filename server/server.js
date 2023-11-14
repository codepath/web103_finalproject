import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import booksRouter from './routes/books.js'
import readersRouter from './routes/readers.js'
import reviewsRouter from './routes/reviews.js'
import readersbooksRouter from './routes/readersbooks.js'
import BooksReviewsRouter from './routes/books_reviews.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;"> 📚 ReadRave API</h1>')
})

app.use('/api/books', booksRouter)
app.use('/api/readers', readersRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/readersbooks', readersbooksRouter)
app.use('/api/booksreviews', BooksReviewsRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
