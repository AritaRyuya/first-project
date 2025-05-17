import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/articles')
      .then(response => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('記事の取得に失敗しました');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>記事一覧</h2>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <a href={article.link} target="_blank" rel="noopener noreferrer">{article.title}</a><br />
            <small>{new Date(article.published_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticlesList;
