const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { join } = require('path');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Handle static files
      if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        pathname.includes('.') ||
        pathname.startsWith('/public/') ||
        pathname.startsWith('/images/')
      ) {
        const path = join(__dirname, pathname);
        if (fs.existsSync(path)) {
          const stat = fs.statSync(path);
          if (stat.isFile()) {
            app.serveStatic(req, res, path);
            return;
          }
        }
      }

      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
}); 