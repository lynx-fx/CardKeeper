const fs = require('fs');

const fixFile = (path) => {
  let content = fs.readFileSync(path, 'utf8');
  
  // Fix bad syntax from my previous regex
  content = content.replace(/headers: \{ Authorization: `Bearer \$\{Cookies\.get\("token"\)\}`\s*Authorization: `Bearer \$\{Cookies\.get\("token"\)\}`/g, 'headers: { Authorization: `Bearer ${Cookies.get("token")}`');
  
  content = content.replace(/headers: \{ "content-type": "application\/json"\s*Authorization: `Bearer \$\{Cookies\.get\("token"\)\}`/g, 'headers: { "content-type": "application/json"');

  // Fix another potential issue
  content = content.replace(/headers: \{\s*Authorization: `Bearer \$\{Cookies\.get\("token"\)\}`\s*\},\s*headers:/g, 'headers: { Authorization: `Bearer ${Cookies.get("token")}` }, // headers:');

  fs.writeFileSync(path, content, 'utf8');
}

fixFile('/home/lynx/Projects/CardKeeper/client/src/component/dashboard.jsx');
fixFile('/home/lynx/Projects/CardKeeper/client/src/component/login.jsx');
fixFile('/home/lynx/Projects/CardKeeper/client/src/component/changePassword.jsx');

console.log('Fixed');
