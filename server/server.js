import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './config/api.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';

dotenv.config({ path: '.env' })

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Serve favicon conditionally if required
if (process.env.NODE_ENV === 'development') {
    // import favicon from 'serve-favicon';
    // app.use(favicon(path.resolve('client', 'public', 'favicon.png')));
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else if (process.env.NODE_ENV === 'production') {
    // Serve static files in production
    app.use(express.static(path.resolve('client', 'dist')));
}

// API routing
app.use('/api', router);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve('client', 'dist', 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
