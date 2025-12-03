/**
 * Mock Data for Reddit Client
 * 
 * This file contains fake data that mimics the structure of real Reddit API responses.
 * We'll use this while building the UI, then replace it with real API calls later.
 * 
 * Why use mock data first?
 * - We can build and test the UI without depending on the API
 * - We can see how the app looks with different types of content
 * - It's easier to test edge cases (long titles, missing images, etc.)
 */

// Mock posts data - simulates what we get from Reddit's API
export const mockPosts = [
  {
    id: '1',
    title: 'Amazing sunset photo I took from my backyard',
    author: 'nature_lover_42',
    subreddit: 'pics',
    score: 1234,
    numComments: 45,
    created: 1701619200, // Unix timestamp (3 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/FF6B6B/ffffff?text=Sunset',
    url: 'https://via.placeholder.com/800x600/FF6B6B/ffffff?text=Sunset+Photo',
    selftext: 'I was sitting in my backyard when I saw this incredible sunset. Had to capture it!',
    permalink: '/r/pics/comments/1/amazing_sunset_photo',
  },
  {
    id: '2',
    title: 'TIL that honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible',
    author: 'history_buff_88',
    subreddit: 'todayilearned',
    score: 856,
    numComments: 23,
    created: 1701601200, // Unix timestamp (5 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/FFD93D/ffffff?text=TIL',
    url: 'https://en.wikipedia.org/wiki/Honey',
    selftext: '',
    permalink: '/r/todayilearned/comments/2/til_honey_never_spoils',
  },
  {
    id: '3',
    title: 'Epic gaming moment - clutch 1v5 victory!',
    author: 'pro_gamer_2024',
    subreddit: 'gaming',
    score: 234,
    numComments: 67,
    created: 1701615600, // Unix timestamp (1 hour ago)
    thumbnail: 'https://via.placeholder.com/140x140/6BCF7F/ffffff?text=Gaming',
    url: 'https://via.placeholder.com/800x450/6BCF7F/ffffff?text=Gaming+Video',
    selftext: 'This was the most intense match I\'ve ever played. My hands were shaking!',
    permalink: '/r/gaming/comments/3/epic_gaming_moment',
    isVideo: true,
  },
  {
    id: '4',
    title: 'My dog learned how to open doors. Now nowhere is safe.',
    author: 'dog_owner_99',
    subreddit: 'funny',
    score: 2891,
    numComments: 143,
    created: 1701608400, // Unix timestamp (2 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/A8E6CF/ffffff?text=Dog',
    url: 'https://via.placeholder.com/800x600/A8E6CF/ffffff?text=Clever+Dog',
    selftext: 'I thought I was safe in the bathroom. I was wrong.',
    permalink: '/r/funny/comments/4/dog_opens_doors',
  },
  {
    id: '5',
    title: 'Scientists discover new species of deep-sea fish',
    author: 'marine_biologist',
    subreddit: 'science',
    score: 445,
    numComments: 34,
    created: 1701594000, // Unix timestamp (7 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/4A90E2/ffffff?text=Science',
    url: 'https://via.placeholder.com/800x600/4A90E2/ffffff?text=Deep+Sea+Fish',
    selftext: 'This fascinating discovery was made at depths of over 8000 meters.',
    permalink: '/r/science/comments/5/new_deep_sea_fish',
  },
  {
    id: '6',
    title: 'I built a mechanical keyboard from scratch',
    author: 'keyboard_enthusiast',
    subreddit: 'MechanicalKeyboards',
    score: 678,
    numComments: 89,
    created: 1701597600, // Unix timestamp (6 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/9B59B6/ffffff?text=Keyboard',
    url: 'https://via.placeholder.com/800x600/9B59B6/ffffff?text=Custom+Keyboard',
    selftext: 'Took me 3 months to complete this project. Custom everything!',
    permalink: '/r/MechanicalKeyboards/comments/6/built_keyboard_from_scratch',
  },
  {
    id: '7',
    title: 'The most beautiful hiking trail in Colorado',
    author: 'mountain_hiker',
    subreddit: 'EarthPorn',
    score: 1567,
    numComments: 52,
    created: 1701583200, // Unix timestamp (10 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/27AE60/ffffff?text=Nature',
    url: 'https://via.placeholder.com/800x600/27AE60/ffffff?text=Colorado+Trail',
    selftext: '',
    permalink: '/r/EarthPorn/comments/7/beautiful_hiking_trail',
  },
  {
    id: '8',
    title: 'My first attempt at making sourdough bread',
    author: 'amateur_baker',
    subreddit: 'Breadit',
    score: 892,
    numComments: 71,
    created: 1701590400, // Unix timestamp (8 hours ago)
    thumbnail: 'https://via.placeholder.com/140x140/F39C12/ffffff?text=Bread',
    url: 'https://via.placeholder.com/800x600/F39C12/ffffff?text=Sourdough',
    selftext: 'It\'s not perfect but I\'m proud of it!',
    permalink: '/r/Breadit/comments/8/first_sourdough_attempt',
  },
];

