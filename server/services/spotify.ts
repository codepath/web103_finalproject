// cache for the access token and its expiry time
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

// import require for CommonJS module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let spotifyPreviewFinder: ((songName: string, artistName?: string, limit?: number) => Promise<any>) | null = null;
try {
    spotifyPreviewFinder = require('spotify-preview-finder');
    console.log('Spotify preview finder loaded successfully');
} catch (error) {
    console.error('Failed to load spotify-preview-finder:', error);
}

// request an access token from Spotify with client credentials flow
export async function getSpotifyAccessToken(): Promise<string | null> {
    // return cached token if it's still valid
    if (cachedToken && Date.now() < tokenExpiryTime) {
        return cachedToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Missing Spotify client ID or secret in env file");
        return null;
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + credentials,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });
        
        if (!response.ok) {
            console.error("Failed to fetch Spotify access token", await response.text());
            return null;
        }

        const data = await response.json();
        cachedToken = data.access_token;
        // expires in like 3600 normally so I cached it with a small buffer
        tokenExpiryTime = Date.now() + (data.expires_in - 60) * 1000;
        
        return cachedToken;
    } catch (error) {
        console.error("Error fetching Spotify access token", error);
        return null;
    }
}

// helper to get preview URL using the preview finder as fallback
async function getPreviewUrl(songName: string, artistName: string, apiPreviewUrl: string | null): Promise<string | null> {
    if (apiPreviewUrl) {
        return apiPreviewUrl;
    }
    
    if (!spotifyPreviewFinder) {
        console.log(`No preview URL from API and preview finder not available`);
        return null;
    }

    try {
        console.log(`No preview URL from API, searching for: "${songName}" by "${artistName}"`);
        const result = await spotifyPreviewFinder(songName, artistName, 1);
        
        if (result.success && result.results.length > 0) {
            const firstResult = result.results[0];
            if (firstResult.previewUrls && firstResult.previewUrls.length > 0) {
                const previewUrl = firstResult.previewUrls[0];
                console.log(`Preview finder found URL: ${previewUrl}`);
                return previewUrl;
            }
        }
        
        console.log('Preview finder: No preview URL found');
        return null;
    } catch (error) {
        console.error(`Preview finder failed:`, error);
        return null;
    }
}

// fetch track details from Spotify
export async function getTrack(trackId: string) {
    const token = await getSpotifyAccessToken();
    
    if (!token) {
        throw new Error("Unable to get Spotify access token");
    }

    const trackUrl = `https://api.spotify.com/v1/tracks/${trackId}?market=US`;

    try {
        const response = await fetch(trackUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to fetch track from Spotify", errorText);
            throw new Error(`Spotify API error: ${response.status}`);
        }

        const data = await response.json();
        
        // Im getting the preview URL by passing song name and artist for the finder
        const songName = data.name;
        const artistName = data.artists[0]?.name || '';
        const previewUrl = await getPreviewUrl(songName, artistName, data.preview_url);

        // If we need more fields for the frontend, yall can change it here
        return {
            id: data.id,
            name: data.name,
            artists: data.artists.map((artist: any) => artist.name),
            album: {
                name: data.album.name,
                image: data.album.images[0]?.url 
            },
            previewUrl,
            duration: data.duration_ms,
            releaseDate: data.album.release_date
        };
    } catch (error) {
        console.error("Error fetching track from Spotify", error);
        throw error;
    }
}