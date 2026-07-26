import "./QuickViewPanel.css";

export default function QuickViewPanel({ artist, onClose }) {
  if (!artist) return null;

  return (
    <>
      <div className="qv-overlay" onClick={onClose} />
      <div className="qv-panel">
        <button className="qv-close" onClick={onClose}>
          ✕
        </button>
        <img src={artist.photo} alt={artist.name} className="qv-image" />

        <h2 className="qv-name">{artist.name}</h2>
        <span className="qv-genre">{artist.genre}</span>
        <p className="qv-bio">{artist.description}</p>

        <div className="qv-socials">
          {artist.instagram && (
            <a href={artist.instagram} target="_blank" rel="nonreferrer">
              Instagram
            </a>
          )}
          {artist.twitter && (
            <a href={artist.twitter} target="_blank" rel="nonreferrer">
              X
            </a>
          )}
          {artist.facebook && (
            <a href={artist.facebook} target="_blank" rel="nonreferrer">
              Facebook
            </a>
          )}
          {artist.tiktok && (
            <a href={artist.tiktok} target="_blank" rel="nonreferrer">
              TikTok
            </a>
          )}
        </div>

        {artist.spotify && (
          <iframe
            className="qv-spotify"
            src={artist.spotify}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; full-screen; picture-in-picture"
            loading="lazy"
          />
        )}

        <a href={`/artists/${artist.id}`} className="qv-full-profile">
          View Full Profile
        </a>
      </div>
    </>
  );
}
