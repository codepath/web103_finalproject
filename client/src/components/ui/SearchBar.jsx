import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('')

  const handleChange = (event) => {
    setSearchValue(event.target.value)
  }

  return (
    <div className="search-bar">
      <select name="" id="">
        <option value="projects">Projects</option>
        <option value="posts">Posts</option>
        <option value="people">People</option>
      </select>
      <input 
        type="text" 
        name="searchValue" 
        id="searchValue" 
        placeholder="Search" 
        className="w-full"
        value={searchValue}
        onChange={handleChange}
      />
      <SearchIcon />
    </div>
  )
}

export default SearchBar