import express from 'express'
import { pool } from './db/dbpool.js'
import cors from 'cors'
import IngredientsRoutes from './routes/ingredientsRoutes.js'
import RecipeRoutes from './routes/recipeRoutes.js'
import UserRoutes from './routes/userRoutes.js'
import PreferenceRoutes from './routes/preferencesRoutes.js'
import FavoriteRoutes from './routes/favoritesRoutes.js'
import KitchenRoutes from './routes/kitchenRoutes.js'
import ScheduledMealsRoutes from './routes/scheduledMealsRoutes.js'

// authentication libraries
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'

const app = express();

console.log("server setup")

app.use(express.json())

// auth


app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET, POST, PUT, DELETE, PATCH',
  credentials: true
}))

app.use(session({
  secret: 'codepath',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)
passport.serializeUser((user,done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id])
    done(null, result.rows[0])
  } catch (err) {
    done(err)
  }
})

// routes
app.use('/api', IngredientsRoutes)
app.use('/api', RecipeRoutes)
app.use('/api', UserRoutes)
app.use('/api', PreferenceRoutes)
app.use('/api', FavoriteRoutes)
app.use('/api', KitchenRoutes)
app.use('/api', ScheduledMealsRoutes)

app.use('/auth', authRoutes)

// app.get('/', function (req, res) {
//     res.send('hello, world!');
// });

app.listen(3000, function () {
    console.log('Server started on port 3000');
});

