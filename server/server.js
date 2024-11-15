import express from 'express'
import cors from 'cors'
import tripRoutes from './routes/trips.js'

// create express app
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Trips API</h1>')
})

app.use('/api/trips', tripRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})