import { useEffect, useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const loggedOut = () =>
    toast.success('Logged Outt Successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });

  const API_URL =
    process.env.NODE_ENV === 'production'
      ? 'https://playpal.up.railway.app/'
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
  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    loggedOut();
    const url = `${API_URL}/auth/logout`;
    const response = await fetch(url, { credentials: 'include' });
    window.location.href = '/';
  };

  if (!user) {
    Navigate('/');
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
