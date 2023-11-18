import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import stayvueLogo from "../assets/StayVue.png";
import search from "../assets/search.png";
import LoginModal from "./LoginModal";
import DropdownMenu from "./DropdownMenu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Navbar = ({ isModalOpen, setIsModalOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const user = useSelector((state) => state.user?.loggedInUser);

  useEffect(() => {
    if (user) {
      setIsModalOpen(false);
    }
  }, [user]);

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

  const handleDateChange = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="border-none w-8/12"
              onClick={() => handleButtonClick("Anywhere")}
            >
              Anywhere
            </button>
            {/* Date picker for start date */}
            <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, "start")}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check in"
              className="w-9/12"
            />
            {/* Date picker for end date */}
            <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(date, "end")}
              className="w-9/12"
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check-out"
            />
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="border-none w-9/12"
              onClick={() => handleButtonClick("Add guests")}
            >
              Add guests
            </button>
            <button
              className="border-none p-0"
              onClick={() => handleButtonClick("Search")}
            >
              <img src={search} alt="search button" className="w-11 h-10" />
            </button>
          </div>
        </div>
        <DropdownMenu
          toggleLoginModal={toggleLoginModal}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
        />
      </div>
      {isModalOpen && <LoginModal toggleLoginModal={toggleLoginModal} />}
    </nav>
  );
};

export default Navbar;
