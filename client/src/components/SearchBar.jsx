import { useState } from 'react'

const styles = {
  search: {
    padding: "8px 12px",
    width: "250px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
  },
};

// If a parent passes `value` + `onChange`, the parent owns the text (controlled).
// Otherwise the input keeps its own state so `<Search />` still works on its own.
function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const [internalQuery, setInternalQuery] = useState("");

  const isControlled = value !== undefined
  const query = isControlled ? value : internalQuery

  const handleChange = (e) => {
    if (isControlled) {
      onChange(e.target.value)
    } else {
      setInternalQuery(e.target.value)
    }
  }

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      style={styles.search}
    />
  );
}

export default SearchBar;