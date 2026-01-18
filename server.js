import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Try different possible dist paths
const possiblePaths = [
  path.join(__dirname, 'dist'),
  path.join(process.cwd(), 'dist'),
  '/app/dist'  // Common Coolify path
];

let distPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log(`✓ Found dist folder at: ${distPath}`);
    break;
  }
}

if (!distPath) {
  console.error('✗ dist folder not found at any of these locations:');
  possiblePaths.forEach(p => console.error(`  - ${p}`));
  console.error('Current working directory:', process.cwd());
  process.exit(1);
}

// Verify index.html exists
if (!fs.existsSync(path.join(distPath, 'index.html'))) {
  console.error('✗ index.html not found in dist folder');
  process.exit(1);
}
console.log('✓ index.html found in dist folder');

// Serve static files
app.use(express.static(distPath));

// SPA fallback
app.use((req, res) => {
  console.log(`Serving index.html for route: ${req.path}`);
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server error');
});

app.listen(PORT, () => {
  console.log(`✓ Server listening on port ${PORT}`);
});
