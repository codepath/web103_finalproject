import express from 'express'
import cors from 'cors'
import userRoutes from './routes/users.js'
import foodItemRoutes from './routes/foodItems.js'
import mealRoutes from './routes/meals.js'
import mealFoodItemRoutes from './routes/mealFoodItems.js'
import ResetController from './controllers/reset.js'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">MacroMate API</h1>')
})

app.use('/api/users', userRoutes)
app.use('/api/food-items', foodItemRoutes)
app.use('/api/meals', mealRoutes)
app.use('/api/meal-food-items', mealFoodItemRoutes)
app.post('/api/reset', ResetController.resetDatabase)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
