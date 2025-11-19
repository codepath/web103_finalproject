import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import '../css/PageDetails.css';

const PreviewPage = () => {
  const navigate = useNavigate();
  const { journalId, pageId } = useParams();
  
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (pageId) {
      fetch(`http://localhost:3000/api/journals/${journalId}/pages/${pageId}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setPageData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch page:', err);
          setIsLoading(false);
        });
    }
  }, [pageId, journalId]);

  const handleBack = () => {
    navigate(`/journals/${journalId}/pages/${pageId}`);
  };

  const handleSave = async () => {
    if (!pageData) {
      alert('No page data to save.');
      return;
    }

    setIsSaving(true);
    try {
      const url = `http://localhost:3000/api/journals/${journalId}/pages/${pageId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        throw new Error('Failed to save page');
      }

      const savedPage = await response.json();
      setShowSuccessMessage(true);
      // Navigate to journals page after showing success message
      setTimeout(() => {
        navigate('/journals');
      }, 1500);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Render page preview (same as PageDetails)
  const renderPagePreview = () => {
    if (isLoading) {
      return <div className="page-preview-loading">Loading...</div>;
    }

    if (!pageData) {
      return <div className="page-preview-empty">No page data available</div>;
    }

    const getBackgroundStyle = () => {
      if (pageData.pageBackgroundImage) {
        return {
          backgroundImage: `url(${pageData.pageBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
      const colorMap = {
        'white': '#ffffff',
        'gray': '#808080',
        'black': '#000000'
      };
      return {
        backgroundColor: colorMap[pageData.pageColor] || '#ffffff'
      };
    };

    const getTextColor = () => {
      if (pageData.pageBackgroundImage) {
        const darkBackgrounds = ['black.jpg'];
        const isDark = darkBackgrounds.some(bg => pageData.pageBackgroundImage.includes(bg));
        return isDark ? '#ffffff' : '#000000';
      }
      return pageData.pageColor === 'black' ? '#ffffff' : '#000000';
    };

    const getSpotifyEmbedUrl = (url) => {
      if (!url) return null;
      const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
      if (trackMatch && trackMatch[1]) {
        return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator`;
      }
      return null;
    };

    return (
      <div 
        className="page-preview-canvas"
        style={{
          ...getBackgroundStyle(),
          color: getTextColor(),
          minHeight: '500px',
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3'
        }}
      >
        {/* Images */}
        {pageData.images && pageData.images.map(image => (
          <div
            key={image.id}
            className="page-preview-image"
            style={{
              position: 'absolute',
              left: `${(image.x / 800) * 100}%`,
              top: `${(image.y / 600) * 100}%`,
              width: `${(image.width / 800) * 100}%`,
              maxWidth: '150px'
            }}
          >
            <img src={image.data} alt={image.fileName} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}

        {/* Doodle */}
        {pageData.doodle && (
          <img
            src={pageData.doodle}
            alt="Doodle"
            className="page-preview-doodle"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Stickers */}
        {pageData.stickers && pageData.stickers.map(sticker => (
          <div
            key={sticker.id}
            className="page-preview-sticker"
            style={{
              position: 'absolute',
              left: `${(sticker.x / 800) * 100}%`,
              top: `${(sticker.y / 600) * 100}%`,
              fontSize: '2rem'
            }}
          >
            {sticker.type === 'image' && sticker.image ? (
              <img src={sticker.image} alt={sticker.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
            ) : (
              <span>{sticker.emoji}</span>
            )}
          </div>
        ))}

        {/* Text Elements */}
        {pageData.textElements && pageData.textElements.map(text => (
          <div
            key={text.id}
            className="page-preview-text"
            style={{
              position: 'absolute',
              left: `${(text.x / 800) * 100}%`,
              top: `${(text.y / 600) * 100}%`,
              fontSize: `${(text.fontSize / 800) * 100}%`,
              color: text.color
            }}
          >
            {text.content}
          </div>
        ))}
      </div>
    );
  };

  // Render form fields (read-only in preview)
  const renderFormFields = () => {
    if (!pageData || !pageData.metadata) {
      return <div>No metadata available</div>;
    }

    const getSpotifyEmbedUrl = (url) => {
      if (!url) return null;
      const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
      if (trackMatch && trackMatch[1]) {
        return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator`;
      }
      return null;
    };

    return (
      <>
        <div className="page-form-field">
          <label className="page-form-label">Title</label>
          <div className="page-form-readonly">{pageData.metadata.title || 'N/A'}</div>
        </div>

        {/* Prompt Field */}
        {pageData.prompt && (
          <div className="page-form-field">
            <label className="page-form-label">Prompt</label>
            <div className="page-form-prompt-display">
              {pageData.prompt}
            </div>
          </div>
        )}

        {/* Spotify Song Field */}
        {getSpotifyEmbedUrl(pageData.spotifyUrl) && (
          <div className="page-form-field">
            <label className="page-form-label">Spotify Song</label>
            <div className="page-form-spotify-display">
              <iframe
                title="Spotify song"
                src={getSpotifyEmbedUrl(pageData.spotifyUrl)}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </div>
        )}

        <div className="page-form-field">
          <label className="page-form-label">Date</label>
          <div className="page-form-readonly">{pageData.metadata.date || 'N/A'}</div>
        </div>

        <div className="page-form-field">
          <label className="page-form-label">Location</label>
          <div className="page-form-readonly">{pageData.metadata.location || 'N/A'}</div>
        </div>

        <div className="page-form-field">
          <label className="page-form-label">Description</label>
          <div className="page-form-readonly">{pageData.metadata.description || 'N/A'}</div>
        </div>

        <div className="page-form-field">
          <label className="page-form-label">Tags</label>
          <div className="tags-display-readonly">
            {(() => {
              let tags = pageData.metadata.tags || [];
              if (typeof tags === 'string') {
                tags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
              }
              if (Array.isArray(tags) && tags.length > 0) {
                return tags.map((tag, index) => (
                  <span key={index} className="tag-chip-readonly">
                    {tag}
                  </span>
                ));
              }
              return <span className="no-tags">No tags</span>;
            })()}
          </div>
        </div>
      </>
    );
  };

  // Render footer actions
  const renderFooterActions = () => (
    <>
      <button className="page-footer-btn back" onClick={handleBack}>
        Back
      </button>
      <button 
        className="page-footer-btn primary" 
        onClick={handleSave}
        disabled={isSaving || !pageData}
      >
        {isSaving ? 'Saving...' : 'Save Page'}
      </button>
    </>
  );

  return (
    <>
      {showSuccessMessage && (
        <div className="page-save-success-overlay">
          <div className="page-save-success-message">
            <div className="success-icon">✓</div>
            <h3>Page Saved Successfully!</h3>
            <p>Your page has been saved to your journal.</p>
          </div>
        </div>
      )}
      <PageLayout
        title="Page Preview"
        pagePreview={renderPagePreview()}
        formFields={renderFormFields()}
        footerActions={renderFooterActions()}
        mode="preview"
      />
    </>
  );
};

export default PreviewPage;
