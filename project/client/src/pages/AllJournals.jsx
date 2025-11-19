import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/AllJournals.css';
import axios from 'axios';

const AllJournals = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [journals, setJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);

  const locations = ['New York', 'Los Angeles', 'Chicago', 'Other'];
  const tags = ['Travel', 'Work', 'Personal', 'School'];

  useEffect(() => {
    fetchJournals();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/journals', {
        withCredentials: true,
      });
      setJournals(response.data);
    } catch (err) {
      console.error('Error fetching journals:', err);
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredJournals = journals
    .filter(j => j.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(j => filterDate ? j.createdAt?.includes(filterDate) : true)
    .filter(j => filterLocation ? j.location === filterLocation : true)
    .filter(j => filterTags.length > 0 ? filterTags.every(tag => j.tags?.includes(tag)) : true);

  const handleAddPage = (e, journalId) => {
    e.stopPropagation();
    navigate(`/journals/${journalId}/pages/add`);
  };

  const handleViewJournal = (journalId) => {
    navigate(`/journals/${journalId}`);
  };

  const toggleMenu = (e, journalId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === journalId ? null : journalId);
  };

  const handleEdit = (e, journalId) => {
    e.stopPropagation();
    navigate(`/journals/${journalId}/edit`);
  };

  const handleDelete = async (e, journalId) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this journal? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/journals/${journalId}`, {
        withCredentials: true,
      });
      
      setJournals(journals.filter(j => j.id !== journalId));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Error deleting journal:', err);
      alert('Failed to delete journal. Please try again.');
    }
  };

  const toggleTag = (tag) => {
    setFilterTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleCreateJournal = () => {
    navigate('/journals/create');
  };

  if (loading) {
    return (
      <div className="all-journals-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your journals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-journals-page">
      {/* Centered Title */}
      <h2>All Journals</h2>

      {/* Search and Create Button Row */}
      <div className="search-create-row">
        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search your journals"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-filled" onClick={handleCreateJournal}>
          <i className="fa-solid fa-plus"></i>
          Create New Journal
        </button>
      </div>

      {filteredJournals.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-book-open"></i>
          <h3>No journals found</h3>
          <p>
            {journals.length === 0 
              ? "Start journaling your memories by creating your first journal!"
              : "Try adjusting your search or filters."
            }
          </p>
          {journals.length === 0 && (
            <button className="btn-filled" onClick={handleCreateJournal}>
              Create Your First Journal
            </button>
          )}
        </div>
      ) : (
        <div className="journal-cards">
          {filteredJournals.map(journal => (
            <div key={journal.id} className="journal-card" onClick={() => handleViewJournal(journal.id)}>
              <div className="journal-cover">
                {journal.coverImage ? (
                  <img 
                    src={
                      journal.coverImage?.startsWith('/uploads') 
                        ? `http://localhost:3000${journal.coverImage}` 
                        : journal.coverImage
                    }
                    alt={`${journal.name} cover`} 
                  />
                ) : (
                  <div
                    className="color-cover"
                    style={{ backgroundColor: journal.coverColor || '#493000' }}
                  ></div>
                )}
                
                <div className="menu-container">
                  <button 
                    className="menu-button"
                    onClick={(e) => toggleMenu(e, journal.id)}
                    aria-label="Options"
                  >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                  
                  {openMenuId === journal.id && (
                    <div className="dropdown-menu">
                      <button onClick={(e) => handleEdit(e, journal.id)}>
                        <i className="fa-solid fa-pen"></i>
                        Edit
                      </button>
                      <button onClick={(e) => handleDelete(e, journal.id)} className="delete-option">
                        <i className="fa-solid fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="journal-info">
                <div className="journal-header">
                  <h2>{journal.name}</h2>
                  <button 
                    className="add-page-button"
                    onClick={(e) => handleAddPage(e, journal.id)}
                    aria-label="Add page"
                  >
                    <i className="fa-solid fa-circle-plus"></i>
                  </button>
                </div>
                
                {journal.description && (
                  <p className="journal-description">{journal.description}</p>
                )}
                
                <div className="journal-meta">
                  <span className="page-count">
                    <i className="fa-solid fa-file"></i>
                    {journal.pageCount || 0} pages
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJournals;