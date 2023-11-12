// Events.jsx
import React from 'react';
import { mockData } from '../../../server/data/mockData'; // Update the path accordingly

const Events = () => {
  // Filter events with the 'hackathon' category
  const hackathonEvents = mockData.filter(event => event.category === 'hackathon');

  return (
    <div className="events-container">
      <h2>Upcoming Hackathons</h2>
      <ul>
        {hackathonEvents.map(event => (
          <li key={event.title}>
            <h3>{event.title}</h3>
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