// Mock comments data - simulates Reddit's nested comment structure
export const mockComments = {
  '1': [
    {
      id: 'c1',
      author: 'photo_critic_pro',
      body: 'Wow! Great shot! What camera and settings did you use?',
      score: 234,
      created: 1701612000,
      replies: [
        {
          id: 'c1-1',
          author: 'nature_lover_42', // Original poster
          body: 'Thanks! I used a Canon EOS R5 with a 24-70mm lens. Settings were f/8, ISO 400, 1/500s',
          score: 56,
          created: 1701613200,
          replies: [],
        },
        {
          id: 'c1-2',
          author: 'camera_geek',
          body: 'That\'s a beast of a camera! Great choice.',
          score: 12,
          created: 1701613800,
          replies: [],
        },
      ],
    },
    {
      id: 'c2',
      author: 'sunset_enthusiast',
      body: 'Beautiful colors! Where was this taken?',
      score: 89,
      created: 1701612600,
      replies: [
        {
          id: 'c2-1',
          author: 'nature_lover_42',
          body: 'This was in Northern California, near Lake Tahoe.',
          score: 23,
          created: 1701613500,
          replies: [],
        },
      ],
    },
    {
      id: 'c3',
      author: 'landscape_lover',
      body: 'This would make an amazing wallpaper! Do you have a higher resolution version?',
      score: 45,
      created: 1701614000,
      replies: [],
    },
  ],
  '2': [
    {
      id: 'c4',
      author: 'science_nerd',
      body: 'This is true! Honey has natural antimicrobial properties due to its low moisture content and acidic pH.',
      score: 156,
      created: 1701605400,
      replies: [
        {
          id: 'c4-1',
          author: 'bee_keeper',
          body: 'As a beekeeper, I can confirm this. Properly stored honey lasts indefinitely!',
          score: 78,
          created: 1701606000,
          replies: [],
        },
      ],
    },
    {
      id: 'c5',
      author: 'history_buff_99',
      body: 'The Egyptians also used honey in mummification!',
      score: 92,
      created: 1701606600,
      replies: [],
    },
  ],
  // Comments for other posts would go here...
  // We'll keep it simple for now and just have comments for the first two posts
};

/**
 * Helper function to get a single post by ID
 * This simulates fetching a specific post from the API
 */
export const getPostById = (postId) => {
  return mockPosts.find(post => post.id === postId);
};

/**
 * Helper function to get comments for a specific post
 * This simulates fetching comments from the API
 */
export const getCommentsByPostId = (postId) => {
  return mockComments[postId] || [];
};

/**
 * Helper function to format timestamps
 * Converts Unix timestamp to a human-readable "time ago" format
 */
export const getTimeAgo = (timestamp) => {
  const now = Math.floor(Date.now() / 1000); // Current time in Unix
  const difference = now - timestamp;
  
  // Convert to minutes, hours, days
  const minutes = Math.floor(difference / 60);
  const hours = Math.floor(difference / 3600);
  const days = Math.floor(difference / 86400);
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
};

/**
 * Helper function to format large numbers
 * Converts 1234 to "1.2k" for better readability
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};
