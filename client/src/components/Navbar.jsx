import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../provider/UserProvider";
import { useContext } from "react";

export const Navbar = ({ setLogIn }) => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="border-e-2">
          <Link to="/" className="btn btn-ghost normal-case text-xl ">
            StudyMeet
          </Link>
        </div>
        <div className="border-e-2">
          <Link
            to="/studentInfo"
            className="btn btn-ghost normal-case text-xl "
          >
            Find Session
          </Link>
        </div>
        <div className="">
          <Link to="/tutorInfo" className="btn btn-ghost normal-case text-xl ">
            View Session
          </Link>
        </div>
      </div>
      <div className="navbar-end">
        <div className="border-e-2">
          <Link
            to="/studentInfo"
            className="btn btn-ghost normal-case text-xl "
          >
            Profile
          </Link>
        </div>
        <div className="border-e-2">
          <Link
            to="/"
            className="btn btn-ghost normal-case text-xl "
            onClick={async (e) => {
              await logout();
              /*This works instead of useNavigate. (since it reloads the page)*/
              window.location.href = "/";
            }}
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};
