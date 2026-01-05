import React, { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./ProfileDropdown.css";
import { MdLogout, MdOutlineAccountCircle } from "react-icons/md";

function ProfileDropdown() {
  const { user, logoutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const xpPerLevel = 200;
  const currentLevelXp = user ? user.current_xp % xpPerLevel : 0;
  const progressPercent = (currentLevelXp / xpPerLevel) * 100;

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="profile-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User Profile Menu"
      >
        <img
          src={
            user?.avatar
              ? `http://127.0.0.1:8000${user.avatar}`
              : "https://i.pravatar.cc/100"
          }
          alt=""
          className="profile-user-avatar"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-profile-info">
            <img
              src={
                user?.avatar
                  ? `http://127.0.0.1:8000${user.avatar}`
                  : "https://i.pravatar.cc/100"
              }
              alt="User Avatar"
              className="dropdown-avatar"
            />
            <h3 className="dropdown-name">{user ? user.username : "Guest"}</h3>
            <p className="dropdown-level">{user ? user.title : "Rookie Dev"}</p>
          </div>

          <div
            className="xp-progress"
            style={{ padding: "0 15px 15px" }}
            role="progressbar"
            aria-valuenow={currentLevelXp}
            aria-valuemin="0"
            aria-valuemax={xpPerLevel}
            aria-label="XP Progress to next level"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                marginBottom: "5px",
                color: "#8b949e",
              }}
            >
              <span>XP: {user ? user.current_xp : 0}</span>
              <span
                className="level-badge"
                style={{ color: "var(--secondary-color)", fontWeight: "bold" }}
              >
                Lvl {user ? user.level : 1}
              </span>
            </div>

            <div
              className="progress-bar-container"
              style={{
                height: "6px",
                background: "#30363d",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                className="progress-bar"
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "var(--secondary-color)",
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>

            <div
              style={{
                textAlign: "right",
                fontSize: "0.75rem",
                color: "#666",
                marginTop: "4px",
              }}
            >
              {xpPerLevel - currentLevelXp} XP to next rank
            </div>
          </div>

          <ul className="dropdown-links">
            <li role="menuitem">
              <NavLink to="/settings/account">
                <MdOutlineAccountCircle aria-hidden="true" /> Account
              </NavLink>
            </li>
            <hr role="separator" />
            <li role="menuitem">
              <button onClick={handleLogout} className="logout-btn-link">
                <MdLogout aria-hidden="true" /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
