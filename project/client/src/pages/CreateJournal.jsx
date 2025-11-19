// src/pages/CreateJournal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CreateJournal.css';
import axios from 'axios';

// Cover options - white removed from selectable options
const coverOptions = [
  { color: '#FFB6D9', name: 'pink', image: '/covers/pinkcover.jpg' },
  { color: '#9ED9CC', name: 'green', image: '/covers/greencover.jpg' },
  { color: '#A0CED9', name: 'blue', image: '/covers/bluecover.jpg' },
  { color: '#FFD580', name: 'yellow', image: '/covers/yellowcover.jpg' },
  { color: '#B8B8B8', name: 'gray', image: '/covers/graycover.jpg' },
];

const CreateJournal = () => {
  const navigate = useNavigate();

  const [journalName, setJournalName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(null); // Start with null (no selection)
  const [customImage, setCustomImage] = useState(null);
  const [customImagePreview, setCustomImagePreview] = useState(null);

  const handleBack = () => navigate('/journals');

  const handleCoverSelect = (cover) => {
    setSelectedCover(cover);
    setCustomImage(null);
    setCustomImagePreview(null);
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
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!journalName.trim()) {
      alert('Please enter a journal name.');
      return;
    }

    // Validate that user selected a cover or uploaded an image
    if (!selectedCover && !customImage) {
      alert('Please choose a cover or upload an image.');
      return;
    }

    if (customImage) {
      const formData = new FormData();
      formData.append('name', journalName.trim());
      formData.append('description', description.trim());
      formData.append('coverImage', customImage);
      formData.append('coverColor', '#FFFFFF');
      formData.append('coverName', 'custom');

      try {
        const response = await axios.post('http://localhost:3000/api/journals', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        
        console.log('Journal created:', response.data);
        navigate('/journals');
      } catch (err) {
        console.error('Error creating journal:', err);
        if (err.response?.status === 401) {
          alert('Please log in to create a journal.');
          navigate('/');
        } else {
          alert('Failed to create journal. Please try again.');
        }
      }
    } else {
      const journalData = {
        name: journalName.trim(),
        description: description.trim(),
        coverImage: selectedCover.image,
        coverColor: selectedCover.color,
        coverName: selectedCover.name,
        createdAt: new Date().toISOString(),
      };

      try {
        const response = await axios.post('http://localhost:3000/api/journals', journalData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        
        console.log('Journal created:', response.data);
        navigate('/journals');
      } catch (err) {
        console.error('Error creating journal:', err);
        if (err.response?.status === 401) {
          alert('Please log in to create a journal.');
          navigate('/');
        } else {
          alert('Failed to create journal. Please try again.');
        }
      }
    }
  };

  return (
    <div className="create-journal-page">
      <i className="fa-solid fa-arrow-left back-button" onClick={handleBack} title="Back to Journals"></i>
      <h1>Create New Journal</h1>

      <div className="create-journal-container">
        <div className="cover-preview-section">
          <div className="cover-preview">
            {customImagePreview ? (
              <img 
                src={customImagePreview} 
                alt="Custom journal cover"
                className="cover-image"
              />
            ) : selectedCover?.image ? (
              <img 
                src={selectedCover.image} 
                alt={`${selectedCover.name} journal cover`}
                className="cover-image"
              />
            ) : (
              <div className="color-cover" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="blank-cover-content">
                  <span className="blank-cover-text">Choose a cover below</span>
                </div>
              </div>
            )}
          </div>

          <div className="upload-section">
            <label htmlFor="image-upload" className="upload-label">
              <i className="fa-solid fa-upload"></i>
              Upload Custom Image
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
                  className={`color-circle ${selectedCover?.name === cover.name && !customImagePreview ? 'selected' : ''}`}
                  style={{ backgroundColor: cover.color }}
                  onClick={() => handleCoverSelect(cover)}
                  title={`${cover.name} cover`}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCoverSelect(cover);
                    }
                  }}
                >
                  {selectedCover?.name === cover.name && !customImagePreview && (
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
              maxLength={20}
              required
            />
            <span className="char-count">{journalName.length}/20</span>
          </div>

          <div className="form-group">
            <label htmlFor="journal-description">Description (optional)</label>
            <textarea
              id="journal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this journal about?"
              maxLength={50}
              rows={4}
            />
            <span className="char-count">{description.length}/50</span>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={handleBack}>
              Cancel
            </button>
            <button type="submit" className="btn-filled">
              Create Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJournal;