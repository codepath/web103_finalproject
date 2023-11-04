import React from "react";
import { useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useGameQueryStore from "../store";

const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const setSearchText = useGameQueryStore(s => s.setSearchText);
  const navigate = useNavigate();

  return (
    <form 
    className="w-full"
    onSubmit={(event) => {
      event.preventDefault();
      if (ref.current) {
        setSearchText(ref.current.value);
        navigate('/');
      }
    }}>
      <div className="flex flex-row justify-center w-full gap-2 p-4">
            
            <input
                type="text"
                className="w-full h-[30px] rounded-lg"
                placeholder="Search for games..."
            />
            <div className="fill-white flex flex-col justify-center align-bottom">
                <BsSearch className="fill-white "/>
            </div>
        </div>
    </form>
  );
};

export default SearchBar;
