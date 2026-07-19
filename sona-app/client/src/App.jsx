import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <nav className="nav">
        <Link to="/" className="brand">Sona</Link>
        <div className="nav-right">
          <Link to="/profile">Profile</Link>
          <span className="cart">🛒</span>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default App;
