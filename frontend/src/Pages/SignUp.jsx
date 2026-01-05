import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaUser, FaLock, FaGithub, FaEnvelope } from "react-icons/fa";

function SignUp() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    github_username: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        await loginUser(formData.username, formData.password);
        navigate("/dashboard");
      } else {
        const errorMsg = Object.values(data)[0][0] || "Registration failed";
        setError(errorMsg);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="form-container">
        <div className="brand-logo" aria-hidden="true">
          <span className="bracket">&lt;</span>
          <span className="slash">/</span>
          <span className="bracket">&gt;</span>
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          {error && (
            <p
              style={{ color: "var(--error)", marginBottom: "1rem" }}
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="form-control">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              aria-label="Username"
            />
            <FaUser className="icon user" aria-hidden="true" />
          </div>

          <div className="form-control">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Email Address"
            />
            <FaEnvelope className="icon user" aria-hidden="true" />
          </div>

          <div className="form-control">
            <input
              type="text"
              name="github_username"
              placeholder="GitHub Username"
              value={formData.github_username}
              onChange={handleChange}
              required
              style={{ borderColor: "var(--secondary-color)" }}
              aria-label="GitHub Username"
            />
            <FaGithub className="icon user" aria-hidden="true" />
          </div>

          <div className="form-control">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-label="Password"
            />
            <FaLock className="icon password" aria-hidden="true" />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <hr />
        <p>
          Already have an account?{" "}
          <Link to="/signin" className="signup-link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
