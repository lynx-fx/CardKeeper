const fs = require('fs');
let css = fs.readFileSync('client/src/styles/dashboard.css', 'utf8');

// Colors replacement mapping
const replacements = [
  // Backgrounds
  { search: /#f8f9fa/gi, replace: '#050505' },
  { search: /:\s*#ffffff/gi, replace: ': #111111' },
  { search: /:\s*white/gi, replace: ': #111111' },
  
  // Primary colors
  { search: /#007bff/gi, replace: '#a3ff12' },
  { search: /rgba\(0,\s*123,\s*255,\s*0\.25\)/g, replace: 'rgba(163, 255, 18, 0.25)' },
  { search: /#e3f2fd/gi, replace: '#0b3d22' },
  { search: /#0056b3/gi, replace: '#b5ff3a' },
  { search: /#28a745/gi, replace: '#a3ff12' },
  
  // Texts
  { search: /#212529/gi, replace: '#ffffff' },
  { search: /#6c757d/gi, replace: '#a3b8b0' },
  { search: /#495057/gi, replace: '#e0e0e0' },
  
  // Borders
  { search: /#ced4da/gi, replace: '#333' },
  { search: /#dee2e6/gi, replace: '#222' },
  { search: /#f0f0f0/gi, replace: '#222' },
  
  // Shadows
  { search: /rgba\(0,\s*0,\s*0,\s*0\.05\)/g, replace: 'rgba(163, 255, 18, 0.1)' },
  { search: /rgba\(0,\s*0,\s*0,\s*0\.1\)/g, replace: 'rgba(163, 255, 18, 0.15)' },
  
  // Specific backgrounds and colors
  { search: /background:\s*#d4edda/gi, replace: 'background: rgba(163, 255, 18, 0.2)' },
  { search: /color:\s*#155724/gi, replace: 'color: #a3ff12' },
  
  // Fix "white-space: nowrap" that might have been messed up by ": white" replacement
  { search: /white-space:\s*#111111/gi, replace: 'white-space: nowrap' },
  { search: /white-space:\s*#000/gi, replace: 'white-space: nowrap' }
];

replacements.forEach(({search, replace}) => {
  css = css.replace(search, replace);
});

// A few overrides for buttons and cards
css = css.replace(/\.dashboard \{/, '.dashboard {\n  color: #fff;');
css = css.replace(/\.stat-card \{\s*background: #111111;/g, '.stat-card {\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.05);');
css = css.replace(/\.warranty-card \{\s*background: #111111;/g, '.warranty-card {\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.05);');

// Make primary button text black since button is neon green
css = css.replace(/\.btn-primary \{\s*background: #a3ff12;\s*color: #111111;/g, '.btn-primary {\n  background: #a3ff12;\n  color: #000;');
css = css.replace(/\.btn-primary \{\s*color: #111111;\s*background: #a3ff12;/g, '.btn-primary {\n  color: #000;\n  background: #a3ff12;');

// Same for btn-small if it needs black text when primary
css = css.replace(/\.btn-primary:hover \{\s*background: #b5ff3a;/g, '.btn-primary:hover {\n  background: #b5ff3a;\n  color: #000;');

// Update dashboard title
css = css.replace(/\.dashboard-title h1 \{\s*color: #ffffff;/g, '.dashboard-title h1 {\n  color: #fff;');

// Update modal
css = css.replace(/\.modal \{\s*background: #111111;/g, '.modal {\n  background: #050505;\n  border: 1px solid rgba(255, 255, 255, 0.1);');
css = css.replace(/\.modal-header \{\s*.*?background: #111111;/gs, (match) => match.replace('#111111', '#050505'));

fs.writeFileSync('client/src/styles/dashboard.css', css, 'utf8');
