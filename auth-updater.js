const fs = require('fs');

let css = fs.readFileSync('client/src/styles/auth.css', 'utf8');

const replacements = [
  // Backgrounds
  { search: /background:\s*linear-gradient\(135deg,\s*#f8f9fa\s*0%,\s*#e9ecef\s*100%\);/g, replace: 'background: #050505;' },
  { search: /\.auth-card \{\s*background: white;/g, replace: '.auth-card {\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.05);' },
  { search: /\.auth-footer \{\s*text-align: center;[\s\S]*?border-top: 1px solid #e9ecef;[\s\S]*?background: #f8f9fa;/g, replace: '.auth-footer {\n  text-align: center;\n  padding: 1rem 2rem 2rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.1);\n  background: transparent;' },
  
  // Texts
  { search: /color:\s*#212529;/g, replace: 'color: #ffffff;' },
  { search: /color:\s*#6c757d;/g, replace: 'color: #a3b8b0;' },
  
  // Form inputs
  { search: /\.form-group input,[\s\S]*?\.form-group select \{([\s\S]*?)\}/, replace: `.form-group input,\n.form-group select {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 40px;\n  font-size: 1rem;\n  color: #fff;\n  transition: all 0.2s;\n}` },
  
  // Focus states
  { search: /border-color:\s*#111111;/g, replace: 'border-color: #a3ff12;' },
  { search: /box-shadow:\s*0 0 0 3px rgba\(0, 0, 0, 0\.1\);/g, replace: 'box-shadow: 0 0 0 3px rgba(163, 255, 18, 0.2);' },
  
  // Info boxes (blue to neon green)
  { search: /\.info-box \{\s*background: #e7f3ff;[\s\S]*?border: 1px solid #b3d9ff;/g, replace: '.info-box {\n  background: rgba(163, 255, 18, 0.1);\n  border: 1px solid rgba(163, 255, 18, 0.2);' },
  { search: /\.info-box p \{\s*color: #0066cc;/g, replace: '.info-box p {\n  color: #a3ff12;' },
  
  // Success boxes
  { search: /\.success-box \{\s*background: #d4edda;[\s\S]*?border-color: #c3e6cb;/g, replace: '.success-box {\n  background: rgba(163, 255, 18, 0.1);\n  border-color: rgba(163, 255, 18, 0.2);' },
  { search: /\.success-box p \{\s*color: #155724;/g, replace: '.success-box p {\n  color: #a3ff12;' },

  // Link buttons
  { search: /\.link-button \{\s*background: none;[\s\S]*?color: #111111;/g, replace: '.link-button {\n  background: none;\n  border: none;\n  padding: 0;\n  color: #a3ff12;' },
  { search: /\.link-button:hover \{\s*color: #333333;/g, replace: '.link-button:hover {\n  color: #b5ff3a;' }
];

replacements.forEach(({search, replace}) => {
  css = css.replace(search, replace);
});

fs.writeFileSync('client/src/styles/auth.css', css, 'utf8');
