import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCheckCircle } from "react-icons/fa";

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="form-container">
        <h2>Forgot Password</h2>

        {!submitted ? (
          <>
            <p style={{ margin: "20px 0" }}>
              Enter the email address associated with your account.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  autoComplete="off"
                  required
                  aria-label="Email Address"
                />
                <FaUser className="icon user" aria-hidden="true" />
              </div>
              <button type="submit" className="btn-submit">
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div
            style={{ textAlign: "center", animation: "fadeIn 0.5s" }}
            role="alert"
            aria-live="polite"
          >
            <FaCheckCircle
              style={{
                fontSize: "3rem",
                color: "var(--secondary-color)",
                margin: "20px 0",
              }}
              aria-hidden="true"
            />
            <h3>Check your inbox!</h3>
            <p style={{ margin: "10px 0", color: "#8b949e" }}>
              If an account exists for that email, we have sent password reset
              instructions.
            </p>
          </div>
        )}

        <hr />
        <p>
          <Link to="/signin" className="signup-link">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
