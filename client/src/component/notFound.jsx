"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar.jsx";
import "./../styles/not-found.css";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    setTimeout(() => setIsAnimating(true), 100);

    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => {
    setIsAnimating(false);
    setTimeout(() => navigate("/"), 300);
  };

  return (
    <div className="not-found-page">
      <Navbar />

      <div className="not-found-container">
        <div className={`not-found-content ${isAnimating ? "animate-in" : ""}`}>
          {/* Animated 404 */}
          <div className="error-code">
            <span className="digit bounce-1">4</span>
            <span className="digit bounce-2">0</span>
            <span className="digit bounce-3">4</span>
          </div>

          {/* Floating elements */}
          <div className="floating-elements">
            <div className="floating-element float-1">📋</div>
            <div className="floating-element float-2">🔍</div>
            <div className="floating-element float-3">⚠️</div>
            <div className="floating-element float-4">📱</div>
            <div className="floating-element float-5">🔒</div>
          </div>

          {/* Main content */}
          <div className="error-content">
            <h1 className="error-title slide-up">Oops! Page Not Found</h1>
            <p className="error-description slide-up-delay">
              The warranty you're looking for seems to have expired... or maybe
              it never existed!
            </p>
            <p className="error-subtitle slide-up-delay-2">
              Don't worry, we'll help you find what you need.
            </p>

            {/* Action buttons */}
            <div className="error-actions slide-up-delay-3">
              <button onClick={handleGoHome} className="btn-primary pulse">
                Take Me Home
              </button>
              <Link to="/dashboard" className="btn-secondary">
                Go to Dashboard
              </Link>
            </div>

            {/* Suggestions */}
            <div className="suggestions slide-up-delay-4">
              <h3>What you can do:</h3>
              <ul>
                <li>
                  <span className="suggestion-icon">🏠</span>
                  <Link to="/">Go back to homepage</Link>
                </li>
                <li>
                  <span className="suggestion-icon">📋</span>
                  <Link to="/dashboard">Check your warranties</Link>
                </li>
                <li>
                  <span className="suggestion-icon">🔍</span>
                  <span>Search for what you were looking for</span>
                </li>
                <li>
                  <span className="suggestion-icon">📞</span>
                  <span>Contact our support team</span>
                </li>
              </ul>
            </div>

            {/* Auto-redirect countdown */}
            <div className="countdown slide-up-delay-5">
              <p>
                Automatically redirecting to homepage in{" "}
                <span className="countdown-number">{countdown}</span> seconds
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    animationDuration: "10s",
                    animationPlayState: countdown > 0 ? "running" : "paused",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background animation */}
        <div className="background-animation">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>
    </div>
  );
}
