const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'client/src/component/dashboard.jsx',
  'client/src/component/changePassword.jsx',
  'client/src/component/login.jsx',
  'client/src/component/signup.jsx'
];

filesToProcess.forEach(file => {
  const filePath = path.join('/home/lynx/Projects/CardKeeper', file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure Cookies is imported if we add Authorization
  if (content.includes('fetch(') && !content.includes('import Cookies from "js-cookie"')) {
    content = content.replace(/(import .*;\n)/, '$1import Cookies from "js-cookie";\n');
  }

  // Find fetch calls and replace credentials: "include" with Authorization header
  // This is tricky with regex, so let's do targeted replacements based on known patterns.

  // Pattern 1: No headers block, just method, body, credentials
  content = content.replace(/body: (formData),([\s\S]*?)credentials: "include",?/g, (match, body, space) => {
    return `body: ${body},${space}headers: { Authorization: \`Bearer \${Cookies.get("token")}\` },`;
  });

  // Pattern 2: Existing headers block
  content = content.replace(/headers: \{([\s\S]*?)\},([\s\S]*?)credentials: "include",?/g, (match, headers, space) => {
    return `headers: {${headers}  Authorization: \`Bearer \${Cookies.get("token")}\`\n        },${space}`;
  });

  // Pattern 3: credentials: "include" in login.jsx/signup.jsx should just be removed since they don't need auth token
  if (file.includes('login.jsx') || file.includes('signup.jsx')) {
    content = content.replace(/credentials: "include",?/g, '');
    content = content.replace(/\/\/ credentials: "include",?/g, '');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
});
