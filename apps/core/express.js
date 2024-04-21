import express from 'express';

console.log('==========>');
console.log('==========>', { express });

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// RPC endpoint
app.post('/rpc', (req, res) => {
  const { method, params } = req.body;

  // Handle different RPC methods
  switch (method) {
    case 'add':
      // eslint-disable-next-line no-case-declarations
      const result = params.reduce((sum, num) => sum + num, 0);
      res.json({ result });
      break;
    case 'subtract':
      // eslint-disable-next-line no-case-declarations
      const [a, b] = params;
      // eslint-disable-next-line no-case-declarations
      const difference = a - b;
      res.json({ result: difference });
      break;
    default:
      res.status(404).json({ error: 'Method not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`RPC server listening at http://localhost:${port}`);
});
