import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import booksRouter from './routes/books.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/books', booksRouter)
app.get('/*', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;"> 📚 ReadRave API</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})
