const http = require('http');
const { Client } = require('pg');

// DB config
const client = new Client({
  host: 'db',
  user: 'postgres',
  password: 'pass123',
  database: 'postgres'
});

// Retry connection until DB is ready
const connectWithRetry = () => {
  client.connect()
    .then(async () => {
      console.log("Connected to DB ✅");

      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS visits (
          id SERIAL PRIMARY KEY,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("Table ready ✅");
    })
    .catch(err => {
      console.log("DB not ready, retrying...");
      setTimeout(connectWithRetry, 3000);
    });
};

connectWithRetry();

// HTTP Server
const server = http.createServer(async (req, res) => {

  console.log("Request received:", req.url);

  // Ignore favicon and other routes
  if (req.url !== '/') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  try {
    // Insert visit
    await client.query("INSERT INTO visits DEFAULT VALUES");

    // Get visit count
    const result = await client.query("SELECT COUNT(*) FROM visits");

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Visits: ${result.rows[0].count} 🚀`);

  } catch (err) {
    console.error("DB error:", err);
    res.writeHead(500);
    res.end("DB error ❌");
  }
});

// Start server
server.listen(3000, () => {
  console.log("Server running on port 3000");
});