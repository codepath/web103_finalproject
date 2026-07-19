import React from 'react';
import '../styles/Filter.css';

const Filter = ({ sortBy, onSortChange }) => {
  return (
    <div className="filter-bar">
      <label htmlFor="sort-select">Sort By:</label>
      <select 
        id="sort-select"
        value={sortBy} 
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-dropdown"
      >
        <option value="score">Most relevant</option>
        <option value="title">Title A–Z</option>
        <option value="-title">Title Z–A</option>
        <option value="-price">Price descending</option>
        <option value="price">Price ascending</option>
      </select>
    </div>
  );
};

export default Filter;