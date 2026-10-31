import { NavLink, Outlet } from "react-router-dom";

const LINKS = [
  ["/", "Dashboard"],
  ["/pantry", "My Pantry"],
  ["/recipes", "Discover Recipes"],
  ["/planner", "Meal Planner"],
  ["/shopping", "Shopping List"],
  ["/saved", "Saved Recipes"],
];

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">PrepWise</div>
        <nav>
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
