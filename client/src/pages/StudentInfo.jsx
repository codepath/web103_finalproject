import ProfilePic from "../assets/blank-profile-image.png";
import { useContext } from "react";
import { UserContext } from "../provider/UserProvider";

export const StudentInfo = () => {
  const { user, loading } = useContext(UserContext);

  const handleProfileEdit = (e) => {
    e.preventDefault();
    console.log(user);
    console.log(e.target[0].value);
    console.log(e.target[1].value);
    console.log(e.target[2].value);
    console.log(e.target[3].value);
    console.log(e.target[4].value);
    console.log(e.target[5].value);
    console.log(e.target[6].value);
    console.log(e.target[7].value);
  };
  return (
    <div className="m-14 flex-grow border-2 rounded-lg p-2 flex text-2xl">
      <div className="">
        <p className="text-center m-5">Student ID: {user.github_id}</p>{" "}
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
                placeholder={user.username}
              />
              <label htmlFor="" className="col-span-1">
                Email
              </label>
              <input
                type="text"
                className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
                placeholder={user.email}
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
              <button type="button" className="p-2 rounded-md border-2">
                Change Password
              </button>
              <button type="submit" className="p-2 rounded-md border-2">
                Edit Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
