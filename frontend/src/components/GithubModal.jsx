import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { FaGithub } from "react-icons/fa";

function GithubModal({ onClose }) {
  const { user, syncGithub } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.github_username || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMsg("Syncing with GitHub...");

    const result = await syncGithub();

    if (result.success) {
      setMsg("Success! Stats Updated.");
      setTimeout(onClose, 1500);
    } else {
      setMsg("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div
      style={modalStyles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-modal-title"
    >
      <div style={modalStyles.box}>
        <h2 id="github-modal-title">
          <FaGithub aria-hidden="true" /> GitHub Sync
        </h2>
        <p>Pull your latest commits and velocity.</p>

        <div
          style={{
            margin: "20px 0",
            padding: "10px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "5px",
          }}
        >
          Linked Account:{" "}
          <strong>
            {user?.github_username || "Not Linked (Set in Admin)"}
          </strong>
        </div>

        {msg && (
          <p
            style={{ color: "var(--secondary-color)" }}
            role="alert"
            aria-live="polite"
          >
            {msg}
          </p>
        )}

        <div style={modalStyles.buttons}>
          <button onClick={onClose} style={modalStyles.cancel}>
            Close
          </button>
          <button
            onClick={handleSync}
            style={modalStyles.confirm}
            disabled={loading}
          >
            {loading ? "Syncing..." : "Sync Stats Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    background: "#1a1d21",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    border: "1px solid #333",
    textAlign: "center",
    color: "#fff",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    justifyContent: "center",
  },
  cancel: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #555",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
  confirm: {
    padding: "10px 20px",
    background: "#238636",
    border: "none",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default GithubModal;
