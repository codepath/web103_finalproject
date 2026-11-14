
import { useState } from "react";
import { api } from "../api.js";

export default function AddToMealPlan({ recipe }) {
  const today = new Date().toLocaleDateString("en-CA");

  const [date, setDate] = useState(today);
  const [mealType, setMealType] = useState("dinner");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function addToMealPlan(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/meal-plan", {
        recipe_id: recipe.id,
        planned_date: date,
        meal_type: mealType,
      });

      setMessage("Recipe added to your meal planner!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="card pad"
      style={{ marginTop: "20px" }}
    >
      <h3>Add to Meal Plan</h3>

      <form onSubmit={addToMealPlan}>
        <label>Choose a date</label>

        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setMessage("");
          }}
          required
          style={{
            width: "100%",
            marginTop: "6px",
            marginBottom: "12px",
          }}
        />

        <label>Meal type</label>

        <select
          value={mealType}
          onChange={(e) => {
            setMealType(e.target.value);
            setMessage("");
          }}
          style={{
            width: "100%",
            marginTop: "6px",
            marginBottom: "12px",
          }}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>

        <button
          type="submit"
          className="btn"
          disabled={loading || !!message}
          style={{ width: "100%" }}
        >
          {loading
            ? "Adding..."
            : message
            ? "✓ Added to Meal Plan"
            : "+ Add to Meal Plan"}
        </button>

        {message && (
          <p style={{ color: "green" }}>{message}</p>
        )}

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}
      </form>
    </section>
  );
}
