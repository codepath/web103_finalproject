import express from 'express'
import cors from 'cors'

import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import path from 'path'

// import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import expenseRoutes from './routes/expense.js';
import incomeRoutes from './routes/income.js';
import goalRoutes from './routes/savingGoal.js';
import reportRoutes from './routes/report.js';

import authRoutes from './routes/auth.js'

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
}

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://budgetbuddy-a1mr.onrender.com' : 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
};

app.use(cors(corsOptions));

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     credentials: true
// }))

// app.use(cors({
//     origin: 'https://budgetbuddy-a1mr.onrender.com',
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     credentials: true
// }))

app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)
passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️Budget Buddy API</h1>')
})

app.use('/auth', authRoutes)
// app.use('/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/goal', goalRoutes);
app.use('/api/report', reportRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})