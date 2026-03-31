const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3001;
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

app.use('/api', createProxyMiddleware({
  target: backendUrl,
  changeOrigin: true
}));

app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
