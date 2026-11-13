
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import PrepWiseChat from "./PrepWiseChat.jsx";
import FoodBackground from "./FoodBackground.jsx";

import "../styles/theme.css";

const LINKS = [
  ["/", "Dashboard"],
  ["/pantry", "My Pantry"],
  ["/recipes", "Discover Recipes"],
  ["/planner", "Meal Planner"],
  ["/shopping", "Shopping List"],
  ["/saved", "Saved Recipes"],
];

export default function Layout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("prepwise_theme") === "dark"
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("prepwise_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((previous) =>
      previous === "light" ? "dark" : "light"
    );
  }

  return (
    <div className="shell">

      <aside className="sidebar">
        <div className="brand">
          PrepWise
        </div>

        <nav>
          {LINKS.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}

        <div className="theme-section">
          <span className="theme-label">
            Appearance
          </span>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={theme === "dark"}
          >
            <span>
              {theme === "dark" ? "☀️" : "🌙"}
            </span>

            <span>
              {theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </span>

            <span
              className={`theme-switch ${
                theme === "dark" ? "active" : ""
              }`}
            >
              <span className="theme-switch-knob" />
            </span>
          </button>
        </div>
      </aside>

      <main className="content">
        <FoodBackground />
        <Outlet />
      </main>

      <PrepWiseChat />

    </div>
  );
}
