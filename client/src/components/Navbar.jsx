import { Link } from "react-router-dom";

export const Navbar = ({ setLogIn }) => {
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
            onClick={() => setLogIn(false)}
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};
