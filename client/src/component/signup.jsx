"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "./navbar.jsx";
import Loading from "./loading.jsx";
import "./../styles/split-auth.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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
    try {
      const response = await fetch(`${VITE_HOST}/api/auth/register`, {
        method: "POST",
        // 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        toast.success("Redirecting...");
        toast.success(data.message || "User created sucessfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(data.message || "Something went wrong");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      <div className="split-auth-page">
        {/* Left Side Graphics */}
        <div className="split-left">
          <div className="split-left-content">
            <h1>Get Started<br/>with Us</h1>
            <p>
              Complete these easy steps to register your account and never lose a warranty again.
            </p>
            <div className="split-steps">
              <div className="step-card active">
                <div className="step-number-circle">1</div>
                <div className="step-title">Sign up your account</div>
              </div>
              <div className="step-card">
                <div className="step-number-circle">2</div>
                <div className="step-title">Set up your workspace</div>
              </div>
              <div className="step-card">
                <div className="step-number-circle">3</div>
                <div className="step-title">Set up your profile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="split-right">
          <div className="split-form-container">
            <div className="split-form-header">
              <h2>Sign Up Account</h2>
              <p>Enter your personal data to create your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="split-form">
              <div className="split-form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  placeholder="Your name"
                />
                {errors.name && (
                  <span className="split-error-message">{errors.name}</span>
                )}
              </div>

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
                <span className="split-error-message" style={{ color: "#666", fontSize: "0.75rem", marginTop: "0" }}>
                  Must be at least 8 characters.
                </span>
                {errors.password && (
                  <span className="split-error-message">{errors.password}</span>
                )}
              </div>

              <div className="split-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <span className="split-error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div className="split-form-options" style={{ marginTop: "0.5rem" }}>
                <label className="split-checkbox-label">
                  <input type="checkbox" required />
                  <span>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="split-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <div className="split-footer">
              Already have an account?{" "}
              <Link to="/login" className="split-link">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
