import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import CompanyPage from './pages/CompanyPage';
import FeedPage from './pages/FeedPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SubmitEntryPage from './pages/SubmitEntryPage';

const API_URL = 'http://localhost:3001';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/login/success`, {
          credentials: 'include',
        });
        const json = await response.json();
        if (json.success) setUser(json.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        {user && (
          <>
            <h2 style={{ padding: '1rem 0' }}>LayoffLens</h2>
            <nav
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem 0',
                borderBottom: '1px solid #ddd',
                alignItems: 'center',
              }}
            >
              <Link to="/">Feed</Link>
              <Link to="/submit">Submit Entry</Link>
              <span
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <img
                  src={user.avatar_url}
                  style={{ height: '32px', borderRadius: '50%' }}
                />
                <span>{user.username}</span>
                <button onClick={logout}>Logout</button>
              </span>
            </nav>
          </>
        )}

        <Routes>
          <Route path="/login" element={<Login apiUrl={API_URL} />} />
          <Route
            path="/"
            element={
              loading ? null : user ? <FeedPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/submit"
            element={
              loading ? null : user ? (
                <SubmitEntryPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/company/:companyName"
            element={
              loading ? null : user ? <CompanyPage /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
