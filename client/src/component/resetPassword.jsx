"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "./navbar.jsx";
import Loading from "./loading.jsx";
import "./../styles/auth.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isValidating, setIsValidating] = useState(true);
  const VITE_HOST = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setIsValidating(false);
      return;
    }
    validateToken();
  }, []);

  const validateToken = async () => {
    setIsValidating(true);
    const response = await fetch(
      `${VITE_HOST}/api/auth/validateToken?email=${email}&token=${token}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      setIsValidToken(true);
      setIsValidating(false);
      toast.success(data.message || "Token verified");
    } else {
      setIsValidToken(false);
      setIsValidating(false);
      toast.error(data.message || "Something went wrong.");
    }
  };

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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    const response = await fetch(`${VITE_HOST}/api/auth/resetPassword`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        newPassword: formData.password,
      }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (response.ok && data.success) {
      setIsSuccess(true);
      toast.success(data.message || "Password updated successfully");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setIsSuccess(false);
      toast.error(data.message || "Something went wrong");
      setFormData({
        password: "",
        confirmPassword: "",
      });
    }
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="loading-spinner">⏳</div>
              <h1>Validating Reset Link</h1>
              <p>Please wait while we verify your reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="error-icon">❌</div>
              <h1>Invalid Reset Link</h1>
              <p>This password reset link is invalid or has expired.</p>
            </div>

            <div className="auth-form">
              <div className="info-box error-box">
                <p>
                  The reset link may have expired or been used already. Please
                  request a new password reset link.
                </p>
              </div>

              <div className="form-actions-vertical">
                <Link to="/forgot-password" className="btn-primary full-width">
                  Request New Reset Link
                </Link>
                <Link to="/login" className="btn-secondary full-width">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="success-icon">✅</div>
              <h1>Password Reset Successful</h1>
              <p>Your password has been successfully updated.</p>
            </div>

            <div className="auth-form">
              <div className="info-box success-box">
                <p>
                  You can now sign in with your new password. You will be
                  redirected to the login page in a few seconds.
                </p>
              </div>

              <div className="form-actions-vertical">
                <Link to="/login" className="btn-primary full-width">
                  Continue to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <>
      {isLoading && <Loading />}
      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Reset Your Password</h1>
              <p>Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="info-box">
                <p>
                  <strong>Password Requirements:</strong>
                  <br />• At least 8 characters long
                  <br />• Contains uppercase and lowercase letters
                  <br />• Contains at least one number
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  placeholder="Enter your new password"
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary full-width"
                disabled={isLoading}
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="link-button">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
