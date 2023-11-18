// Events.jsx
import React, { useState } from 'react';
// import { events } from '../../../server/data/mockData';
import { FaBookmark, FaRegBookmark, FaShare } from 'react-icons/fa'; // Import icons from React Icons
import "../css/Events.css";

// create events array
const events = [
  { category: 'hackathon', title: 'Global Hack Week: Career Week', link: 'https://events.mlh.io/events/10077?_gl=1*bok2g4*_ga*MjEwMjQyNTIxMC4xNjk5NzMwODY2*_ga_E5KT6TC4TK*MTcwMDE0OTI1NC4yLjAuMTcwMDE0OTI1NC4wLjAuMA..', level: 'Beginner' },
{ category: 'hackathon', title: 'Generate the future in the 404', link: 'https://www.aiatl.io/', level: 'Intermediate' },
{ category: 'hackathon', title: 'Boston Hacks', link: 'https://bostonhacks.org/', level: 'Beginner' },
{ category: 'hackathon', title: 'Microsoft AI Classroom Hackathon', link: 'https://microsoftaiclassroom.devpost.com/?ref_feature=challenge&ref_medium=discover', level: 'Intermediate' },
{ category: 'hackathon', title: 'Google’s Immersive Geospatial Challenge', link: 'https://googlesimmersive.devpost.com/?ref_feature=challenge&ref_medium=discover', level: 'Beginner'},
{ category: 'hackathon', title: 'MLH Month Long Hackathon', link: 'https://hackfest-november.devpost.com/?ref_feature=challenge&ref_medium=discover', level: 'Beginner' },
]

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
