import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';

const app = express();

app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     credentials: true
// }));

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     credentials: true
// }))
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API'
    });
});

app.use('/user', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})