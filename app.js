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
    .then(() => console.log("Connected to DB ✅"))
    .catch(err => {
      console.log("DB not ready, retrying...");
      setTimeout(connectWithRetry, 3000);
    });
};

connectWithRetry();

const server = http.createServer((req, res) => {
  res.end("App + DB Running 🚀");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});