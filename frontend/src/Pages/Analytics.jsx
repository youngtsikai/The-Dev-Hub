import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Analytics() {
  const { user } = useContext(AuthContext);

  if (!user)
    return (
      <div className="dashboard-loading" role="status" aria-live="polite">
        Loading Analytics...
      </div>
    );

  const breakdownData = {
    labels: ["Commits", "PRs Merged", "Bugs Fixed"],
    datasets: [
      {
        label: "# of Actions",
        data: [user.total_commits, user.prs_merged, user.bugs_fixed],
        backgroundColor: [
          "rgba(46, 204, 113, 0.6)",
          "rgba(155, 89, 182, 0.6)",
          "rgba(52, 152, 219, 0.6)",
        ],
        borderColor: [
          "rgba(46, 204, 113, 1)",
          "rgba(155, 89, 182, 1)",
          "rgba(52, 152, 219, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getLast7Days = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date();
    const labels = [];
    for (let i = 0; i < 7; i++) {
      labels.unshift(days[date.getDay()]);
      date.setDate(date.getDate() - 1);
    }
    return labels;
  };

  const velocityData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: "Activity Count",
        data: user.velocity || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const langKeys = user.languages ? Object.keys(user.languages) : ["No Data"];
  const langValues = user.languages ? Object.values(user.languages) : [1];

  const languageData = {
    labels: langKeys,
    datasets: [
      {
        label: "# of Repos",
        data: langValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero" style={{ minHeight: "150px" }}>
        <div className="hero-text">
          <h1>Analytics Console</h1>
          <p>Deep dive into your coding metrics and performance.</p>
        </div>
        <div style={{ marginLeft: "auto" }}></div>
      </div>

      <div
        className="stats-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          marginTop: "2rem",
          gap: "20px",
        }}
      >
        <div
          className="stat-card"
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>7-Day Velocity Trend</h3>
          <div
            style={{ width: "100%", height: "300px", marginTop: "20px" }}
            aria-label="Bar chart showing velocity trend over 7 days"
            role="img"
          >
            <Bar
              data={velocityData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Top Languages (by Repo)</h3>
          <div
            style={{ width: "300px", height: "300px", marginTop: "20px" }}
            aria-label="Pie chart showing top programming languages"
            role="img"
          >
            <Pie data={languageData} />
          </div>
        </div>

        <div
          className="stat-card"
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>Contribution Ratio</h3>
          <div
            style={{ width: "300px", height: "300px", marginTop: "20px" }}
            aria-label="Doughnut chart showing contribution ratio"
            role="img"
          >
            <Doughnut data={breakdownData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
