const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// SSE clients waiting for reload signals
const clients = new Set();

const server = http.createServer((req, res) => {
  // Live-reload SSE endpoint
  if (req.url === '/__reload') {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('data: connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // Static file serving
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  // Prevent path traversal
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }

    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';

    // Inject live-reload snippet into HTML responses
    if (ext === '.html') {
      const snippet = `<script>
        (function() {
          const es = new EventSource('/__reload');
          es.onmessage = e => { if (e.data === 'reload') location.reload(); };
          es.onerror = () => setTimeout(() => location.reload(), 1000);
        })();
      </script>`;
      data = Buffer.from(data.toString().replace('</body>', snippet + '</body>'));
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

// Watch for file changes and notify clients
fs.watch(ROOT, { recursive: true }, (event, filename) => {
  if (!filename || filename.includes('node_modules')) return;
  console.log(`  changed: ${filename}`);
  clients.forEach(res => res.write('data: reload\n\n'));
});

server.listen(PORT, () => {
  console.log(`KIK running at http://localhost:${PORT}`);
});
