import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import booksRouter from './routes/books.js'
import readersRouter from './routes/readers.js'
import reviewsRouter from './routes/reviews.js'
import readersbooksRouter from './routes/readersbooks.js'
import BooksReviewsRouter from './routes/books_reviews.js'
import userBookRoutes from './routes/users_books.js'

import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'


dotenv.config()
const app = express()

app.use(session({
    secret: 'codepath',
    resave: false,
    saveUninitialized: true
}))

const CLIENT_URL = 'http://localhost:5173'

app.use(express.json())
app.use(cors({
    origin: CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)

passport.serializeUser((user, done) => {
done(null, user)
})

passport.deserializeUser((user, done) => {
done(null, user)
})

app.get('/', (req, res) => {
    res.redirect(CLIENT_URL)
})

// authentication routes
app.use('/auth', authRoutes)

app.use('/api/books', booksRouter)
app.use('/api/readers', readersRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/readersbooks', readersbooksRouter)
app.use('/api/booksreviews', BooksReviewsRouter)
app.use('/api/users-books', userBookRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
