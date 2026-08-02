import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  TripsIcon,
  ItineraryIcon,
  BudgetIcon,
  PackingIcon,
  ProfileIcon,
  LogoutIcon,
} from "../assets/icons/index.js";
import "../css/Sidebar.css";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", Icon: DashboardIcon },
  { label: "My Trips", path: "/trips", Icon: TripsIcon },
  { label: "Itinerary", path: "/itinerary", Icon: ItineraryIcon },
  { label: "Budget", path: "/budget", Icon: BudgetIcon },
  { label: "Packing List", path: "/packing-list", Icon: PackingIcon },
  { label: "Profile", path: "/profile", Icon: ProfileIcon },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark" aria-hidden="true">
          ✈
        </span>
        <span className="sidebar__brand-name">Ramblr</span>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, path, Icon }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar__link${pathname === path ? " sidebar__link--active" : ""}`}
          >
            <span className="sidebar__icon">
              <Icon />
            </span>
            {label}
          </Link>
        ))}
      </nav>

      <button type="button" className="sidebar__link sidebar__logout">
        <span className="sidebar__icon">
          <LogoutIcon />
        </span>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
