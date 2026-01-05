import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { MdDashboard, MdAnalytics, MdMenu } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

function Sidebar({ isSidebarOpen, isCollapsed, toggleDesktopSidebar }) {
  return (
    <aside
      className={`sidebar ${isSidebarOpen ? "open" : ""} ${
        isCollapsed ? "collapsed" : ""
      }`}
      aria-label="Sidebar Navigation"
    >
      <div className="sidebar-toggle-container">
        <button
          className="sidebar-pin-btn"
          onClick={toggleDesktopSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-navigation"
        >
          <MdMenu aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar-nav" id="sidebar-navigation">
        <p className="nav-title">Navigation</p>

        <ul>
          <li>
            <NavLink to="/dashboard" title={isCollapsed ? "Dashboard" : ""}>
              <MdDashboard aria-hidden="true" />{" "}
              <span className="nav-link-text">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/analytics" title={isCollapsed ? "Analytics" : ""}>
              <MdAnalytics aria-hidden="true" />{" "}
              <span className="nav-link-text">Analytics</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/leaderboard" title={isCollapsed ? "Leaderboard" : ""}>
              <FaUsers aria-hidden="true" />{" "}
              <span className="nav-link-text">Leaderboard</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
