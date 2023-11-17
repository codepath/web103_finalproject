// Events.jsx
import React, { useState } from 'react';
import { events } from '../../../server/data/mockData';
import { FaBookmark, FaRegBookmark, FaShare } from 'react-icons/fa'; // Import icons from React Icons
import "../css/Events.css";

const Events = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

  const filteredEvents =
    selectedLevel === 'all'
      ? events
      : events.filter((event) => event.level.toLowerCase() === selectedLevel.toLowerCase());

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
  };

  const handleBookmarkToggle = (event) => {
    const isBookmarked = bookmarkedEvents.includes(event.title);

    if (isBookmarked) {
      // Remove from bookmarks
      setBookmarkedEvents(bookmarkedEvents.filter((title) => title !== event.title));
    } else {
      // Add to bookmarks
      setBookmarkedEvents([...bookmarkedEvents, event.title]);
    }
  };

  const handleShareClick = (event) => {
    // Replace 'your-email@example.com' with the desired recipient email
    const recipientEmail = 'your-email@example.com';
    const subject = encodeURIComponent(`Check out this event: ${event.title}`);
    const body = encodeURIComponent(`Learn more about this event: ${event.link}`);
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
  };

  return (
    <div className="events-container">
      <div className="events-heading-container">
        <h2 className="events-heading">Upcoming Hackathons</h2>
      </div>

      <div className="filter-options">
        <label>
          Filter by Level:{' '}
          <select value={selectedLevel} onChange={(e) => handleLevelChange(e.target.value)}>
            <option value="all">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
      </div>

      <ul className="event-list">
        {filteredEvents.map((event) => (
          <li key={event.title} className="event-item">
            <div className="event-header">
              <h3 className="event-title">{event.title}</h3>
              <div className="button-container">
                <button
                  className="bookmark-button"
                  onClick={() => handleBookmarkToggle(event)}
                >
                  {bookmarkedEvents.includes(event.title) ? <FaBookmark /> : <FaRegBookmark />}
                </button>
                <button
                  className="share-button"
                  onClick={() => handleShareClick(event)}
                >
                  <FaShare />
                </button>
              </div>
            </div>
            <p className="event-level">Level: {event.level}</p>
            <a href={event.link} target="_blank" rel="noopener noreferrer" className="event-link">
              Learn More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
