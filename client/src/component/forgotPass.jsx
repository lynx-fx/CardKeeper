"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "./navbar.jsx";
import Loading from "./loading.jsx";
import "./../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const VITE_HOST = import.meta.env.VITE_BACKEND;

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const response = await fetch(`${VITE_HOST}/api/auth/forgot`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (response.ok && data.success) {
      setIsSubmitted(true);
      setResendCount((prev) => prev + 1);
    } else {
      toast.error(data.message || "Something went wrong");
      setEmail("");
    }

    // Disable resend for 60 seconds
    setCanResend(false);
    setTimeout(() => {
      setCanResend(true);
    }, 60000);
  };

  const handleResend = () => {
    if (!canResend) return;

    setIsLoading(true);
    setTimeout(() => {
      setResendCount((prev) => prev + 1);
      setIsLoading(false);

      // Disable resend for 60 seconds
      setCanResend(false);
      setTimeout(() => {
        setCanResend(true);
      }, 60000);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <>
        {isLoading && <Loading />}
        <div className="auth-page">
          <Navbar />

          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-header">
                <div className="success-icon">📧</div>
                <h1>Check Your Email</h1>
                <p>
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              <div className="auth-form">
                <div className="info-box">
                  <p>
                    <strong>What to do next:</strong>
                    <br />
                    1. Check your email inbox (and spam folder)
                    <br />
                    2. Click the reset link in the email
                    <br />
                    3. Follow the instructions to create a new password
                  </p>
                </div>

                <div className="info-box">
                  <p>
                    <strong>Important:</strong> The reset link will expire in 10
                    minutes for security reasons.
                    {resendCount > 0 &&
                      ` (Sent ${resendCount} time${
                        resendCount > 1 ? "s" : ""
                      })`}
                  </p>
                </div>

                <div className="form-actions-vertical">
                  <Link to="/login" className="btn-primary full-width">
                    Back to Sign In
                  </Link>

                  <button
                    className={`btn-secondary full-width ${
                      !canResend ? "disabled" : ""
                    }`}
                    onClick={handleResend}
                    disabled={!canResend || isLoading}
                  >
                    {isLoading
                      ? "Sending..."
                      : canResend
                      ? "Resend Email"
                      : "Wait 60s to Resend"}
                  </button>

                  <button
                    className="link-button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                      setResendCount(0);
                    }}
                  >
                    Use Different Email Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isLoading && <Loading />}

      <div className="auth-page">
        <Navbar />

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Forgot Password?</h1>
              <p>
                No worries! Enter your email address and we'll send you a link
                to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="info-box">
                <p>
                  We'll send you an email with instructions to reset your
                  password. Make sure to check your spam folder if you don't see
                  it in your inbox.
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary full-width"
                disabled={isLoading}
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="link-button">
                  Back to Sign In
                </Link>
              </p>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="link-button">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
