require('dotenv').config();
const Parser = require('rss-parser');
const { Client } = require('pg');

const parser = new Parser();

async function fetchAndSaveRSS(rssUrl) {
  const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });

  try {
    await client.connect();

    const feed = await parser.parseURL(rssUrl);

    for (const item of feed.items) {
      const id = item.guid || item.link;
      const source_id = rssUrl;
      const title = item.title;
      const link = item.link;
      const summary = item.contentSnippet || '';
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      const created_at = new Date();
      const is_read = false;

      await client.query(
        `INSERT INTO articles (id, source_id, title, link, summary, published_at, created_at, is_read)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [id, source_id, title, link, summary, pubDate, created_at, is_read]
      );
      console.log(`Saved: ${title}`);
    }
  } catch (err) {
    console.error('Error fetching or saving RSS:', err);
  } finally {
    await client.end();
  }
}

// 使いたいRSSのURLに差し替えてね
fetchAndSaveRSS('https://developers.googleblog.com/atom.xml');
