// cache for the access token and its expiry time
let cachedToken: string | null = null;
let tokenExpiryTime: number = 0;

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

        // If we need more fields for the frontend, yall can change it here
        return {
            id: data.id,
            name: data.name,
            artists: data.artists.map((artist: any) => artist.name),
            album: {
                name: data.album.name,
                image: data.album.images[0]?.url 
            },
            previewUrl: data.preview_url,
            duration: data.duration_ms,
            releaseDate: data.album.release_date
        };
    } catch (error) {
        console.error("Error fetching track from Spotify", error);
        throw error;
    }
}