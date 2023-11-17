import express from "express";
import path from "path";
import favicon from "serve-favicon";
import cors from 'cors';
import moviesRoutes from './routes/movies.js';
import dotenv from 'dotenv';

import tagsRoutes from './routes/tags.js';
import wishlistRoutes from './routes/wishlist.js'
import moviesTagsRoutes from './routes/movies_tags.js'

dotenv.config();

// Configure port number
const PORT = process.env.PORT || 3000;

// Initialize the express server
const app = express();

// Add the express middleware to parse JSON data from HTTP request
app.use(express.json());
// Add the cors middleware to enable CROSS ORIGIN
app.use(cors());

// Use the API endpoint
app.use('/api/movies', moviesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/moviesTags', moviesTagsRoutes)



app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">🎥 CineMundo API</h1>');
});



/**
 * Determine environment and configure accordingly to produce/deploy the app
 */
if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'cine.jpg')));
} else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'cine.jpg')));
    app.use(express.static('public'));
}


/**
 * @description Start the server
 * @param {number} port - Port number
 */
if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    );
}

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
})