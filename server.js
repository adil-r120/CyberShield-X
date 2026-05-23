const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app dist directory
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`-----------------------------------------------`);
  console.log(`🛡️  CyberShield X Node.js Server is Live!`);
  console.log(`🚀 Serving frontend at: http://localhost:${PORT}`);
  console.log(`-----------------------------------------------`);
});
