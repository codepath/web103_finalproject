import express from 'express';
import cors from 'cors';
import UserRoutes from './routes/UserRoutes.js'; // Ensure the path and file extension are correct
import PostRoutes from './routes/PostRoutes.js'; // Ensure the path and file extension are correct
import CommentRoutes from './routes/CommentRoutes.js'; // Ensure the path and file extension are correct
import ResourceRoutes from './routes/ResourceRoutes.js'; // Ensure the path and file extension are correct
import TypeRoutes from './routes/TypeRoutes.js'; // Ensure the path and file extension are correct

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">✈️ OnTheFly API</h1>');
});

// Use specific paths for each set of routes, similar to your instructor's approach
app.use('/api/users', UserRoutes);
app.use('/api/posts', PostRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/resources', ResourceRoutes);
app.use('/api/types', TypeRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
