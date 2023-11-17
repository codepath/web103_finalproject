import React from 'react';
import { useEffect, useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [countdown, setCountdown] = useState(4);
  const loggedOut = () =>
    toast.success('Logged Outt Successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });
  const API_URL =
    process.env.NODE_ENV === 'production'
      ? 'playpal.up.railway.app'
      : 'http://localhost:3000';
  const Navigate = useNavigate();
  const getUser = async () => {
    const response = await fetch(`${API_URL}/auth/login/success`, {
      credentials: 'include',
    });
    const res = await response.json();
    if (res.user) {
      setUser(res.user);
    }
  };

  getUser();

  useEffect(() => {
    if (!user) {
      const interval = setInterval(() => {
        setCountdown((currentCountdown) => {
          if (currentCountdown <= 1) {
            clearInterval(interval);
            Navigate('/');
          }
          return currentCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user, Navigate]);

  const logout = async () => {
    loggedOut();
    const url = `${API_URL}/auth/logout`;
    const response = await fetch(url, { credentials: 'include' });
    window.location.href = '/';
  };
  if (!user) {
    return (
      <div className="flex flex-col justify-center h-[500px] items-center text-white  ">
        <ToastContainer className="absolute" autoClose={2000} />
        <h1 className="text-6xl font-bold p-4 text-red-500">
          You are not logged in ! Redirecting to home in {countdown}
        </h1>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center text-white ">
      <img className="rounded-full" width={250} src={user?.avatarurl} />
      <div>
        <h1 className="text-4xl font-bold mt-4 mb-4">{user?.username}</h1>
      </div>
      <ToastContainer className="absolute" autoClose={2000} />
      <button
        onClick={() => logout()}
        className="px-3 py-2 bg-white rounded-lg text-black hover:scale-125 transition ease-in-out "
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;
