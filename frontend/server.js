const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

app.get('/api-config.js', (req, res) => {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.BACKEND_URL = '${backendUrl}/api';`);
});

app.use(express.static(path.join(__dirname)));
app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});