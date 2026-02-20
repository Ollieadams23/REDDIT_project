// Vercel API route to proxy Reddit requests

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const redditRes = await fetch(url, {
      headers: {
        'User-Agent': 'web:reddit-clone-app:v1.0.0 (by /u/RedditClone)',
      },
    });
    const data = await redditRes.json();
    res.status(redditRes.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
