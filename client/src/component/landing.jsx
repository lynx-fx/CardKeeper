"use client"

import { Link } from "react-router-dom"
import Navbar from "./navbar.jsx"
import "./../styles/landing.css"

export default function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Never Lose a Warranty Again</h1>
            <p>
              Store, organize, and track all your warranty cards in one secure digital place. Get reminders before they
              expire and access them anywhere, anytime.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary">
                Get Started Free
              </Link>
              <button className="btn-secondary">Watch Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="warranty-blog-header.png" alt="Warranty management dashboard" />
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Why Choose WarrantyKeeper?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Digital Storage</h3>
              <p>Scan and store warranty cards digitally. No more lost papers or forgotten receipts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Smart Reminders</h3>
              <p>Get notified before your warranties expire so you never miss a claim opportunity.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your warranty information is encrypted and stored securely in the cloud.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Easy Organization</h3>
              <p>Categorize by product type, purchase date, or warranty status for quick access.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Add Your Warranties</h3>
              <p>Upload photos of warranty cards or manually enter warranty details</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Organize & Categorize</h3>
              <p>Sort warranties by product type, store, or expiration date</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Reminders</h3>
              <p>Receive notifications before warranties expire</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Make Claims</h3>
              <p>Access warranty details instantly when you need to make a claim</p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>WarrantyKeeper</h3>
              <p>Your digital warranty management solution</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>support@warrantykeeper.com</p>
              {/* <p>1-800-WARRANTY</p> */}
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            <div className="footer-section">
              <h4>Location</h4>
              <a href="#">Nepal</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 WarrantyKeeper. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
