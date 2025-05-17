// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


client.connect();

// GET /articles エンドポイント
app.get('/articles', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM articles ORDER BY published_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('RSSバックエンドAPIです。/articles にアクセスしてください。');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/articles`);
});
