import "../styles/DashboardHeader.css";
import { Plus, X, Settings } from "lucide-react";
import MainButton from "./MainButton";
import { useState } from "react";
import RegularButton from "./RegularButton";

const DashboardHeader = ({
  showSettings,
  setShowSettings,
  showForm,
  setShowForm,
  onLogout
}) => {
  

  return (
    <header className="dashboard-header">
      <h1>Note Board</h1>
      <div className="header-actions">
        <RegularButton onClick={() => setShowSettings(!showSettings)}><Settings size={22}/></RegularButton>
        {showSettings && (
          <div className="settings-menu">
            <button onClick={onLogout}>Logout</button>
          </div>
        )}
        <MainButton onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <X size={16} />
          ) : (
            <>
              <Plus color='white' size={20} /> Note
            </>
          )}
        </MainButton>
      </div>
    </header>
  );
};

export default DashboardHeader;
