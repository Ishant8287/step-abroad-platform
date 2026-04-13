import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../lib/auth";

const navItems = [
  ["/", "Dashboard"],
  ["/universities", "Universities"],
  ["/programs", "Programs"],
  ["/applications", "Applications"],
  ["/recommendations", "Recommendations"],
];

export default function Layout() {
  const navigate = useNavigate();
  const user = getUser();

  const onLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <h1>Study Abroad Platform</h1>
          <p>{user?.fullName} ({user?.role})</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>

      <nav className="tabs">
        {navItems.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"}>
            {label}
          </NavLink>
        ))}
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
