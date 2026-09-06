const fs = require('fs');
const path = require('path');

const srcPath = 'c:\\Users\\Mukesh\\AppData\\Local\\Temp\\8db38c59-8f74-4279-bedb-93cf8e1381bc_app1788087622731i1867104985.zip.1bc\\app1788087622731i1867104985.a.conf';
const destPath = path.resolve(__dirname, '..', 'mappls_config.txt');

try {
  const content = fs.readFileSync(srcPath, 'utf8');
  fs.writeFileSync(destPath, content, 'utf8');
  console.log('Saved to mappls_config.txt');
} catch (e) {
  console.error('Error reading conf:', e);
}
