import React from "react";
import "./StatCard.css";

function StatCard({ title, value, subtext, color = "mint", icon }) {
  return (
    <div className="stat-card" role="status" aria-label={`${title}: ${value}`}>
      <div className={`stat-icon-bg ${color}`} aria-hidden="true">
        {icon}
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
      <span className="stat-trend neutral" aria-hidden="true">
        {subtext}
      </span>
    </div>
  );
}

export default StatCard;
