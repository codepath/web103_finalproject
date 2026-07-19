import './QuickViewPanel.css';

export default function QuickViewPanel({ artist, onClose }) {
    if (!artist) return null;

    return (
        <>
            <div className='qv-overlay' onClick={onClose} />
            <div className='qv-panel'>
                <button className='qv-close' onClick={onClose}>✕</button>
                <img
                    src={artist.photo}
                    alt={artist.name}
                    className='qv-image'
                />
                
                <h2 className='qv-name'>{artist.name}</h2>
                <span className='qv-genre'>{artist.genre}</span>
                <p className='qv-bio'>{artist.bio}</p>

                <div className='qv-socials'>
                    {artist.instagram && (
                        <a href={artist.instagram} target="_blank" rel="nonreferrer">Instagram</a>
                    )}
                    {artist.x && (
                        <a href={artist.x} target="_blank" rel="nonreferrer">X</a>
                    )}
                    {artist.tiktok && (
                        <a href={artist.tiktok} target="_blank" rel="nonreferrer">TikTok</a>
                    )}
                </div>

                {artist.spotify_url && (
                    <iframe
                        className='qv-spotify'
                        src={artist.spotify_url}
                        width="100%"
                        height="80"
                        allow="autoplay; clipboard-write; encrypted-media; full-screen; picture-in-picture"
                        loading="lazy"
                    />
                )}

                <a href={`/artists/${artist.id}`} className='qv-full-profile'>
                    View Full Profile
                </a>

            </div>
        </>
    );
}