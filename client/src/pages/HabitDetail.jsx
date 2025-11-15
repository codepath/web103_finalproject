// client/src/pages/HabitDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HabitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHabit() {
      try {
        const res = await fetch(`http://localhost:3001/api/habits/${id}`);
        if (!res.ok) {
          console.error("Failed to load habit", res.status);
          return;
        }
        const data = await res.json();
        setHabit(data);
      } catch (err) {
        console.error("Error fetching habit:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHabit();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Delete this habit?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/habits/${id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        alert("Failed to delete habit");
        return;
      }
      navigate("/habits");
    } catch (err) {
      console.error("Error deleting habit:", err);
      alert("Error deleting habit");
    }
  }

  if (loading) return <p>Loading…</p>;
  if (!habit) return <p>Habit not found</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{habit.title}</h1>
      <p>{habit.description || "No description provided"}</p>

      {/* Habit actions row */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => navigate(`/habit/${id}/timer`)}>
          Start Timer
        </button>

        <button /* onClick={...edit later} */>Edit</button>

        <button
          onClick={handleDelete}
          style={{ backgroundColor: "#f88", borderColor: "#f88" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
