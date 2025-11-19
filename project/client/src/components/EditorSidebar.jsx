import React, { useState, useRef } from 'react';
import '../css/AddPage.css';

const EditorSidebar = ({
  pageData,
  updatePageBackground,
  pageBackgrounds,
  stickerLibrary,
  handleStickerClick,
  expandedSections,
  toggleSection,
  isDoodling,
  startDoodling,
  stopDoodling,
  clearDoodle,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  doodleCanvasRef,
  textInput,
  setTextInput,
  textSize,
  setTextSize,
  textColor,
  setTextColor,
  handleAddText,
  handleImageUpload
}) => {
  return (
    <aside className="editor-sidebar">
      {/* Step 4: Page Background Section */}
      <div className="editor-section">
        <div className="section-header">
          <span className="star-icon"><i class="fa-solid fa-star"></i></span>
          <h3 className="section-title">Page Background</h3>
        </div>
        <div className="page-background-swatches">
          {pageBackgrounds.map(background => {
            const isSelected = pageData.pageBackgroundImage === background.image || 
                              (!pageData.pageBackgroundImage && pageData.pageColor === background.id);
            return (
              <button
                key={background.id}
                className={`page-background-swatch ${isSelected ? 'selected' : ''}`}
                onClick={() => updatePageBackground(background.id, background.image)}
                aria-label={`${background.name} background`}
                title={background.name}
              >
                <img 
                  src={background.image} 
                  alt={background.name}
                  className="background-swatch-image"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 5: Expandable Sections */}
      {/* Stickers Section */}
      <div className="editor-section expandable">
        <div
          className={`section-header clickable ${expandedSections.stickers ? 'expanded' : ''}`}
          onClick={() => toggleSection('stickers')}
        >
          <span className="star-icon"><i class="fa-solid fa-star"></i></span>
          <h3 className="section-title">Stickers</h3>
          <span className={`chevron-icon ${expandedSections.stickers ? 'rotated' : ''}`}>▼</span>
        </div>
        <div className={`section-content ${expandedSections.stickers ? 'expanded' : 'collapsed'}`}>
          <div className="stickers-grid">
            {stickerLibrary.map(sticker => (
              <button
                key={sticker.id}
                className="sticker-item"
                onClick={() => handleStickerClick(sticker)}
                title={sticker.name}
              >
                {sticker.type === 'image' && sticker.image ? (
                  <img 
                    src={sticker.image} 
                    alt={sticker.name}
                    className="sticker-image"
                  />
                ) : (
                  <span className="sticker-emoji">{sticker.emoji}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doodles Section */}
      <div className="editor-section expandable">
        <div
          className={`section-header clickable ${expandedSections.doodles ? 'expanded' : ''}`}
          onClick={() => toggleSection('doodles')}
        >
          <span className="star-icon"><i class="fa-solid fa-star"></i></span>
          <h3 className="section-title">Doodles</h3>
          <span className={`chevron-icon ${expandedSections.doodles ? 'rotated' : ''}`}>▼</span>
        </div>
        <div className={`section-content ${expandedSections.doodles ? 'expanded' : 'collapsed'}`}>
          <div className="doodle-controls">
            {!isDoodling ? (
              <button className="doodle-btn start-doodle-btn" onClick={startDoodling}>
                Start Doodling
              </button>
            ) : (
              <div className="doodle-options">
                <div className="control-group">
                  <label htmlFor="doodle-color">Color:</label>
                  <input
                    type="color"
                    id="doodle-color"
                    value={brushColor}
                    onChange={(e) => {
                      setBrushColor(e.target.value);
                      if (doodleCanvasRef.current) {
                        const ctx = doodleCanvasRef.current.getContext('2d');
                        ctx.strokeStyle = e.target.value;
                      }
                    }}
                    className="doodle-color-picker"
                  />
                </div>
                <div className="control-group">
                  <label htmlFor="doodle-brush-size">Brush Size:</label>
                  <input
                    type="range"
                    id="doodle-brush-size"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => {
                      const size = parseInt(e.target.value);
                      setBrushSize(size);
                      if (doodleCanvasRef.current) {
                        const ctx = doodleCanvasRef.current.getContext('2d');
                        ctx.lineWidth = size;
                      }
                    }}
                    className="doodle-brush-slider"
                  />
                  <span className="brush-size-value">{brushSize}</span>
                </div>
                <div className="control-group button-group">
                  <button className="doodle-btn clear-doodle-btn" onClick={clearDoodle}>
                    Clear
                  </button>
                  <button className="doodle-btn done-doodle-btn" onClick={stopDoodling}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div className="editor-section expandable">
        <div
          className={`section-header clickable ${expandedSections.text ? 'expanded' : ''}`}
          onClick={() => toggleSection('text')}
        >
          <span className="star-icon"><i class="fa-solid fa-star"></i></span>
          <h3 className="section-title">Text</h3>
          <span className={`chevron-icon ${expandedSections.text ? 'rotated' : ''}`}>▼</span>
        </div>
        <div className={`section-content ${expandedSections.text ? 'expanded' : 'collapsed'}`}>
          <div className="text-controls">
            <div className="control-group">
              <label htmlFor="text-input">Enter Text:</label>
              <textarea
                id="text-input"
                className="text-input"
                rows="3"
                placeholder="Type your text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.shiftKey) && e.key === 'Enter') {
                    e.preventDefault();
                    handleAddText();
                  }
                }}
              />
            </div>
            <div className="control-group">
              <label htmlFor="text-size">Size:</label>
              <input
                type="range"
                id="text-size"
                min="12"
                max="72"
                value={textSize}
                onChange={(e) => setTextSize(parseInt(e.target.value))}
                className="text-size-slider"
              />
              <span className="text-size-value">{textSize}</span>
            </div>
            <div className="control-group">
              <label htmlFor="text-color">Color:</label>
              <input
                type="color"
                id="text-color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="text-color-picker"
              />
            </div>
            <button className="text-btn add-text-btn" onClick={handleAddText}>
              Add Text to Page
            </button>
          </div>
        </div>
      </div>

      {/* Upload Images Section */}
      <div className="editor-section expandable">
        <div
          className={`section-header clickable ${expandedSections.upload ? 'expanded' : ''}`}
          onClick={() => toggleSection('upload')}
        >
          <span className="star-icon"><i class="fa-solid fa-star"></i></span>
          <h3 className="section-title">Upload Images</h3>
          <span className={`chevron-icon ${expandedSections.upload ? 'rotated' : ''}`}>▼</span>
        </div>
        <div className={`section-content ${expandedSections.upload ? 'expanded' : 'collapsed'}`}>
          <div className="upload-controls">
            <input
              type="file"
              id="image-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleImageUpload(file);
                e.target.value = '';
              }}
            />
            <div
              className="upload-area"
              onClick={() => document.getElementById('image-input')?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('drag-over');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('drag-over');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) handleImageUpload(files[0]);
              }}
            >
              <div className="upload-icon">📷</div>
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;

