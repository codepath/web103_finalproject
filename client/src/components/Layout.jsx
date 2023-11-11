import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = ({ setLogIn }) => {
  return (
    <div className="flex flex-col font-caveat h-screen">
      <Navbar setLogIn={setLogIn} />
      <Outlet />
    </div>
  );
};
