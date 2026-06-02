import { Link } from "react-router-dom";
import "./../styles/landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Bespoke Header */}
      <nav className="astra-nav">
        <Link to="/" className="astra-logo">
          <span className="astra-logo-icon">▰</span> CardKeeper
        </Link>
        <div className="astra-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="astra-nav-buttons">
          <Link to="/login" className="btn-astra-dark">Log In</Link>
          <Link to="/signup" className="btn-astra-neon">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="astra-hero">
        <div className="astra-hero-box">
          <div className="astra-hero-glow"></div>
          
          {/* Abstract floating elements */}
          <div className="astra-float-card card-1">
            <div className="card-header"></div>
            <div className="card-body"></div>
          </div>
          <div className="astra-float-card card-2">
            <div className="card-badge"></div>
          </div>
          
          <div className="astra-hero-content-wrapper">
            <div className="astra-hero-tag">
              <span className="pulse-dot"></span> Smart Warranty Management
            </div>
            <h1 className="astra-hero-title">
              Never Lose a <span className="text-gradient">Warranty</span> Again
            </h1>
            <p className="astra-hero-subtitle">
              Store, organize, and track all your warranty cards in one secure digital place. 
              Get reminders before they expire, completely eliminating the friction of traditional paper storage.
            </p>
            <div className="astra-hero-actions">
              <Link to="/signup" className="btn-astra-neon-large">Get Started Free <span>›</span></Link>
              <a href="#how-it-works" className="btn-astra-glass-large">See How it Works</a>
            </div>
            
            <div className="astra-hero-social-proof">
              <div className="avatars">
                <img src="https://i.pravatar.cc/100?img=1" alt="user" />
                <img src="https://i.pravatar.cc/100?img=2" alt="user" />
                <img src="https://i.pravatar.cc/100?img=3" alt="user" />
                <img src="https://i.pravatar.cc/100?img=4" alt="user" />
                <div className="avatar-more">10k+</div>
              </div>
              <span>Trusted by thousands of users worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos (Optional / Aesthetic) */}
      <section className="astra-logos">
        <span>Samsung</span>
        <span>LG</span>
        <span>Apple</span>
        <span>Sony</span>
        <span>Canon</span>
        <span>Bose</span>
      </section>

      {/* Stats Section */}
      <section className="astra-stats">
        <div className="astra-stat-item">
          <h3>1M+</h3>
          <p>Warranties Tracked</p>
        </div>
        <div className="astra-stat-item">
          <h3>$5M+</h3>
          <p>Saved for Users</p>
        </div>
        <div className="astra-stat-item">
          <h3>99.9%</h3>
          <p>Uptime Guaranteed</p>
        </div>
      </section>

      {/* Feature Split Section */}
      <section id="features" className="astra-feature">
        <div className="astra-feature-content">
          <span className="accent">The warranty first platform</span>
          <h2>Why Choose CardKeeper?</h2>
          <p>
            Scan and store warranty cards digitally. No more lost papers or forgotten receipts. 
            Outcome focused organization that ensures you always have the details you need when making a claim.
          </p>
          
          <div className="astra-pill-list">
            <div className="astra-pill-item active">
              <span>Smart Reminders</span>
              <span>›</span>
            </div>
            <div className="astra-pill-item">
              <span>Secure & Private</span>
              <span>›</span>
            </div>
            <div className="astra-pill-item">
              <span>Easy Organization</span>
              <span>›</span>
            </div>
          </div>
        </div>
        
        <div className="astra-feature-graphic">
          <div className="astra-floating-element">
            <i>↻</i>
          </div>
        </div>
      </section>

      {/* Centered Feature Section */}
      <section id="how-it-works" className="astra-centered-feature">
        <h2>Faster. Smarter. Organized.</h2>
        <p>
          Follow these simple steps to never miss a claim opportunity. 
          Use our intelligent organization tools, lower your mental friction, and facilitate seamless tracking.
        </p>

        <div className="astra-large-card">
          <div className="astra-large-card-content">
            <h3>Optimized for claims</h3>
            <p>
              Designed with a focus on reliability, the system employs robust organization protocols, 
              regular expiration updates, and advanced reminders to ensure you never miss a warranty deadline.
            </p>
            <Link to="/signup" className="btn-astra-dark">Learn More <span>›</span></Link>
          </div>
          <div className="astra-large-card-graphic">
            <div className="astra-graphic-panel"></div>
            <div className="astra-small-float">▰</div>
          </div>
        </div>
      </section>

      {/* Testimonials Section
      <section id="testimonials" className="astra-testimonials">
        <h2>Loved by thousands of users</h2>
        <div className="astra-testimonial-grid">
          <div className="astra-testimonial-card">
            <div className="astra-quote">"CardKeeper completely changed how I manage my electronics. I no longer have a drawer full of fading receipts. When my monitor broke, I had the warranty info in 3 seconds."</div>
            <div className="astra-author">
              <div className="astra-avatar">SJ</div>
              <div className="astra-author-info">
                <strong>Sarah Jenkins</strong>
                <span>Tech Enthusiast</span>
              </div>
            </div>
          </div>
          <div className="astra-testimonial-card">
            <div className="astra-quote">"I run a small business and tracking warranties for our equipment used to be a nightmare. CardKeeper's reminders mean we never miss a claim window anymore."</div>
            <div className="astra-author">
              <div className="astra-avatar">MR</div>
              <div className="astra-author-info">
                <strong>Mark Robinson</strong>
                <span>Studio Owner</span>
              </div>
            </div>
          </div>
          <div className="astra-testimonial-card">
            <div className="astra-quote">"The UI is gorgeous and it just works. I scanned all my home appliance warranties in one afternoon and now I have total peace of mind."</div>
            <div className="astra-author">
              <div className="astra-avatar">AL</div>
              <div className="astra-author-info">
                <strong>Amanda Lee</strong>
                <span>Homeowner</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer id="contact" className="astra-footer">
        <div className="astra-footer-brand">
          <Link to="/" className="astra-logo">
            <span className="astra-logo-icon">▰</span> CardKeeper
          </Link>
          <p>Your digital warranty vault. Keep track of purchases, expiration dates, and get reminders when it matters.</p>
        </div>
        <div className="astra-footer-section">
          <h4>Product</h4>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#integrations">Integrations</a>
        </div>
        <div className="astra-footer-section">
          <h4>Resources</h4>
          <a href="#help">Help Center</a>
          <a href="#guides">Guides</a>
          <a href="#api">API Status</a>
        </div>
        <div className="astra-footer-section">
          <h4>Legal</h4>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}
