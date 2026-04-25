import React from 'react';
import '../styles/Filter.css';

const Filter = ({ 
  sortBy, 
  onSortChange,
  selectedCategory,
  onCategoryChange,
  categories, 
}) => {
  return (
    <div className="filter-bar">

      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="sort-dropdown"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === 'all' ? 'All Categories' : category}
          </option>
        ))}
      </select>



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