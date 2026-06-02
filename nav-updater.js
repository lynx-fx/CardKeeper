const fs = require('fs');

let css = fs.readFileSync('client/src/styles/navbar.css', 'utf8');

const replacements = [
  // Navbar background to glassmorphism
  { search: /background:\s*white;/g, replace: 'background: rgba(5, 5, 5, 0.6);\n  backdrop-filter: blur(16px);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.05);' },
  { search: /box-shadow:\s*0 2px 10px rgba\(0, 0, 0, 0\.1\);/g, replace: 'box-shadow: none;' },
  
  // Logo color
  { search: /color:\s*#111111;/g, replace: 'color: #fff;' },
  
  // Links
  { search: /color:\s*#333;/g, replace: 'color: #888;' },
  { search: /\.nav-links a:hover \{\s*color: #111111;/g, replace: '.nav-links a:hover {\n  color: #fff;' },
  { search: /\.mobile-nav-links a:hover \{\s*color: #111111;/g, replace: '.mobile-nav-links a:hover {\n  color: #fff;' },
  
  // Borders in mobile menu
  { search: /border-bottom:\s*1px solid #f0f0f0;/g, replace: 'border-bottom: 1px solid rgba(255, 255, 255, 0.05);' },
  
  // Mobile User Menu background
  { search: /background:\s*#f8f9fa;/g, replace: 'background: rgba(255, 255, 255, 0.05);' },
];

replacements.forEach(({search, replace}) => {
  css = css.replace(search, replace);
});

// Explicit fixes in case they were missed by general regex
css = css.replace(/\.hamburger span \{\s*display: block;\s*height: 3px;\s*width: 100%;\s*background: #333;/g, '.hamburger span {\n  display: block;\n  height: 3px;\n  width: 100%;\n  background: #fff;');
css = css.replace(/\.mobile-menu \{\s*position: fixed;[\s\S]*?background: rgba\(5, 5, 5, 0\.6\);[\s\S]*?backdrop-filter: blur\(16px\);[\s\S]*?border-bottom: 1px solid rgba\(255, 255, 255, 0\.05\);/g, (match) => {
  return match.replace(/background: rgba\(5, 5, 5, 0\.6\);[\s\S]*?border-bottom: 1px solid rgba\(255, 255, 255, 0\.05\);/, 'background: #050505;\n  border-left: 1px solid rgba(255, 255, 255, 0.05);');
});

fs.writeFileSync('client/src/styles/navbar.css', css, 'utf8');
