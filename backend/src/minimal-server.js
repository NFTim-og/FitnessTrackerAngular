const express = require('express');
const app = express();
const PORT = 3002;

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'Hello World!' });
});

// Health route
app.get('/health', (req, res) => {
  console.log('Health route hit');
  res.json({ status: 'success', message: 'API is running' });
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ status: 'success', message: 'Test endpoint is working' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 handler hit:', req.method, req.url);
  res.status(404).json({
    status: 'error',
    message: `Route ${req.url} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
});
