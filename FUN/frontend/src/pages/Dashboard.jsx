import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotes, getCategories } from '../services/api';
import Notes from '../components/Notes';
import DashboardHeader from '../components/DashboardHeader';
import '../styles/Dashboard.css';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, [user?.userID]);

  const loadData = async () => {
    if (!user?.userID) return;
    setLoading(true);
    try {
      const [notesData, categoriesData] = await Promise.all([
        getNotes(user.userID),
        getCategories(user.userID),
      ]);
      setNotes(notesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <DashboardHeader
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        showForm={showForm}
        setShowForm={setShowForm}
        onLogout={handleLogout}
        onRefreshData={loadData}
      />

      <main className="dashboard-content">
        <Notes 
          notes={notes} 
          setNotes={setNotes} 
          categories={categories}
          onUpdate={loadData}
          showForm={showForm}
          setShowForm={setShowForm}
          onRefreshData={loadData}
        />
      </main>
    </div>
  );
};

export default Dashboard;
