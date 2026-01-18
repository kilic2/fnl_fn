import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Starting server...');
console.log('distPath:', distPath);
console.log('dist exists:', fs.existsSync(distPath));
console.log('index.html exists:', fs.existsSync(indexPath));

// Serve static files
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: false
}));

// SPA fallback - serve index.html for all routes
app.use((req, res) => {
  console.log('Serving index.html for route:', req.path);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Server error');
    }
  });
});

// Error handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
