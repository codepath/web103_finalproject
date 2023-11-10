import React from "react";
import ProfilePic from "../assets/blank-profile-image.png";
const StudentInfo = () => {
  const handleProfileEdit = () => {};
  return (
    <div className="m-14 flex-grow border-2 rounded-lg p-2 flex text-2xl">
      <div className="">
        <p className="text-center m-5">Student ID</p>{" "}
        <img src={ProfilePic} alt="Profile Img" className="m-2" />
        <p className="text-center m-5">Bio</p>
      </div>
      <div className="w-full ml-10 p-3 mt-16">
        <div className="border-b-4">
          <form onSubmit={handleProfileEdit}>
            <div className="grid grid-cols-6 gap-4 gap-y-10 p-4 pb-16 ">
              <label htmlFor="" className="col-span-1">
                First Name
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />

              <label htmlFor="" className="col-span-1">
                Last Name
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />
              <label htmlFor="" className="col-span-1">
                Username
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />
              <label htmlFor="" className="col-span-1">
                Email
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />

              <label htmlFor="" className="col-span-1">
                School
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />

              <label htmlFor="" className="col-span-1">
                Year
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />

              <label htmlFor="" className="col-span-1">
                Major
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
              />
            </div>
            <div className="flex gap-4 justify-end mb-7 p-4">
              <button className="p-2 rounded-md border-2">
                Change Password
              </button>
              <button className="p-2 rounded-md border-2">Edit Profile</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
