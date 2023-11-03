import React from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="p-5 bg-black">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
