import express from 'express'
import cors from 'cors'
import itemRoutes from './routes/items.js'
import userRoutes from './routes/users.js'
import likesRoutes from './routes/likes.js'
// import activityRoutes from './routes/activities.js'
// import destinationRoutes from './routes/destinations.js'
// import tripDestinationRoutes from './routes/trips_destinations.js'

// create express app
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Welcome to The Jewelry Store</h1>')
})

app.use('/api/items', itemRoutes)
app.use('/api/users', userRoutes)
app.use('/api/likes', likesRoutes)
// app.use('/api/activities', activityRoutes)
// app.use('/api/destinations', destinationRoutes)
// app.use('/api/trips-destinations', tripDestinationRoutes)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
})