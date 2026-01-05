import React from "react";
import { FaBars } from "react-icons/fa";
import "./Header.css";
import ProfileDropdown from "./ProfileDropdown";

function Header({ toggleMobileSidebar, isCollapsed }) {
  return (
    <header className={isCollapsed ? "collapsed" : ""} role="banner">
      <div className="header-left">
        <button
          className="sidebar-toggle mobile"
          onClick={toggleMobileSidebar}
          aria-label="Open Mobile Menu"
          aria-controls="sidebar-navigation"
        >
          <FaBars aria-hidden="true" />
        </button>

        <div className="header-brand">
          <span className="app-name-header">The Dev Hub</span>
        </div>
      </div>

      <div className="header-right">
        <ProfileDropdown />
      </div>
    </header>
  );
}

export default Header;
// export default Header;
