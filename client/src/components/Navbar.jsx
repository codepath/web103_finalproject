import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export const Navbar = () => {
  const { user, isLoading, logout } = useUser();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className={user && user.role && "border-e-2"}>
          <Link to="/home" className="btn btn-ghost normal-case text-xl ">
            StudyMeet
          </Link>
        </div>
        {isLoading && (
          // TODO: replace this with a loading spinner
          <span className="normal-case text-xl">Loading...</span>
        )}
        {user && user.role && (
          <>
            <div className="border-e-2">
              {user.role === "tutor" && (
                <Link
                  to="/availability"
                  className="btn btn-ghost normal-case text-xl "
                >
                  Set Availability
                </Link>
              )}
              {user.role === "student" && (
                <Link to="/find" className="btn btn-ghost normal-case text-xl ">
                  Find Sessions
                </Link>
              )}
            </div>
            <div>
              <Link to="/view" className="btn btn-ghost normal-case text-xl ">
                View Sessions
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="navbar-end">
        <div className="border-e-2">
          <Link to="/profile" className="btn btn-ghost normal-case text-xl ">
            Profile
          </Link>
        </div>
        <div>
          <Link
            to="/"
            className="btn btn-ghost normal-case text-xl "
            onClick={logout}
          >
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};
