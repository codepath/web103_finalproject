import express from 'express'
import cors from 'cors'
import groupRoutes from './routes/groups.js'

//Initialize an Express instance.
const app = express()

//add middlewares
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Learn More 2gether</h1>')
})

app.use('/api/groups', groupRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
