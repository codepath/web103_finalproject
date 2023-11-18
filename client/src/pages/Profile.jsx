import React, { useState } from "react";
import ProfileListing from "./ProfileListing";
import { useParams } from "react-router-dom";
// import UserIcon from "../jsons/UserIcon.json";
import { useSelector, useDispatch } from "react-redux";
import { IoIosAddCircle } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { MdAddAPhoto } from "react-icons/md";
import { postNewProfilePhoto } from "../redux/slices/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id, "user IDDDD");
  const [activeTab, setActiveTab] = useState("user"); // 'user' or 'listings'
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    city: false,
    state: false,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPhotoIconHovered, setIsPhotoIconHovered] = useState(false);

  const user = useSelector((state) => state.user?.loggedInUser);
  console.log("User:", user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
    // Clear the error when the user starts typing in the field
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const setProfilePhoto = () => {
    if (user && user.id && imageUrl) {
      // Only proceed if user.id and imageUrl are present
      console.log("Hello, I'm updating the photo");
      dispatch(postNewProfilePhoto({ userId: user?.id, newImageUrl: imageUrl }))
        .then(() => {
          // Additional logic after the photo is updated successfully
        })
        .catch((error) => {
          console.error("Error updating profile photo:", error);
        });
    } else {
      console.error(
        "User ID or Image URL is missing. Cannot set profile photo."
      );
    }
  };

  const showProfilePictureDialog = () => {
    setIsUploadingPhoto(true);
  };

  const handleUpdateProfile = () => {
    // Check for empty fields and set errors
    const errors = {};
    Object.entries(userData).forEach(([key, value]) => {
      if (value.trim() === "") {
        errors[key] = true;
      }
    });
    setFieldErrors(errors);

    // If no errors, proceed with updating the profile
    if (Object.keys(errors).length === 0) {
      const newUpdates = filterEmptyValues(userData);
      handleSubmitUpdates(newUpdates);
      console.log("Profile updated successfully!");
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    }
    console.log("unsuccessful");
  };

  //send updates through redux
  const handleSubmitUpdates = async (data) => {
    try {
      await dispatch(postNewUserProfile(data));
    } catch (error) {
      console.log("Could not submit new user informtion", error);
    }
  };

  const filterEmptyValues = (updatedUserData) => {
    const filteredUpdates = Object.fromEntries(
      Object.entries(updatedUserData).filter(([key, value]) => value !== "")
    );
    return filteredUpdates;
  };

  return user ? (
    <div className="lg:max-w-5xl mx-auto mt-16 mb-8 border-2 border-#FF385C rounded-lg p-10">
      <div className="flex justify-between items-center mb-6 ">
        <button
          className={`w-full py-2 rounded-md focus:outline-none ${
            activeTab === "user"
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("user")}
        >
          User Profile
        </button>

        <button
          className={`w-full py-2 rounded-md focus:outline-none ${
            activeTab === "properties"
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("properties")}
        >
          {/* <ListingCard /> */}
          Properties
        </button>

        <button
          className={`w-full py-2 rounded-md focus:outline-none ${
            activeTab === "listings"
              ? "bg-red-500 text-white"
              : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setActiveTab("listings")}
        >
          {/* <ListingCard /> */}
          Listings
        </button>
      </div>

      {activeTab === "user" && (
        <div className="grid gap-10">
          <p className="text-center"> User Profile </p>
          <div className="flex relative justify-center">
            <div className="translate-x-6 translate-y-5 z-10">
              <IoIosAddCircle
                className="cursor-pointer "
                style={{
                  fontSize: "3.5rem",
                  color: isHovered ? "green" : "black",
                  backgroundColor: "white",
                  borderRadius: "30px",
                  width: "3.5rem",
                }}
                onClick={showProfilePictureDialog}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </div>
            <div className="-translate-x-5">
              {user.image_url ? (
                <div className="w-8 ">{user.image_url}</div>
              ) : (
                <RxAvatar style={{ fontSize: "12rem" }} />
              )}
            </div>
          </div>
          {isUploadingPhoto ? (
            <div
              className="flex relative"
              onMouseLeave={() => setIsPhotoIconHovered(false)}
            >
              <span
                className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600 hover:cursor:pointer"
                onMouseEnter={() => setIsPhotoIconHovered(true)}
                style={{ cursor: "pointer !important" }}
              >
                <MdAddAPhoto style={{ fontSize: "2rem" }} />
              </span>
              {isPhotoIconHovered && (
                <div
                  id="tooltip-default"
                  role="tooltip"
                  className="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-100 tooltip dark:bg-gray-700"
                  style={{
                    top: "-70%",
                    transform: "translateX(-20%)",
                  }}
                >
                  <div>You can host an image </div>
                  <div>on https://imgbb.com/</div>
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              )}
              <input
                type="text"
                id="website-admin"
                className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Image Url"
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <span
                className="inline-flex items-center px-3 text-sm text-gray-900 border rounded-s-0 border-gray-300 rounded-e-md bg-green-600 dark:text-gray-400 dark:border-gray-600 hover:cursor:pointer"
                onClick={setProfilePhoto}
              >
                <IoIosAddCircle
                  style={{
                    fontSize: "2rem",
                    color: "white",
                    cursor: "pointer",
                  }}
                />
              </span>
            </div>
          ) : (
            <></>
          )}

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="first-name"
              >
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                name="first-name"
                onChange={handleInputChange}
                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                placeholder={user?.first_name}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="last-name"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                name="last-name"
                className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                placeholder={user?.last_name}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="address"
              >
                Address 1
              </label>
              {user.address1 ? (
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={user.address1}
                />
              ) : (
                <input
                  required
                  type="text"
                  id="address"
                  name="address"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your Address"
                />
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                Address 2 (Optional)
              </label>
              {user.address2 ? (
                <input
                  type="address"
                  id="address"
                  name="address"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={user?.address2}
                />
              ) : (
                <input
                  type="address"
                  id="address"
                  name="address"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your Address"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                City
              </label>
              {user.city ? (
                <input
                  type="city"
                  id="city"
                  name="city"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={user?.city}
                />
              ) : (
                <input
                  required
                  type="city"
                  id="city"
                  name="city"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your City"
                />
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="state"
              >
                State
              </label>
              {user.state ? (
                <input
                  required
                  type="state"
                  id="state"
                  name="state"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={user?.state}
                />
              ) : (
                <input
                  required
                  type="state"
                  id="state"
                  name="state"
                  className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your State"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="email"
              >
                Email
              </label>
              <input
                disabled
                type="email"
                id="email"
                name="email"
                className="w-full font-medium mt-1 p-2 border-2 border-#FF385C rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-gray-200"
                placeholder={user?.email}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-600"
                htmlFor="zipcode"
              >
                Zip Code
              </label>
              <input
                type="zipcode"
                id="zipcode"
                name="zipcode"
                className="w-full font-medium mt-1 p-2 border-2 border-#FF385C rounded-md focus:outline-none focus:ring focus:border-blue-300 "
                placeholder={user?.zipcode}
              />
            </div>
          </div>
          <button
            onClick={handleUpdateProfile}
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Update Profile
          </button>
        </div>
      )}

      {activeTab === "listings" && (
        <div>
          <ProfileListing />
        </div>
      )}

      {activeTab === "properties" && <div>properties</div>}
    </div>
  ) : (
    <div>loading...</div>
  );
};
export default Profile;
