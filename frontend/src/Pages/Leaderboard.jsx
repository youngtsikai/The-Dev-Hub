import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Dashboard.css";
import { FaTrophy, FaMedal, FaCrown } from "react-icons/fa";

function Leaderboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("authTokens"));

        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/leaderboard/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to load leaderboard");
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0)
      return (
        <FaCrown
          style={{ color: "#f1c40f", fontSize: "1.5rem" }}
          aria-label="Rank 1: Gold"
        />
      );
    if (index === 1)
      return (
        <FaMedal
          style={{ color: "#bdc3c7", fontSize: "1.5rem" }}
          aria-label="Rank 2: Silver"
        />
      );
    if (index === 2)
      return (
        <FaMedal
          style={{ color: "#cd7f32", fontSize: "1.5rem" }}
          aria-label="Rank 3: Bronze"
        />
      );
    return (
      <span
        className="rank-number"
        style={{ fontSize: "1.2rem", color: "#8b949e" }}
        aria-label={`Rank ${index + 1}`}
      >
        #{index + 1}
      </span>
    );
  };

  const getAvatar = (u) => {
    if (u.avatar) {
      return `http://127.0.0.1:8000${u.avatar}`;
    }
    const name = u.first_name ? `${u.first_name} ${u.last_name}` : u.username;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&color=fff&size=128`;
  };

  if (loading)
    return (
      <div className="dashboard-loading" role="status" aria-live="polite">
        Loading Rankings...
      </div>
    );

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero" style={{ minHeight: "150px" }}>
        <div className="hero-text">
          <h1>Global Leaderboard</h1>
          <p>Top developers ranked by contribution XP.</p>
        </div>
        <div style={{ fontSize: "3rem", opacity: 0.2 }} aria-hidden="true">
          <FaTrophy />
        </div>
      </div>

      <div
        className="leaderboard-table-container"
        style={{ marginTop: "2rem" }}
      >
        <table
          className="leaderboard-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
          aria-label="Global Developer Leaderboard"
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th
                scope="col"
                style={{
                  width: "80px",
                  textAlign: "center",
                  padding: "15px",
                  color: "#8b949e",
                }}
              >
                Rank
              </th>

              <th
                scope="col"
                style={{ textAlign: "left", padding: "15px", color: "#8b949e" }}
              >
                Developer
              </th>

              <th
                scope="col"
                style={{
                  width: "180px",
                  textAlign: "left",
                  padding: "15px",
                  color: "#8b949e",
                }}
              >
                Title
              </th>

              <th
                scope="col"
                style={{
                  width: "100px",
                  textAlign: "left",
                  padding: "15px",
                  color: "#8b949e",
                }}
              >
                Level
              </th>

              <th
                scope="col"
                style={{
                  width: "120px",
                  textAlign: "right",
                  padding: "15px",
                  color: "#8b949e",
                }}
              >
                Total XP
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr
                key={u.id}
                className={
                  u.username === user.username ? "current-user-row" : ""
                }
                aria-current={u.username === user.username ? "true" : undefined}
                style={{
                  background:
                    u.username === user.username
                      ? "rgba(46, 204, 113, 0.1)"
                      : "transparent",
                  borderLeft:
                    u.username === user.username
                      ? "4px solid var(--secondary-color)"
                      : "4px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <td
                  className="rank-cell"
                  style={{ textAlign: "center", padding: "15px" }}
                >
                  {getRankIcon(index)}
                </td>

                <td className="user-cell" style={{ padding: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <img
                      src={getAvatar(u)}
                      alt={`${u.username}'s avatar`}
                      onError={(e) => {
                        const name = u.first_name || u.username;
                        e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
                      }}
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border:
                          index === 0
                            ? "2px solid #f1c40f"
                            : "2px solid rgba(255,255,255,0.1)",
                      }}
                    />
                    <div>
                      <span
                        style={{
                          fontWeight: "bold",
                          display: "block",
                          fontSize: "1rem",
                        }}
                      >
                        {u.first_name
                          ? `${u.first_name} ${u.last_name || ""}`
                          : u.username}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#8b949e" }}>
                        @{u.github_username || u.username}
                      </span>
                    </div>
                  </div>
                </td>

                <td style={{ padding: "15px" }}>
                  <span className="badge-title">{u.title}</span>
                </td>

                <td style={{ padding: "15px" }}>
                  <span style={{ color: "#8b949e", fontWeight: "500" }}>
                    Lvl {u.level}
                  </span>
                </td>

                <td
                  style={{
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "var(--secondary-color)",
                    fontSize: "1.1rem",
                    padding: "15px",
                  }}
                >
                  {u.current_xp.toLocaleString()} XP
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
