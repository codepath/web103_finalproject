import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js';
import PostRoutes from './routes/PostRoutes.js';  
import CommentRoutes from './routes/CommentRoutes.js';  
import ResourceRoutes from './routes/ResourceRoutes.js';  
import TypeRoutes from './routes/TypeRoutes.js';  

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ CodeFM Backend</h1>');
});


app.use('/api/users', UserRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/resources', ResourceRoutes);
app.use('/api/types', TypeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
