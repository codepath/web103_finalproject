import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/CreateJournal.css';
import axios from 'axios';

const coverOptions = [
  { color: '#FFB6D9', name: 'pink', image: '/covers/pinkcover.jpg' },
  { color: '#9ED9CC', name: 'green', image: '/covers/greencover.jpg' },
  { color: '#A0CED9', name: 'blue', image: '/covers/bluecover.jpg' },
  { color: '#FFD580', name: 'yellow', image: '/covers/yellowcover.jpg' },
  { color: '#B8B8B8', name: 'gray', image: '/covers/graycover.jpg' },
];

const EditJournal = () => {
  const navigate = useNavigate();
  const { journalId: id } = useParams();

  const [journalName, setJournalName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(null);
  const [currentCoverImage, setCurrentCoverImage] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [customImagePreview, setCustomImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 EditJournal mounted');
    console.log('📋 Journal ID from URL:', id);
    console.log('📋 Journal ID type:', typeof id);
    fetchJournal();
  }, [id]);

  const fetchJournal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Fetching journal:', id);
      console.log('📡 Full URL:', `http://localhost:3000/api/journals/${id}`);
      
      const response = await axios.get(`http://localhost:3000/api/journals/${id}`, {
        withCredentials: true,
      });
      
      console.log('✅ Journal fetched successfully:', response.data);
      
      const journal = response.data;
      setJournalName(journal.name);
      setDescription(journal.description || '');
      setOriginalData(journal);
      
      // Determine cover type
      if (journal.coverImage) {
        const preset = coverOptions.find(c => c.image === journal.coverImage);
        if (preset) {
          console.log('🎨 Preset cover found:', preset.name);
          setSelectedCover(preset);
        } else {
          console.log('🖼️ Custom cover image:', journal.coverImage);
          setCurrentCoverImage(journal.coverImage);
          setCustomImagePreview(journal.coverImage);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching journal:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
      
      setError(err.response?.data?.message || 'Failed to load journal');
      
      if (err.response?.status === 401) {
        alert('Please log in to edit journals.');
        navigate('/');
      } else if (err.response?.status === 404) {
        console.error('❌ Journal not found. ID:', id);
        setTimeout(() => {
          alert('Journal not found. Redirecting to journals list.');
          navigate('/journals');
        }, 100);
      }
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/journals');

  const handleCoverSelect = (cover) => {
    setSelectedCover(cover);
    setCustomImage(null);
    setCustomImagePreview(null);
    setCurrentCoverImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomImagePreview(reader.result);
      setCustomImage(file);
      setSelectedCover(null);
      setCurrentCoverImage(null);
    };
    reader.readAsDataURL(file);
  };

  const hasChanges = () => {
    if (!originalData) return false;
    
    if (journalName.trim() !== originalData.name) return true;
    if (description.trim() !== (originalData.description || '')) return true;
    if (customImage) return true;
    if (selectedCover && selectedCover.image !== originalData.coverImage) return true;
    
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!journalName.trim()) {
      alert('Please enter a journal name.');
      return;
    }

    if (!hasChanges()) {
      alert('No changes detected.');
      return;
    }

    console.log('💾 Saving changes to journal:', id);

    if (customImage) {
      const formData = new FormData();
      formData.append('name', journalName.trim());
      formData.append('description', description.trim());
      formData.append('coverImage', customImage);
      formData.append('coverColor', '#FFFFFF');
      formData.append('coverName', 'custom');

      try {
        const response = await axios.put(`http://localhost:3000/api/journals/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        
        console.log('✅ Journal updated:', response.data);
        navigate('/journals');
      } catch (err) {
        console.error('❌ Error updating journal:', err);
        alert('Failed to update journal. Please try again.');
      }
    } else {
      const journalData = {
        name: journalName.trim(),
        description: description.trim(),
        coverImage: selectedCover?.image || currentCoverImage,
        coverColor: selectedCover?.color || originalData.coverColor,
        coverName: selectedCover?.name || originalData.coverName,
      };

      console.log('📤 Sending update:', journalData);

      try {
        const response = await axios.put(`http://localhost:3000/api/journals/${id}`, journalData, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        
        console.log('✅ Journal updated:', response.data);
        navigate('/journals');
      } catch (err) {
        console.error('❌ Error updating journal:', err);
        alert('Failed to update journal. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="create-journal-page">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            margin: '0 auto 1rem',
            border: '4px solid #e5e7eb',
            borderTopColor: '#493000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading journal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-journal-page">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1rem' }}></i>
          <h2 style={{ color: '#000000', marginBottom: '1rem' }}>Error Loading Journal</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
          <button className="btn-filled" onClick={() => navigate('/journals')}>
            Back to Journals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-journal-page">
      <i className="fa-solid fa-arrow-left back-button" onClick={handleBack} title="Back to Journals"></i>
      <h1>Edit Journal</h1>

      <div className="create-journal-container">
        <div className="cover-preview-section">
          <div className="cover-preview">
            {customImagePreview ? (
              <img src={customImagePreview} alt="Journal cover" className="cover-image" />
            ) : selectedCover?.image ? (
              <img src={selectedCover.image} alt={`${selectedCover.name} journal cover`} className="cover-image" />
            ) : currentCoverImage ? (
              <img src={currentCoverImage} alt="Journal cover" className="cover-image" />
            ) : (
              <div className="color-cover" style={{ backgroundColor: originalData?.coverColor || '#FFFFFF' }}>
                <div className="blank-cover-content">
                  <i className="fa-solid fa-image blank-cover-icon"></i>
                  <span className="blank-cover-text">Choose a cover below</span>
                </div>
              </div>
            )}
          </div>

          <div className="upload-section">
            <label htmlFor="image-upload" className="upload-label">
              <i className="fa-solid fa-upload"></i>
              Upload New Cover Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div className="color-options">
            <p className="color-options-label">Or choose a preset:</p>
            <div className="color-circles">
              {coverOptions.map((cover) => (
                <div
                  key={cover.name}
                  className={`color-circle ${selectedCover?.name === cover.name ? 'selected' : ''}`}
                  style={{ backgroundColor: cover.color }}
                  onClick={() => handleCoverSelect(cover)}
                  title={`${cover.name} cover`}
                  role="button"
                  tabIndex={0}
                >
                  {selectedCover?.name === cover.name && (
                    <i className="fa-solid fa-check"></i>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form className="journal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="journal-name">Journal Name *</label>
            <input
              id="journal-name"
              type="text"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              placeholder="My Amazing Journal"
              maxLength={50}
              required
            />
            <span className="char-count">{journalName.length}/10</span>
          </div>

          <div className="form-group">
            <label htmlFor="journal-description">Description (optional)</label>
            <textarea
              id="journal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this journal about?"
              maxLength={200}
              rows={4}
            />
            <span className="char-count">{description.length}/50</span>
          </div>

          {hasChanges() && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>You have unsaved changes</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={handleBack}>
              Cancel
            </button>
            <button type="submit" className="btn-filled" disabled={!hasChanges()}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJournal;