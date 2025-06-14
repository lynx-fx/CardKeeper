"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./../styles/navbar.css"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Determine navbar content based on current route only
  const isLandingPage = location.pathname === "/"
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname)
  const isDashboardPage = location.pathname === "/dashboard"

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <h2>WarrantyKeeper</h2>
          </Link>

          {/* Desktop Navigation */}
          {isLandingPage && (
            <nav className="nav-links desktop-nav">
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#contact">Contact</a>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="nav-actions desktop-nav">
            {isLandingPage && (
              <div className="auth-buttons">
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {isAuthPage && (
              <Link to="/" className="btn-secondary">
                Back to Home
              </Link>
            )}

            {isDashboardPage && (
              <div className="dashboard-actions">
                <Link to="/" className="btn-secondary">
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-content">
            {isLandingPage && (
              <nav className="mobile-nav-links">
                <a href="#features" onClick={closeMobileMenu}>
                  Features
                </a>
                <a href="#how-it-works" onClick={closeMobileMenu}>
                  How it Works
                </a>
                <a href="#contact" onClick={closeMobileMenu}>
                  Contact
                </a>
              </nav>
            )}

            <div className="mobile-nav-actions">
              {isLandingPage && (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="btn-secondary full-width" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary full-width" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </div>
              )}

              {isAuthPage && (
                <Link to="/" className="btn-secondary full-width" onClick={closeMobileMenu}>
                  Back to Home
                </Link>
              )}

              {isDashboardPage && (
                <div className="mobile-dashboard-actions">
                  <Link to="/" className="btn-secondary full-width" onClick={closeMobileMenu}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
      </div>
    </header>
  )
}
