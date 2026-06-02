const fs = require('fs');

let css = fs.readFileSync('client/src/styles/dashboard.css', 'utf8');

// Dashboard glow effect
const glowCSS = `
.dashboard-glow {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(163,255,18,0.1) 0%, rgba(0,0,0,0) 70%);
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.dashboard-main {
  position: relative;
  z-index: 10;
  padding: 4rem 0;
}
`;

css = css.replace('.dashboard-main {\n  padding: 1rem 0;\n}', glowCSS);

// Better inputs
css = css.replace(/\.search-input,[\s\S]*?\.filter-select \{([\s\S]*?)\}/, `.search-input,
.filter-select {
  padding: 0.8rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  font-size: 0.9rem;
  color: #fff;
  min-width: 0;
  backdrop-filter: blur(10px);
  transition: all 0.2s;
}`);

css = css.replace(/\.form-group input,[\s\S]*?\.form-group select,[\s\S]*?\.form-group textarea \{([\s\S]*?)\}/, `.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 1rem;
  color: #fff;
  transition: all 0.2s;
  box-sizing: border-box;
}`);

// Button pill shape
css = css.replace(/border-radius: 4px;/g, 'border-radius: 40px;');

fs.writeFileSync('client/src/styles/dashboard.css', css, 'utf8');

let jsx = fs.readFileSync('client/src/component/dashboard.jsx', 'utf8');

// Add glow to JSX
jsx = jsx.replace('<main className="dashboard-main">', '<main className="dashboard-main">\n          <div className="dashboard-glow"></div>');

// Replace emojis with clean ASCII or better labels
jsx = jsx.replace(/<div className="stat-icon">📋<\/div>/, '<div className="stat-icon">▰</div>');
jsx = jsx.replace(/<div className="stat-icon">✅<\/div>/, '<div className="stat-icon">●</div>');
jsx = jsx.replace(/<div className="stat-icon">⚠️<\/div>/, '<div className="stat-icon">◐</div>');
jsx = jsx.replace(/<div className="stat-icon">❌<\/div>/, '<div className="stat-icon">○</div>');

fs.writeFileSync('client/src/component/dashboard.jsx', jsx, 'utf8');
