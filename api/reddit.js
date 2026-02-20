// Vercel API route to proxy Reddit requests

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const redditRes = await fetch(url, {
      headers: {
        // Use a unique and descriptive User-Agent as recommended by Reddit API guidelines
        'User-Agent': 'web:reddify.vercel.app:v1.0.0 (by /u/Ollieadams23)',
      },
    });
    const contentType = redditRes.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await redditRes.json();
    } else {
      data = await redditRes.text();
    }
    if (!redditRes.ok) {
      // Log error details for debugging
      console.error('Reddit API error:', redditRes.status, data);
      return res.status(redditRes.status).json({ error: 'Reddit API error', status: redditRes.status, data });
    }
    res.status(redditRes.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
