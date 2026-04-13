import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { clearSession, getUser } from "../lib/auth";
import "./Layout.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊", end: true },
  { to: "/dashboard/universities", label: "Universities", icon: "🏛️" },
  { to: "/dashboard/programs", label: "Programs", icon: "📋" },
  { to: "/dashboard/applications", label: "Applications", icon: "📄" },
  { to: "/dashboard/recommendations", label: "Recommendations", icon: "💡" },
];

const pageLabels = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of your study abroad journey" },
  "/dashboard/universities": { title: "Universities", subtitle: "Explore universities worldwide" },
  "/dashboard/programs": { title: "Programs", subtitle: "Browse study programs" },
  "/dashboard/applications": { title: "Applications", subtitle: "Manage your applications" },
  "/dashboard/recommendations": { title: "Recommendations", subtitle: "AI-powered suggestions for you" },
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const [theme, setTheme] = useState(currentTheme);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("sv_theme", next);
    setTheme(next);
  };

  const onLogout = () => {
    clearSession();
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const currentPage = pageLabels[location.pathname] || { title: "Dashboard", subtitle: "" };

  return (
    <div className="dashboard-layout">
      {/* ═══ SIDEBAR OVERLAY (mobile) ═══ */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "sidebar-overlay-visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">✦</span>
            StudyVerse
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-label">Main Menu</span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName || "User"}</div>
              <div className="sidebar-user-role">{user?.role || "student"}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={onLogout}>
            ↪ Sign Out
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <div className="topbar-title">
              <h2>{currentPage.title}</h2>
              <p>{currentPage.subtitle}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="page-transition"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
