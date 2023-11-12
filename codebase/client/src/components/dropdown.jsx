// components/Dropdown.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/dropdown.css';

const Dropdown = ({ title, options, id }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <div className="dropdown">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={id} className="dropdown-btn">
          <span>{title}</span>
          <span className="arrow"></span>
        </label>

        <ul className={`dropdown-content ${isChecked ? 'visible' : ''}`} role="menu">
          {options.map((option, index) => (
            <li key={index}><a href="#">{option}</a></li>
          ))}
        </ul>
      </div>
    </>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.string.isRequired,
};

export default Dropdown;
