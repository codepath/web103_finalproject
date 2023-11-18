import React from "react";
import { RxAvatar, RxDropdownMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authLogOut } from "../redux/slices/userSlice";
import Policies from "../pages/Policies";

const DropdownMenu = ({ toggleDropdown, toggleLoginModal, isDropdownOpen }) => {
  const user = useSelector((state) => state.user?.loggedInUser);
  const dispatch = useDispatch();

  const handleLogoutUser = async () => {
    await dispatch(authLogOut());
  };

  console.log(user);
  return (
    <div className="flex">
      <div className="relative items-center">
        <button
          onClick={toggleDropdown}
          className="flex border-solid border-2 px-4 rounded-3xl w-28 h-14 items-center"
          type="button"
        >
          <div className="mr-2 w-full h-full">
            <RxDropdownMenu className="w-full h-full" />
          </div>
          <div className="rounded-full ring-2 ring-white w-full h-5/6">
            <RxAvatar
              className="w-full h-full"
              style={{ fontWeight: "bold", WebkitFontSmoothing: "antialiased" }}
            />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark-bg-gray-700 dark-divide-gray-600 w-56">
            <div className="px-4 py-3 text-sm text-gray-900 dark-text-white hover:bg-login-color">
              {user && user.id ? (
                <>
                  <div>
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="font-medium truncate">{user.email}</div>
                </>
              ) : (
                <div>Guest</div>
              )}
            </div>
            <div className="flex w-full">
              <ul className="table list-none py-2 text-sm text-gray-700 dark-text-gray-200 w-full">
                <li className="table-row hover:bg-button-color hover:text-white">
                  <Link to={`/profile/${user?.id}`}>
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
                <li className="table-row hover:bg-button-color hover:text-white">
                  <Link to="/policy">
                  <button
                    className="block px-4 py-2 hover-bg-gray-100 dark-hover-bg-gray-600 dark-hover-text-white"
                    onClick={toggleLoginModal}
                  >
                    Policies
                  </button>
                  </Link>
                </li>
              </ul>
            </div>
            {user && user.id ? (
              <div className="py-2 hover:bg-button-color hover:text-white">
                <button
                  onClick={() => {
                    handleLogoutUser();
                    toggleDropdown();
                  }}
                >
                  <div className="ml-4">Logout</div>
                </button>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
