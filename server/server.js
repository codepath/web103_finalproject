import './config/dotenv.js'
import express from 'express'
import cors from 'cors'
import apiRouters from './routes/api-routers.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', apiRouters)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('Server listening on port: ', PORT)
})