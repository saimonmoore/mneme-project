import * as http from 'http';

import { UrlAnalyzer } from './index.js';

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log("[ai > server] =============> ", { url: req.url, method: req.method });

  if (req.method === 'OPTIONS') {
    console.log("[ai > server] =============> OPTIONS request: Setting CORS headers...");

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours

    // End the preflight request with a 204 No Content response
    res.writeHead(204);
    res.end();

    return;
  }

  if (req.url === '/ai/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else if (req.url === '/ai/analyze' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString(); 
    });

    req.on('end', async () => {
      let inputData;

      try {
        inputData = JSON.parse(body);
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON input' }));
      }

      try {
        const urlAnalyzer = new UrlAnalyzer(inputData.url);
        const ai = await urlAnalyzer.analyze()

        res.writeHead(200);
        res.end(JSON.stringify({ result: ai }));
      } catch (err: unknown) {
        res.writeHead(500);
        res.end(
          JSON.stringify({
            error: 'AI computation failed',
            details: (err as Error).message,
          }),
        );
      }
    });
  } else {
    // Handle 404 Not Found
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Define the host and port to listen on
const PORT = Number(process.argv[2]) || 3000;
const HOST = process.argv[3] || '0.0.0.0';

// @ts-ignore
server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
