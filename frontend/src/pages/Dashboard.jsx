
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import PageHeader from "../components/PageHeader.jsx";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [pantry, setPantry] = useState([]);
  const [meals, setMeals] = useState([]);
  const [saved, setSaved] = useState([]);
  const [shopping, setShopping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Live date and time
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Today's local date for the API
  const today = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // Format the live clock
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  // Load real database information
  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    Promise.all([
      api.get("/pantry-items"),
      api.get(`/meal-plan?start=${today}`),
      api.get("/saved-recipes"),
      api.get("/shopping-list")
    ])
      .then(([p, m, s, g]) => {
        if (!active) return;

        setPantry(p);
        setMeals(
          m.filter(item => item.planned_date === today)
        );
        setSaved(s);
        setShopping(g);
      })
      .catch(e => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [today]);

  // Ingredients expiring within 3 days
  const expiring = pantry.filter(
    item =>
      item.days_until_expiry !== null &&
      item.days_until_expiry >= 0 &&
      item.days_until_expiry <= 3
  );

  // Shopping list items still needed
  const remaining = shopping.filter(
    item => !item.is_checked
  );

  // Dashboard statistics
  const stats = [
    {
      label: "Pantry Ingredients",
      value: pantry.length,
      to: "/pantry"
    },
    {
      label: "Today's Meals",
      value: meals.length,
      to: "/planner"
    },
    {
      label: "Saved Recipes",
      value: saved.length,
      to: "/saved"
    },
    {
      label: "Items to Buy",
      value: remaining.length,
      to: "/shopping"
    }
  ];

  if (loading) {
    return <p>Loading your dashboard...</p>;
  }

  if (error) {
    return (
      <p className="error">
        Couldn't load dashboard: {error}
      </p>
    );
  }

  return (
    <div className="dashboard">

      {/* Dashboard header with live date and time */}
      <PageHeader
        title="Dashboard"
        subtitle={`${formattedDate} • ${formattedTime}`}
      />

      {/* Welcome section */}
      <section className="dashboard-welcome">
        <div>
          <span>YOUR SMART KITCHEN</span>

          <h2>Welcome to PrepWise!</h2>

          <p>
            Plan smarter, waste less, and make every
            ingredient count.
          </p>

          <Link to="/recipes" className="btn primary">
            Discover Recipes
          </Link>
        </div>
      </section>

      {/* Statistics cards */}
      <div className="dashboard-stats">
        {stats.map(stat => (
          <Link
            key={stat.label}
            to={stat.to}
            className="dashboard-stat"
          >
            <span>{stat.label}</span>

            <strong>{stat.value}</strong>

            <small>View details →</small>
          </Link>
        ))}
      </div>

      {/* Meal plan and expiring ingredients */}
      <div className="dashboard-panels">

        {/* Today's meal plan */}
        <section className="dashboard-panel">
          <h2>Today's Meal Plan</h2>

          {meals.length === 0 ? (
            <p>No meals planned for today.</p>
          ) : (
            meals.map(meal => (
              <div
                className="dashboard-item"
                key={meal.id}
              >
                <strong>{meal.title}</strong>
                <span>{meal.meal_type}</span>
              </div>
            ))
          )}

          <Link
            to="/planner"
            className="dashboard-link"
          >
            View Meal Planner →
          </Link>
        </section>

        {/* Expiring ingredients */}
        <section className="dashboard-panel">
          <h2>Expiring Soon</h2>

          {expiring.length === 0 ? (
            <p>
              No ingredients expiring within 3 days.
            </p>
          ) : (
            expiring.map(item => (
              <div
                className="dashboard-item"
                key={item.id}
              >
                <strong>{item.name}</strong>

                <span>
                  {item.days_until_expiry === 0
                    ? "Expires today"
                    : `${item.days_until_expiry} day${
                        item.days_until_expiry === 1
                          ? ""
                          : "s"
                      } left`}
                </span>
              </div>
            ))
          )}

          <Link
            to="/pantry"
            className="dashboard-link"
          >
            Manage Pantry →
          </Link>
        </section>
      </div>

      {/* Quick actions */}
      <section className="dashboard-panel">
        <h2>Quick Actions</h2>

        <div className="dashboard-actions">
          <Link
            to="/pantry/new"
            className="btn primary"
          >
            + Add Ingredient
          </Link>

          <Link to="/recipes" className="btn">
            Find a Recipe
          </Link>

          <Link to="/planner" className="btn">
            Plan a Meal
          </Link>

          <Link to="/shopping" className="btn">
            Shopping List
          </Link>
        </div>
      </section>
    </div>
  );
}
