import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

console.log('Starting server...');
console.log('__dirname:', __dirname);
console.log('distPath:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
console.log('index.html exists:', fs.existsSync(path.join(distPath, 'index.html')));

if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist folder does not exist!');
  process.exit(1);
}

if (!fs.existsSync(path.join(distPath, 'index.html'))) {
  console.error('ERROR: index.html not found in dist!');
  console.log('Contents of dist:', fs.readdirSync(distPath));
  process.exit(1);
}

// Serve static files
app.use(express.static(distPath));

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  console.log('Serving index.html for route:', req.path);
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server error');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
