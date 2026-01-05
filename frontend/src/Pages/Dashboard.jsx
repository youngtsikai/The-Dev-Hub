import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import "./Dashboard.css";
import { FaGitAlt, FaCodeBranch, FaBug, FaFire } from "react-icons/fa";
import {
  MdTimer,
  MdTrendingUp,
  MdCheckCircle,
  MdRadioButtonUnchecked,
} from "react-icons/md";
import GithubModal from "../components/GithubModal";

function Dashboard() {
  const { user, completeQuest } = useContext(AuthContext);
  const [showGithubModal, setShowGithubModal] = useState(false);

  if (!user)
    return (
      <div className="dashboard-loading" role="status" aria-live="polite">
        Loading System...
      </div>
    );

  const handleQuestClick = async (questId, status) => {
    if (status === "completed") return;
    await completeQuest(questId);
  };

  const getBarHeight = (val, allValues) => {
    const max = Math.max(...(allValues || [0]));
    if (max === 0) return "5%";
    return `${(val / max) * 100}%`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="hero-text">
          <h1>System Online.</h1>
          <p>
            Welcome back,{" "}
            <span
              style={{ color: "var(--secondary-color)", fontWeight: "bold" }}
            >
              {user.first_name
                ? user.first_name
                : user.github_username || user.username}
            </span>
            . Your current rank is {user.title}.
          </p>
        </div>
        <div
          className="streak-badge"
          aria-label={`${user.streak_days} Day Streak`}
        >
          <FaFire className="streak-icon" aria-hidden="true" />
          <span>{user.streak_days} Day Streak</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" role="status" aria-label="Commits">
          <div className="stat-icon-bg mint" aria-hidden="true">
            <FaGitAlt />
          </div>
          <div className="stat-info">
            <h3>{user.total_commits}</h3>
            <p>Commits</p>
          </div>
          <span className="stat-trend positive" aria-hidden="true">
            Gamified Total
          </span>
        </div>

        <div className="stat-card" role="status" aria-label="Pull Requests">
          <div className="stat-icon-bg purple" aria-hidden="true">
            <FaCodeBranch />
          </div>
          <div className="stat-info">
            <h3>{user.prs_merged}</h3>
            <p>PRs Merged</p>
          </div>
          <span className="stat-trend neutral" aria-hidden="true">
            Last 90 Days
          </span>
        </div>

        <div className="stat-card" role="status" aria-label="Bugs Fixed">
          <div className="stat-icon-bg blue" aria-hidden="true">
            <FaBug />
          </div>
          <div className="stat-info">
            <h3>{user.bugs_fixed}</h3>
            <p>Bugs Fixed</p>
          </div>
          <span className="stat-trend positive" aria-hidden="true">
            Last 90 Days
          </span>
        </div>

        <div className="stat-card" role="status" aria-label="Focus Time">
          <div className="stat-icon-bg yellow" aria-hidden="true">
            <MdTimer />
          </div>
          <div className="stat-info">
            <h3>{user.focus_hours}h</h3>
            <p>Focus Time</p>
          </div>
          <span className="stat-trend positive" aria-hidden="true">
            Logged Manually
          </span>
        </div>
      </div>

      <div className="dashboard-split">
        <div className="chart-section" aria-label="Activity Velocity Chart">
          <div className="section-header">
            <h2>
              <MdTrendingUp aria-hidden="true" /> Activity Velocity
            </h2>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>Last 7 Days</div>
          </div>

          <div
            className="chart-placeholder"
            style={{ alignItems: "flex-end", gap: "8px" }}
            role="img"
            aria-label="Bar chart showing activity over the last 7 days"
          >
            {(user.velocity || [0, 0, 0, 0, 0, 0, 0]).map((count, index) => (
              <div
                key={index}
                className="bar"
                style={{
                  height: getBarHeight(count, user.velocity || []),
                  background:
                    index === 6 ? "var(--secondary-color)" : "#2d333b",
                  position: "relative",
                  transition: "height 0.5s ease",
                  minHeight: "5%",
                }}
                title={`${count} events`}
                role="graphics-symbol"
                aria-label={`${count} events on day ${index + 1}`}
              >
                {index === 6 && count > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "0.7rem",
                      color: "var(--secondary-color)",
                    }}
                    aria-hidden="true"
                  >
                    {count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="quests-section" aria-label="Active Quests">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2 style={{ margin: 0 }}>Active Quests</h2>
            <button
              onClick={() => setShowGithubModal(true)}
              className="btn-sync"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "5px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
              aria-label="Sync GitHub Data"
            >
              Sync GitHub
            </button>
          </div>

          <div className="quest-list">
            {user.quests && user.quests.length > 0 ? (
              user.quests.map((quest) => (
                <div key={quest.id} className="quest-item">
                  <div
                    className={`quest-status ${
                      quest.status === "completed" ? "done" : "pending"
                    }`}
                    aria-label={`Status: ${quest.status}`}
                  ></div>
                  <div className="quest-details">
                    <h4>{quest.title}</h4>
                    <p>{quest.description}</p>
                    <div
                      className="quest-xp-pill"
                      aria-label={`${quest.xp_reward} XP Reward`}
                    >
                      {quest.xp_reward} XP
                    </div>
                  </div>
                  <div
                    onClick={() => handleQuestClick(quest.id, quest.status)}
                    style={{
                      cursor:
                        quest.status === "completed" ? "default" : "pointer",
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      quest.status === "completed"
                        ? "Quest Completed"
                        : "Mark Quest as Completed"
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleQuestClick(quest.id, quest.status);
                      }
                    }}
                  >
                    {quest.status === "completed" ? (
                      <MdCheckCircle
                        className="quest-icon-done"
                        aria-hidden="true"
                      />
                    ) : (
                      <MdRadioButtonUnchecked
                        className="quest-icon-pending"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-quests">
                <p>No active quests assigned.</p>
              </div>
            )}
          </div>
        </div>

        {showGithubModal && (
          <GithubModal onClose={() => setShowGithubModal(false)} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
