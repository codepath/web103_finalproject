import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import '../css/PageDetails.css';

const PageDetails = () => {
  const navigate = useNavigate();
  const { journalId, pageId } = useParams();
  const location = useLocation();
  
  // Get today's date in a readable format
  const getTodayDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };
  
  // Get page data from navigation state or fetch from API
  const [pageData, setPageData] = useState(location.state?.pageData || null);
  const [formData, setFormData] = useState({
    title: '',
    date: getTodayDate(),
    location: '',
    description: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(!pageData);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch page data if not provided via navigation
  useEffect(() => {
    if (!pageData && pageId) {
      fetch(`http://localhost:3000/api/journals/${journalId}/pages/${pageId}`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          setPageData(data);
          if (data.metadata) {
            let tags = data.metadata.tags || [];
            if (typeof tags === 'string') {
              tags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
            }
            setFormData({
              title: data.metadata.title || '',
              date: data.metadata.date || getTodayDate(),
              location: data.metadata.location || '',
              description: data.metadata.description || '',
              tags: Array.isArray(tags) ? tags : []
            });
          } else {
            // Set default date if no metadata
            setFormData(prev => ({ ...prev, date: getTodayDate() }));
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch page:', err);
          setIsLoading(false);
        });
    } else if (pageData && pageData.metadata) {
      let tags = pageData.metadata.tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
      }
      setFormData({
        title: pageData.metadata.title || '',
        date: pageData.metadata.date || getTodayDate(),
        location: pageData.metadata.location || '',
        description: pageData.metadata.description || '',
        tags: Array.isArray(tags) ? tags : []
      });
      setIsLoading(false);
    } else if (pageData) {
      // Set default date even if no metadata
      setFormData(prev => ({ ...prev, date: getTodayDate() }));
      setIsLoading(false);
    }
  }, [pageId, journalId, pageData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...pageData,
        metadata: {
          ...pageData.metadata,
          ...formData,
          tags: Array.isArray(formData.tags) ? formData.tags : formData.tags
        }
      };

      const url = pageId 
        ? `http://localhost:3000/api/journals/${journalId}/pages/${pageId}`
        : `http://localhost:3000/api/journals/${journalId}/pages`;
      
      const method = pageId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save page details');
      }

      const savedPage = await response.json();
      navigate(`/journals/${journalId}/pages/${savedPage.id}/preview`);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save page details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/journals/${journalId}/pages/add`);
  };

  // Render page preview
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

  // Helper function to get Spotify embed URL
  const getSpotifyEmbedUrl = (url) => {
    if (!url) return null;
    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch && trackMatch[1]) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator`;
    }
    return null;
  };

  // Render form fields
  const renderFormFields = () => (
    <>
      <div className="page-form-field">
        <label htmlFor="title" className="page-form-label">Title</label>
        <input
          id="title"
          type="text"
          className="page-form-input"
          placeholder="Page Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>

      {/* Prompt Field */}
      {pageData?.prompt && (
        <div className="page-form-field">
          <label className="page-form-label">Prompt</label>
          <div className="page-form-prompt-display">
            {pageData.prompt}
          </div>
        </div>
      )}

      {/* Spotify Song Field */}
      {getSpotifyEmbedUrl(pageData?.spotifyUrl) && (
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
        <label htmlFor="date" className="page-form-label">Date</label>
        <input
          id="date"
          type="text"
          className="page-form-input"
          placeholder={getTodayDate()}
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
        />
      </div>

      <div className="page-form-field">
        <label htmlFor="location" className="page-form-label">Location</label>
        <input
          id="location"
          type="text"
          className="page-form-input"
          placeholder="Memory Location"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>

      <div className="page-form-field">
        <label htmlFor="description" className="page-form-label">Description</label>
        <textarea
          id="description"
          className="page-form-textarea"
          placeholder="Page Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div className="page-form-field">
        <label htmlFor="tags" className="page-form-label">Tags</label>
        <div className="tags-input-container">
          <div className="tags-display">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag-chip">
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => {
                    const newTags = formData.tags.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, tags: newTags }));
                  }}
                  aria-label={`Remove ${tag} tag`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            id="tags"
            type="text"
            className="tags-input"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && tagInput.trim()) {
                e.preventDefault();
                const newTag = tagInput.trim();
                if (!formData.tags.includes(newTag)) {
                  setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                  }));
                }
                setTagInput('');
              }
            }}
          />
        </div>
      </div>
    </>
  );

  // Render footer actions
  const renderFooterActions = () => (
    <>
      <button className="page-footer-btn back" onClick={handleBack}>
        Back
      </button>
      <button 
        className="page-footer-btn primary" 
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Preview'}
      </button>
    </>
  );

  return (
    <PageLayout
      title="Page Details"
      pagePreview={renderPagePreview()}
      formFields={renderFormFields()}
      footerActions={renderFooterActions()}
      mode="details"
    />
  );
};

export default PageDetails;
