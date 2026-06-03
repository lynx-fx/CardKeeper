"use client";

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Loading from "./loading.jsx";
import "./../styles/split-auth.css";
import Cookies from "js-cookie";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForgotModal, setShowForgotModal] = useState(searchParams.get("forgot") === "true");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotIsLoading, setForgotIsLoading] = useState(false);
  const [forgotIsSubmitted, setForgotIsSubmitted] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendCount, setResendCount] = useState(0);
 const VITE_HOST = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_HOSTED
  : import.meta.env.VITE_BACKEND_LOCAL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
    try {
      const response = await fetch(`${VITE_HOST}/api/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json"
        },
        
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        toast.success(data.message || "User logged in successfully.");
        Cookies.set("token", data.token, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
        window.location.href = "dashboard";
      } else {
        toast.error(data.message || "Something went wrong.");
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleForgotSubmit = async (e, isResend = false) => {
    if (e) e.preventDefault();

    if (!forgotEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (isResend && !canResend) return;

    setForgotIsLoading(true);
    try {
      const response = await fetch(`${VITE_HOST}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      setForgotIsLoading(false);

      if (response.ok && data.success) {
        setForgotIsSubmitted(true);
        if (isResend) setResendCount((prev) => prev + 1);
        toast.success(data.message || "Mail sent successfully");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      setForgotIsLoading(false);
    }

    // Disable resend for 60 seconds
    setCanResend(false);
    setTimeout(() => {
      setCanResend(true);
    }, 60000);
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="split-auth-page">
        {/* Left Side Graphics */}
        <div className="split-left">
          <div className="split-left-content">
            <h1>Welcome Back</h1>
            <p>
              Sign in to access your digital warranty vault. Keep track of your purchases, expiration dates, and get reminders when it matters.
            </p>
            <div className="split-steps">
              <div className="step-card active">
                <div className="step-number-circle">1</div>
                <div className="step-title">Access your account</div>
              </div>
              <div className="step-card">
                <div className="step-number-circle">2</div>
                <div className="step-title">View warranties</div>
              </div>
              <div className="step-card">
                <div className="step-number-circle">3</div>
                <div className="step-title">Get reminders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="split-right">
          <div className="split-form-container">
            <div className="split-form-header">
              <h2>Sign In</h2>
              <p>Enter your details to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="split-form">
              <div className="split-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  placeholder="mail@example.com"
                />
                {errors.email && (
                  <span className="split-error-message">{errors.email}</span>
                )}
              </div>

              <div className="split-form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <span className="split-error-message">{errors.password}</span>
                )}
              </div>

              <div className="split-form-options">
                <label className="split-checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="split-link"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.85rem' }}
                  onClick={() => {
                    setShowForgotModal(true);
                    setSearchParams({ forgot: "true" });
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="split-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="split-footer">
              Don't have an account?{" "}
              <Link to="/signup" className="split-link">
                Sign up here
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="split-modal-overlay">
          <div className="split-modal">
            <button 
              className="split-modal-close" 
              onClick={() => {
                setShowForgotModal(false);
                setSearchParams({});
              }}
            >
              &times;
            </button>
            <div className="split-form-header">
              <h2>Forgot Password?</h2>
              <p>Enter your email to receive a reset link.</p>
            </div>
            {!forgotIsSubmitted ? (
              <form onSubmit={handleForgotSubmit} className="split-form">
                <div className="split-form-group">
                  <label htmlFor="forgotEmail">Email Address</label>
                  <input
                    type="email"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>
                <button
                  type="submit"
                  className="split-btn-submit"
                  disabled={forgotIsLoading}
                >
                  {forgotIsLoading ? "Sending Link..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", color: "#888", fontSize: "0.9rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📧</div>
                <p>We've sent a password reset link to <strong style={{ color: "#fff" }}>{forgotEmail}</strong></p>
                <p style={{ margin: "1rem 0" }}>Check your inbox (and spam folder).</p>
                <button
                  className="split-btn-submit"
                  style={{ width: "100%", opacity: canResend ? 1 : 0.5, backgroundColor: "#222", color: "#fff" }}
                  onClick={() => handleForgotSubmit(null, true)}
                  disabled={!canResend || forgotIsLoading}
                >
                  {forgotIsLoading ? "Sending..." : canResend ? "Resend Email" : "Wait 60s to Resend"}
                </button>
                {resendCount > 0 && <p style={{ marginTop: "0.5rem", fontSize: "0.8rem" }}>Sent {resendCount} times</p>}
                <button
                  type="button"
                  className="split-link"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.85rem', marginTop: "1rem" }}
                  onClick={() => {
                    setForgotIsSubmitted(false);
                    setForgotEmail("");
                    setResendCount(0);
                  }}
                >
                  Use a different email
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
