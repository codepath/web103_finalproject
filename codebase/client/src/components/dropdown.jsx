import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/dropdown.css';

const Dropdown = ({ title, options, setParams, params, filter}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const updatedFilters = {
      ...params,
      [filter]: option,
    };
    setParams(updatedFilters);
    console.log(updatedFilters);
  };

  return (
    <>
      <div className="dropdown">
        <label className="dropdown-btn">
          <span>{title}</span>
          <span className="arrow"></span>
        </label>

        <select
          className="dropdown-content"
          value={selectedOption}
          onChange={(e) => handleOptionSelect(e.target.value)}>
          <option value="">Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Dropdown;
