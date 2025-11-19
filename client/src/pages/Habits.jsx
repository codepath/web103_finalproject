import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Habits() {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch("http://localhost:3001/api/habits");
        const data = await res.json();
        setHabits(data);
      } catch (err) {
        console.error("Failed to load habits", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Please enter a title.");
  
    try {
      const res = await fetch("http://localhost:3001/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });
  
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to create habit");   
        return;
      }
  
      const newHabit = await res.json();
      setHabits((prev) => [newHabit, ...prev]);
      setForm({ title: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error creating habit", err);
      alert("Something went wrong creating the habit.");
    }
  };
  

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading habits...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Habits</h1>
      <p>Track and manage your daily habits here!</p>

      <button onClick={() => setShowForm(true)} style={{ marginBottom: "10px" }}>
        +
      </button>

      {showForm && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Create Habit</h2>

          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Habit title"
              />
            </label>
            <br />
            <label>
              Description:
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
              />
            </label>
            <br />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {habits.length === 0 && <li>No habits yet.</li>}

        {habits.map((h) => (
          <li
            key={h.id}
            onClick={() => navigate(`/habit/${h.id}`, { state: { habit: h } })}
            style={{
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <strong>{h.title}</strong> – {h.description || "No description"}
            <br />
            <small>
              Created:{" "}
              {h.created_at
                ? new Date(h.created_at).toLocaleString()
                : "Unknown"}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
