import express from 'express'
import cors from 'cors'
import groupRoutes from './routes/groups.js'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'
import './config/dotenv.js'

//Initialize an Express instance.
const app = express()

//add middlewares
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(cors({
  origin: 'http://localhost:3002',
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
}) //put the user in pasport in req.user

app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Learn More 2gether</h1>')
})

app.use('/api/groups', groupRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})
