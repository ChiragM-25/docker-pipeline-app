const http = require('http');
const { Client } = require('pg');

const client = new Client({
  host: 'db',
  user: 'postgres',
  password: 'pass123',
  database: 'postgres'
});

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
    })
    .catch(err => {
      console.log("DB not ready, retrying...");
      setTimeout(connectWithRetry, 3000);
    });
};

connectWithRetry();

const server = http.createServer(async (req, res) => {
  try {
    // Insert visit
    await client.query("INSERT INTO visits DEFAULT VALUES");

    // Get count
    const result = await client.query("SELECT COUNT(*) FROM visits");

    res.end(`Visits: ${result.rows[0].count} 🚀`);
  } catch (err) {
    res.end("DB error ❌");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});