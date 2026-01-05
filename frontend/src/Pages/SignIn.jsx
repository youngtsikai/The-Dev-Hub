import React, { useContext, useState } from "react";
import {
  FaUser,
  FaLock,
  FaGithub,
  FaGoogle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function SignIn() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(username, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
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
          <h2>Login</h2>

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
              id="username"
              placeholder="Username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="Username"
            />
            <FaUser className="icon user" aria-hidden="true" />
          </div>

          <div className="form-control">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <FaLock className="icon password" aria-hidden="true" />

            <button
              type="button"
              className="icon see"
              style={{
                cursor: "pointer",
                pointerEvents: "all",
                background: "none",
                border: "none",
                color: "var(--secondary-text)",
              }}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="forgot-password-container">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password
            </Link>
          </div>

          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        <div className="options">
          <hr />
          <p>Or continue with</p>
          <hr />
        </div>

        <div className="buttons">
          <button type="button" aria-label="Sign in with Google">
            <FaGoogle aria-hidden="true" /> Google
          </button>
          <button type="button" aria-label="Sign in with Github">
            <FaGithub aria-hidden="true" /> Github
          </button>
        </div>

        <hr />
        <p>
          Don't have an Account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
