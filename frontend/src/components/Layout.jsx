import { Outlet } from "react-router-dom";
import Navigation from "./Navigation.jsx";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Navigation />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
