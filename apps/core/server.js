import http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // Enable CORS for all origins (adjust for production as needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle pre-flight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; 
    res.end();
    return;
  }

  // Route definitions (example)
  if (req.method === 'POST' && req.url === '/calculate') {
    let body = '';
    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      try {
        console.log('Raw Request Body:', body);

        let data = JSON.parse(body);
        let result = data.num1 + data.num2;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ result }));
      } catch (err) {
        console.error(err);
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.end('Error processing request');
      }
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
