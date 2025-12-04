/**
 * Reddit API Service
 * 
 * Handles all API calls to Reddit's public JSON endpoints.
 * No authentication required for read-only access.
 * 
 * Reddit API Endpoints:
 * - Subreddit posts: https://www.reddit.com/r/{subreddit}.json
 * - Post with comments: https://www.reddit.com/r/{subreddit}/comments/{postId}.json
 * - Search: https://www.reddit.com/r/{subreddit}/search.json?q={query}
 */

const REDDIT_BASE_URL = 'https://www.reddit.com';

/**
 * CORS Proxy for development
 * Reddit doesn't allow direct browser requests due to CORS restrictions
 * Using a CORS proxy as a workaround for development
 * 
 * Alternative: Set up your own backend server to proxy Reddit API requests
 */
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Request headers required by Reddit API
 * Reddit requires a proper User-Agent to prevent 403 errors
 */
const REDDIT_HEADERS = {
  'User-Agent': 'web:reddit-clone-app:v1.0.0 (by /u/RedditClone)',
};

/**
 * Fetch posts from a subreddit
 * 
 * @param {string} subreddit - The subreddit name (e.g., 'pics', 'all')
 * @param {string} sort - Sort type: 'hot', 'new', 'top', 'rising'
 * @param {string} timeframe - For 'top' sort: 'hour', 'day', 'week', 'month', 'year', 'all'
 * @param {string} after - Pagination token from previous response
 * @returns {Promise<Object>} Reddit API response with posts
 */
export const fetchSubredditPosts = async (
  subreddit = 'all',
  sort = 'hot',
  timeframe = 'day',
  after = null
) => {
  try {
    // Build URL based on sort type
    let url = `${REDDIT_BASE_URL}/r/${subreddit}/${sort}.json?limit=25`;
    
    // Add timeframe for 'top' sort
    if (sort === 'top') {
      url += `&t=${timeframe}`;
    }
    
    // Add pagination token if provided
    if (after) {
      url += `&after=${after}`;
    }

    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      headers: REDDIT_HEADERS,
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Reddit wraps posts in a specific structure
    return {
      posts: data.data.children.map(child => child.data),
      after: data.data.after, // Pagination token for next page
      before: data.data.before,
    };
  } catch (error) {
    console.error('Error fetching subreddit posts:', error);
    throw error;
  }
};

/**
 * Fetch a specific post with its comments
 * 
 * @param {string} subreddit - The subreddit name
 * @param {string} postId - The post ID
 * @returns {Promise<Object>} Object containing post data and comments
 */
export const fetchPostWithComments = async (subreddit, postId) => {
  try {
    const url = `${REDDIT_BASE_URL}/r/${subreddit}/comments/${postId}.json`;
    
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      headers: REDDIT_HEADERS,
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Reddit returns [postData, commentsData]
    const postData = data[0].data.children[0].data;
    const commentsData = data[1].data.children;
    
    return {
      post: postData,
      comments: parseComments(commentsData),
    };
  } catch (error) {
    console.error('Error fetching post with comments:', error);
    throw error;
  }
};

/**
 * Parse Reddit comments into a nested structure
 * 
 * @param {Array} commentsData - Raw comments from Reddit API
 * @returns {Array} Parsed comments with nested replies
 */
const parseComments = (commentsData) => {
  return commentsData
    .filter(child => child.kind === 't1') // Filter out non-comment items
    .map(child => {
      const comment = child.data;
      
      return {
        id: comment.id,
        author: comment.author,
        body: comment.body,
        body_html: comment.body_html,
        created: comment.created_utc,
        score: comment.score,
        ups: comment.ups,
        downs: comment.downs,
        edited: comment.edited,
        replies: comment.replies
          ? parseComments(comment.replies.data.children)
          : [],
      };
    });
};

/**
 * Search posts in a subreddit
 * 
 * @param {string} query - Search query
 * @param {string} subreddit - Subreddit to search in (default: 'all')
 * @param {string} sort - Sort type: 'relevance', 'hot', 'top', 'new', 'comments'
 * @param {string} timeframe - Time filter: 'hour', 'day', 'week', 'month', 'year', 'all'
 * @returns {Promise<Object>} Search results
 */
export const searchPosts = async (
  query,
  subreddit = 'all',
  sort = 'relevance',
  timeframe = 'all'
) => {
  try {
    const url = `${REDDIT_BASE_URL}/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=${sort}&t=${timeframe}&limit=25`;
    
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      headers: REDDIT_HEADERS,
    });
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      posts: data.data.children.map(child => child.data),
      after: data.data.after,
    };
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

/**
 * Normalize a Reddit post for consistent structure
 * This ensures our app always has the fields it expects
 * 
 * @param {Object} post - Raw post from Reddit API
 * @returns {Object} Normalized post
 */
export const normalizePost = (post) => {
  // Extract video information
  const videoData = {};
  
  if (post.is_video && post.media?.reddit_video) {
    // Reddit-hosted video
    videoData.videoUrl = post.media.reddit_video.fallback_url;
    videoData.videoWidth = post.media.reddit_video.width;
    videoData.videoHeight = post.media.reddit_video.height;
    videoData.videoDuration = post.media.reddit_video.duration;
  } else if (post.url) {
    // Check for external video platforms
    const url = post.url.toLowerCase();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      videoData.videoType = 'youtube';
      videoData.videoUrl = post.url;
    } else if (url.includes('vimeo.com')) {
      videoData.videoType = 'vimeo';
      videoData.videoUrl = post.url;
    } else if (url.includes('v.redd.it')) {
      videoData.videoType = 'reddit';
      videoData.videoUrl = post.url;
    }
  }
  
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    subreddit: post.subreddit,
    score: post.score,
    ups: post.ups,
    downs: post.downs,
    numComments: post.num_comments,
    created: post.created_utc,
    thumbnail: post.thumbnail !== 'self' && post.thumbnail !== 'default' ? post.thumbnail : null,
    url: post.url,
    selftext: post.selftext,
    selftext_html: post.selftext_html,
    permalink: post.permalink,
    is_video: post.is_video,
    ...videoData,
    media: post.media,
    preview: post.preview,
  };
};
