import React, { useState } from "react";
import { Link } from "react-router-dom";
import stayvueLogo from "../assets/StayVue.png";
import search from "../assets/search.png";
import LoginModal from "./LoginModal";
import DropdownMenu from "./DropdownMenu";

const Navbar = ({ isModalOpen, setIsModalOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleButtonClick = (label) => {
    // Add your logic here to handle button clicks
  };

  const toggleDropdown = () => {
    if (!isModalOpen) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const toggleLoginModal = () => {
    setIsModalOpen(!isModalOpen);
    console.log("MODAL open");
  };

  return (
    <nav className="bg-white border-b-1 border-gray-300 w-full mt-4">
      <div className="flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <img src={stayvueLogo} alt="Logo" className="w-32 ml-3" />
          </Link>
        </div>
        <div className="search-bar rounded-3xl p-4 shadow-md flex items-center w-3/6 justify-evenly">
          <div style={{ display: "contents" }}>
            <button
              className="border-none"
              onClick={() => handleButtonClick("Anywhere")}
            >
              Anywhere
            </button>
            <button
              className="border-none"
              onClick={() => handleButtonClick("Any week")}
            >
              Any week
            </button>
            <button
              className="border-none"
              onClick={() => handleButtonClick("Add guests")}
            >
              Add guests
            </button>
            <button
              className="border-none p-0"
              onClick={() => handleButtonClick("Search")}
            >
              <img src={search} alt="search button" className="w-8 h-8" />
            </button>
          </div>
        </div>
        <DropdownMenu
          toggleLoginModal={toggleLoginModal}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
        />
      </div>
      {isModalOpen && 
      <LoginModal toggleLoginModal={toggleLoginModal} />}
    </nav>
  );
};

export default Navbar;
