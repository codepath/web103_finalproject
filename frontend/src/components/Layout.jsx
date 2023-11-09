import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ setLogIn }) => {
  return (
    <div className="flex flex-col font-caveat h-screen">
      <Navbar setLogIn={setLogIn} />
      <Outlet />
    </div>
  );
};

export default Layout;
