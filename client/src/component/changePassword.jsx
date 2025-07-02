"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "./navbar.jsx";
import Loading from "./loading.jsx";
import "./../styles/auth.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const VITE_HOST = import.meta.env.VITE_NODE_ENV == "production" ? import.meta.env.VITE_BACKEND_HOSTED : import.meta.env.VITE_BACKEND_LOCAL;

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

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
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
    try {
      const response = await fetch(`${VITE_HOST}/api/auth/changePassword`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          newPassword: formData.newPassword,
          oldPassword: formData.currentPassword,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        setIsSuccess(true);
        toast.success("Redirecting...");
        toast.success(data.message || "Changed password successfully");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setIsSuccess(false);
        toast.error(data.message || "Something went wrong.");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  // Success state
  if (isSuccess) {
    return (
      <>
        {isLoading && <Loading />}

        <div className="auth-page">
          <Navbar />
          <div className="auth-container">
            <div className="auth-card">
              <div className="auth-header">
                <div className="success-icon">✅</div>
                <h1>Password Changed Successfully</h1>
                <p>Your password has been updated successfully.</p>
              </div>

              <div className="auth-form">
                <div className="info-box success-box">
                  <p>
                    Your password has been changed. For security reasons, you
                    may need to sign in again on other devices.
                  </p>
                </div>

                <div className="form-actions-vertical">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="btn-primary full-width"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Change password form
  return (
    <>
      {isLoading && <Loading />}

      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Change Password</h1>
              <p>Update your account password</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={errors.currentPassword ? "error" : ""}
                  placeholder="Enter your current password"
                />
                {errors.currentPassword && (
                  <span className="error-message">
                    {errors.currentPassword}
                  </span>
                )}
              </div>

              <div className="info-box">
                <p>
                  <strong>New Password Requirements:</strong>
                  <br />• At least 8 characters long
                  <br />• Contains uppercase and lowercase letters
                  <br />• Contains at least one number
                  <br />• Must be different from current password
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? "error" : ""}
                  placeholder="Enter your new password"
                />
                {errors.newPassword && (
                  <span className="error-message">{errors.newPassword}</span>
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

              <div className="form-actions-horizontal">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>

            <div className="auth-footer">
              <div className="info-box">
                <p>
                  <strong>Security Tip:</strong> Use a strong, unique password
                  that you don't use for other accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
