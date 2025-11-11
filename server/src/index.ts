import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getTrack } from '../services/spotify.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Beatdle API is running!');
});

app.get('/api/spotify/track/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const track = await getTrack(id);
    res.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ 
      error: 'Failed to fetch track from Spotify',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// callback route for Spotify OAuth if we need it later
// spotify asked me to have a callback URL obligatory 
app.get('/callback', (req, res) => {
  console.log('Spotify callback hit with params:', req.query);
  res.send('Callback received');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});