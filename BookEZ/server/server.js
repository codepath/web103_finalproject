import express from 'express'
import EmployeeRouter from './routes/EmployeeRouter.js'
import TimeslotRouter from './routes/TimeslotRouter.js'
import SalonRouter from './routes/SalonRouter.js'
import BookingRouter from './routes/BookingRouter.js'
import UserRouter from './routes/UserRouter.js'
import AuthRouter from './routes/AuthRouter.js'
import cors from 'cors'
const app = express()

app.use(cors()) // This enables CORS for all routes
app.use(express.json()) // This parses incoming JSON requests

app.get('/', (req, res) => {
  res
    .status(200)
    .send('<h1 style="text-align: center; margin-top: 50px;">BookEZ API</h1>')
})

app.use('/api/salon', SalonRouter)
app.use('/api/employee', EmployeeRouter)
app.use('/api/timeslot', TimeslotRouter)
app.use('/api/booking', BookingRouter)
app.use('/api/user', UserRouter)
app.use('/api/auth', AuthRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
