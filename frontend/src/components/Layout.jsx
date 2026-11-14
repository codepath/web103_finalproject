
import { useEffect, useState } from "react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import PrepWiseChat from "./PrepWiseChat.jsx";

import FoodBackground from "./FoodBackground.jsx";

import "../styles/theme.css";

import "../styles/auth.css";

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

const LINKS = [
  ["/", "Dashboard"],

  ["/pantry", "My Pantry"],

  ["/recipes", "Discover Recipes"],

  ["/planner", "Meal Planner"],

  ["/shopping", "Shopping List"],

  ["/saved", "Saved Recipes"],

  ["/kitchen", "Kitchen Studio"],
];

// ==========================================
// MAIN APPLICATION LAYOUT
// ==========================================

export default function Layout({
  user,
  onLogout,
}) {

  const [theme, setTheme] = useState(() => {

    return localStorage.getItem(
      "prepwise_theme"
    ) === "dark"

      ? "dark"

      : "light";
  });

  // Save the selected appearance.

  useEffect(() => {

    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      "prepwise_theme",
      theme
    );

  }, [theme]);

  // Toggle between light and dark mode.

  function toggleTheme() {

    setTheme((previous) =>

      previous === "dark"

        ? "light"

        : "dark"
    );
  }

  return (
    <div className="shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          PrepWise
        </div>

        {/* ACCOUNT INFORMATION */}

        <div className="account-summary">

          <strong>
            {user.name}
          </strong>

          <small>
            {user.email}
          </small>

          <button
            type="button"
            className="account-logout"
            onClick={onLogout}
          >
            Sign out
          </button>

        </div>

        {/* NAVIGATION */}

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

        {/* THEME SWITCH */}

        <div className="theme-section">

          <span className="theme-label">
            Appearance
          </span>

          <button
            type="button"

            className="theme-toggle"

            aria-label="Toggle dark mode"

            aria-pressed={theme === "dark"}

            onClick={toggleTheme}
          >

            <span>
              {theme === "dark"
                ? "☀️"
                : "🌙"}
            </span>

            <span>
              {theme === "dark"
                ? "Light Mode"
                : "Dark Mode"}
            </span>

            <span
              className={`theme-switch ${
                theme === "dark"
                  ? "active"
                  : ""
              }`}
            >

              <span className="theme-switch-knob" />

            </span>

          </button>

        </div>

      </aside>

      {/* MAIN PAGE CONTENT */}

      <main className="content">

        <FoodBackground />

        <Outlet />

      </main>

      {/* PERSONALIZED AI CHEF */}

      <PrepWiseChat
        key={user.id}
        userId={user.id}
      />

    </div>
  );
}
