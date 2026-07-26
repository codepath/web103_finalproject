import { Link, Outlet } from "react-router-dom";
import logo from "./assets/sona-logo-tagline.svg";

function App() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <img
              src={logo}
              alt="Sona — Artist + Fan Hub"
              className="brand-logo"
            />
          </Link>
          <div className="nav-right">
            <Link to="/profile">Profile</Link>
            <Link to="/merch">Merch</Link>
            <span className="cart">🛒</span>
          </div>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default App;
