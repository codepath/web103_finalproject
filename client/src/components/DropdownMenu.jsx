import React from "react";
import { RxAvatar, RxDropdownMenu } from "react-icons/rx";
import {  Link  } from 'react-router-dom'

const DropdownMenu = ({ toggleDropdown, toggleLoginModal, isDropdownOpen }) => {
  return (
    <div className="flex">
      <div className="relative items-center">
        <button
          onClick={toggleDropdown}
          className="flex border-solid border-2 px-4 rounded-3xl w-28 h-14 items-center"
          type="button"
        >
          <RxDropdownMenu style={{ fontSize: "88px" }} />
          <div className=" rounded-full ring-2 ring-white">
            <RxAvatar
              className="w-full h-full "
              style={{ fontWeight: "bold", fontSize: "82px" }}
            />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark-bg-gray-700 dark-divide-gray-600 w-44">
            <div className="px-4 py-3 text-sm text-gray-900 dark-text-white hover:bg-login-color">
              <div>Bonnie Green</div>
              <div className="font-medium truncate">name@flowbite.com</div>
            </div>
            <div className="flex w-full">
              <ul className="table list-none py-2 text-sm text-gray-700 dark-text-gray-200 w-full">
                <li className="table-row hover:bg-button-color hover:text-white">
                  
                  <Link to="/profile">
                  <button
                    className="block px-4 py-2 hover-bg-gray-100 dark-hover-bg-gray-600 dark-hover-text-white"
                    onClick={toggleDropdown}
                  >
                    View Profile
                  </button>
                  </Link>
                </li>
                <li className="table-row hover:bg-button-color hover:text-white">
                  <button
                    className="block px-4 py-2 hover-bg-gray-100 dark-hover-bg-gray-600 dark-hover-text-white"
                    onClick={toggleLoginModal}
                  >
                    Add Listing
                  </button>
                </li>
                <li className="table-row hover:bg-button-color hover:text-white">
                  <button
                    className="block px-4 py-2 hover-bg-gray-100 dark-hover-bg-gray-600 dark-hover-text-white"
                    onClick={toggleLoginModal}
                  >
                    Perks
                  </button>
                </li>
              </ul>
            </div>
            <div className="py-2 hover:bg-button-color hover:text-white">
              <button
                onClick={() => {
                  toggleLoginModal();
                  toggleDropdown();
                }}
              >
                <div className="ml-4">Login</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
