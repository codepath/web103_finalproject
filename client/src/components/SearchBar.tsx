import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameQueryStore from '../store';
import { User } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchBar = () => {
  const ref = useRef<HTMLInputElement>(null);
  const setSearchText = useGameQueryStore((s) => s.setSearchText);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const API_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://playpal.up.railway.app'
      : 'http://localhost:3000';
  const loggedin = () =>
    toast.success('Logged in Successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/login/success`, {
          credentials: 'include',
        });
        if (response.status === 401) {
          console.log('User not logged in');
          return;
        }
        const json = await response.json();
        if (json.user) {
          setUser(json.user);
        }
      } catch (e: any) {
        console.error(e.message);
      }
    };

    getUser();
  }, []);

  const gotoprofile = () => {
    navigate('/profile');
  };

  const login = (e: any) => {
    e.preventDefault();
    window.location.href = `${API_URL}/auth/github`;
    loggedin();
  };

  return (
    <form
      className="w-full"
      onChange={(event) => {
        event.preventDefault();
        if (ref.current) {
          setSearchText(ref.current.value);
          navigate('/');
        }
      }}
    >
      <ToastContainer autoClose={1000} />
      <div className="flex flex-row justify-center w-full gap-4 p-4">
        <input
          ref={ref}
          type="text"
          className="w-full h-[30px] rounded-xl text-slate-200 bg-neutral-700"
          placeholder="  Search for games..."
        />
        <div className="fill-white flex flex-col justify-center rounded-lg align-bottom">
          {user ? (
            <img
              onClick={gotoprofile}
              className="rounded-full cursor-pointer"
              src={user.avatarurl}
              width={35}
              alt="user_avatar"
            />
          ) : (
            <a
              onClick={login}
              className="px-2 py-1 bg-white rounded-lg cursor-default text-black hover:scale-125 text-sm transition ease-in-out"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
