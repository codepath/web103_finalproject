import React, { useState } from "react";
import "./AddSession.css";
import { useParams } from "react-router-dom";

const AddSession = ({ api_url, groups, user }) => {
  const { id: groupId } = useParams();
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const times = Array.from({ length: 12 }, (_, i) => `${8 + i}:00:00`);

  const [selectedCells, setSelectedCells] = useState([]);

  const toggleCellSelection = (day, time) => {
    const cellId = `${day}-${time}`;
    setSelectedCells((prev) =>
      prev.includes(cellId)
        ? prev.filter((id) => id !== cellId)
        : [...prev, cellId]
    );
  };

  const handleSubmit = async () => {
    try {
      console.log(selectedCells);
      const sessions = selectedCells.map((cell) => {
        const [day, time] = cell.split("-");

        console.log(day);
        console.log(time);

        return {
          group_id: groupId, // Align with backend field
          proposed_by: user.id, // Align with backend field
          proposed_day: day, // Align with backend field
          proposed_time: time, // Align with backend field
        };
      });

      console.log(sessions);

      const response = await fetch(`${api_url}/api/sessions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessions),
      });

      if (response.ok) {
        alert("Sessions added successfully!");
        setSelectedCells([]);
      } else {
        console.error("Failed to add sessions");
      }
    } catch (error) {
      console.error("Error adding sessions:", error);
    }
  };

  return (
    <div className="add-session">
      <h2>Add Sessions</h2>
      <div className="schedule-grid">
        <div className="header-row">
          <div className="time-slot"></div>
          {days.map((day, index) => (
            <div key={index} className="day-header">
              {day}
            </div>
          ))}
        </div>
        {times.map((time, rowIndex) => (
          <div key={rowIndex} className="time-row">
            <div className="time-slot">{time}</div>
            {days.map((day, colIndex) => {
              const cellId = `${day}-${time}`;
              const isSelected = selectedCells.includes(cellId);
              return (
                <div
                  key={colIndex}
                  className={`cell ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleCellSelection(day, time)}
                >
                  {isSelected ? "✓" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit Sessions
      </button>
    </div>
  );
};

export default AddSession;
