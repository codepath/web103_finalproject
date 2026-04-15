import './config/dotenv.js'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import authRoutes from './routes/auth.js'
import allRoutes from './routes/allRoutes.js'

const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

const app = express()

if (isProduction) {
    app.set('trust proxy', 1)
}

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: 'GET,POST,PUT,DELETE,PATCH',
        credentials: true,
    })
)
app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    }
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

app.use('/auth', authRoutes)
app.use('/api', allRoutes)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
