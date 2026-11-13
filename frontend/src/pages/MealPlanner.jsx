
import { useEffect, useState } from "react";
import { api } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import "../styles/planner.css";

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonday() {
  const date = new Date();

  date.setHours(12, 0, 0, 0);
  date.setDate(
    date.getDate() - ((date.getDay() + 6) % 7)
  );

  return date;
}

export default function MealPlanner() {
  const [week, setWeek] = useState(getMonday);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  const start = dateKey(week);

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(week);
    day.setDate(day.getDate() + i);
    return day;
  });

  useEffect(() => {
    let ignore = false;

    setLoading(true);
    setError("");

    api.get(`/meal-plan?start=${start}`)
      .then((data) => {
        if (!ignore) setEntries(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [start, reload]);

  function changeWeek(direction) {
    setWeek((previous) => {
      const date = new Date(previous);
      date.setDate(date.getDate() + direction * 7);
      return date;
    });
  }

  async function removeMeal(id) {
    if (!window.confirm("Remove this planned meal?")) {
      return;
    }

    try {
      await api.del(`/meal-plan/${id}`);

      setEntries((previous) =>
        previous.filter((entry) => entry.id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <PageHeader
        title="Weekly Meal Planner"
        subtitle="Plan your meals and cook smarter."
      />

      <div className="planner-toolbar">
        <button
          className="btn"
          onClick={() => changeWeek(-1)}
        >
          ← Previous
        </button>

        <strong>
          {days[0].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          {" – "}
          {days[6].toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </strong>

        <button
          className="btn"
          onClick={() => changeWeek(1)}
        >
          Next →
        </button>

        <button
          className="btn"
          onClick={() => setWeek(getMonday())}
        >
          This Week
        </button>

        <button
          className="btn"
          onClick={() => setReload((n) => n + 1)}
        >
          Refresh
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading your meal plan...</p>
      ) : (
        <div className="planner-grid">
          {days.map((day) => {
            const date = dateKey(day);

            const meals = entries.filter(
              (entry) => entry.planned_date === date
            );

            return (
              <section
                className={`planner-day ${
                  date === dateKey(new Date())
                    ? "planner-today"
                    : ""
                }`}
                key={date}
              >
                <header className="planner-day-header">
                  <h3>
                    {day.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </h3>

                  <span>
                    {day.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </header>

                {meals.length === 0 && (
                  <p className="muted planner-empty">
                    No meals planned
                  </p>
                )}

                {meals.map((meal) => (
                  <article
                    className="planner-meal"
                    key={meal.id}
                  >
                    {meal.image_url && (
                      <img
                        src={meal.image_url}
                        alt={meal.title}
                        loading="lazy"
                      />
                    )}

                    <div className="planner-meal-body">
                      <span className="planner-meal-type">
                        {meal.meal_type}
                      </span>

                      <h4>{meal.title}</h4>

                      <button
                        className="planner-remove"
                        onClick={() => removeMeal(meal.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
