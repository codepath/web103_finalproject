// src/pages/AllPages.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/AllJournals.css'; // reuse styles
import axios from 'axios';

const AllPages = () => {
  const navigate = useNavigate();
  const { journalId } = useParams();

  const [journal, setJournal] = useState(null);
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract dynamic filter values from existing pages
  const uniqueTags = Array.from(
    new Set(
      pages.flatMap(p => {
        let tags = p.metadata?.tags || [];
        if (typeof tags === 'string') {
          tags = tags.split(',').map(t => t.trim());
        }
        return tags;
      })
    )
  );

  const uniqueLocations = Array.from(
    new Set(
      pages
        .map(p => p.metadata?.location)
        .filter(loc => loc && loc.trim() !== '')
    )
  );

  const uniqueDates = Array.from(
    new Set(
      pages
        .map(p => p.metadata?.date)
        .filter(d => d && d.trim() !== '')
        .map(d => {
          // Convert "November 18, 2025" → "2025-11"
          const parsed = new Date(d);
          return !isNaN(parsed) ? parsed.toISOString().slice(0, 7) : null;
        })
        .filter(Boolean)
    )
  );

  useEffect(() => {
    fetchJournalAndPages();
  }, [journalId]);

  const fetchJournalAndPages = async () => {
    try {
      setLoading(true);

      // fetch journal info
      const journalRes = await axios.get(`http://localhost:3000/api/journals/${journalId}`, {
        withCredentials: true,
      });
      setJournal(journalRes.data);

      // fetch pages for this journal
      const pagesRes = await axios.get(`http://localhost:3000/api/journals/${journalId}/pages`, {
        withCredentials: true,
      });
      setPages(pagesRes.data);

    } catch (err) {
      console.error('Error fetching pages:', err);
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/journals');

  const filteredPages = pages
    .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => {
      if (!filterDate) return true;
      const d = p.metadata?.date;
      if (!d) return false;
      const parsed = new Date(d);
      const yearMonth = !isNaN(parsed) ? parsed.toISOString().slice(0, 7) : '';
      return yearMonth === filterDate;
    })

    .filter(p => {
      if (!filterLocation) return true;
      return p.metadata?.location === filterLocation;
    })

    .filter(p => {
      if (filterTags.length === 0) return true;
      let tags = p.metadata?.tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(t => t.trim());
      }
      return filterTags.every(tag => tags.includes(tag));
    });

  const handleViewPage = (pageId) => {
    navigate(`/journals/${journalId}/view/${pageId}`);
  };

  const handleAddPage = () => {
    navigate(`/journals/${journalId}/pages/add`);
  };

  const toggleTag = (tag) => {
    setFilterTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  if (loading) {
    return (
      <div className="all-journals-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-journals-page">
      <i className="fa-solid fa-arrow-left back-button" onClick={handleBack} title="Back to Journals"></i>
      <h2>{journal?.name || 'Pages'}</h2>
      
      {journal?.description && (
        <p className="journal-description-subtitle">{journal.description}</p>
      )}

      {/* Search and Add Page Button Row */}
      <div className="search-create-row">
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-filled" onClick={handleAddPage}>
          <i className="fa-solid fa-plus"></i>
          Add a Page
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <span className="filters-label">Filters:</span>

        <div className="filter-group">
          <label>Date:</label>
            <select value={filterDate} onChange={e => setFilterDate(e.target.value)}>
              <option value="">All</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
        </div>

        <div className="filter-group">
          <label>Location:</label>
            {uniqueTags.map(tag => (
              <button
                key={tag}
                className={filterTags.includes(tag) ? 'selected' : ''}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
        </div>

        <div className="filter-group tags">
          <label>Tags:</label>
          {uniqueTags.map(tag => (
            <button
              key={tag}
              className={filterTags.includes(tag) ? 'selected' : ''}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Page Cards */}
      {filteredPages.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-file-lines"></i>
          <h3>No pages found</h3>
          <p>
            {pages.length === 0 
              ? "Add your first page to this journal!"
              : "Try adjusting your search or filters."
            }
          </p>
          {pages.length === 0 && (
            <button className="btn-filled" onClick={handleAddPage}>
              Add Your First Page
            </button>
          )}
        </div>
      ) : (
        <div className="journal-cards">
          {filteredPages.map(page => (
            <div key={page.id} className="journal-card" onClick={() => handleViewPage(page.id)}>
              <div className="journal-cover">
                {/* Placeholder color cover for pages */}
                <div className="color-cover" style={{ backgroundColor: '#FFFFFF' }}></div>
              </div>

              <div className="journal-info">
                <div className="journal-header">
                  <h2>{page.title}</h2>
                  <button 
                    className="add-page-button"
                    onClick={() => handleViewPage(page.id)}
                    aria-label="View page"
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                </div>

                <div className="journal-meta">
                  <span className="page-count">
                    {new Date(page.createdAt).toLocaleDateString()}
                  </span>
                  {page.location && <span className="page-count"> | {page.location}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AllPages;
