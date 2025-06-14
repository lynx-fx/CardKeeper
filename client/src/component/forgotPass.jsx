"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from "./navbar.jsx"
import "./../styles/auth.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors({})
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <Navbar />

        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="success-icon">✅</div>
              <h1>Check Your Email</h1>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            <div className="auth-form">
              <div className="info-box">
                <p>
                  If you don't see the email in your inbox, please check your spam folder. The link will expire in 24
                  hours.
                </p>
              </div>

              <Link to="/login" className="btn-primary full-width">
                Back to Sign In
              </Link>

              <button className="btn-secondary full-width" onClick={() => setIsSubmitted(false)}>
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p>Enter your email address and we'll send you a link to reset your password</p>
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
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <button type="submit" className="btn-primary full-width" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
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
  )
}
