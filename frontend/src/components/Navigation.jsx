import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/tasks", label: "Tasks" },
  { to: "/habits", label: "Habits" },
  { to: "/insights", label: "Insights" },
];

export default function Navigation() {
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/" className="nav-brand">
        HabitFlow
      </Link>
      <ul className="nav-links">
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
