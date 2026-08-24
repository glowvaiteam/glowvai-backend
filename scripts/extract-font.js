const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const downloadsDir = 'C:\\Users\\Mukesh\\Downloads';
const targetDir = path.join(__dirname, '..', 'assets', 'fonts');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('--- Inspecting Downloads for Fonts ---');
try {
  const files = fs.readdirSync(downloadsDir);
  console.log('All files in Downloads matching font/zip/ttf/otf:');
  const matched = files.filter(f => f.toLowerCase().includes('font') || f.toLowerCase().includes('bunch') || f.endsWith('.zip') || f.endsWith('.ttf') || f.endsWith('.otf'));
  console.log(matched);

  // If font.zip exists, try unzipping via tar or PowerShell
  const fontZip = path.join(downloadsDir, 'font.zip');
  if (fs.existsSync(fontZip)) {
    console.log('Found font.zip, extracting...');
    try {
      execSync(`tar -xf "${fontZip}" -C "${targetDir}"`);
      console.log('Extracted via tar to:', targetDir);
    } catch (e) {
      console.log('Tar extract failed, checking powershell expand-archive...');
    }
  }

  // Also check if any loose .ttf or .otf exist
  files.forEach(f => {
    if (f.endsWith('.ttf') || f.endsWith('.otf')) {
      const src = path.join(downloadsDir, f);
      const dest = path.join(targetDir, f);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${f} to assets/fonts/`);
    }
  });

  console.log('Final contents of assets/fonts/:', fs.readdirSync(targetDir));
} catch (err) {
  console.error('Error during font check:', err.message);
}
