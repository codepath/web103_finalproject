import React from "react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useGameQueryStore from "../src/store";

const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const setSearchText = useGameQueryStore(s => s.setSearchText);
  const navigate = useNavigate();

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      if (ref.current) {
        setSearchText(ref.current.value);
        navigate('/');
      }
    }}>
      <div className="flex flex-row">
            <div className="accent-white">
                <BsSearch className="white"/>
            </div>
            <input
                type="text"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search for games..."
            />
        </div>
    </form>
  );
};

export default SearchBar;
