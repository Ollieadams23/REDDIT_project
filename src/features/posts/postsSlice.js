/**
 * Posts Slice - Redux state management for Reddit posts
 * 
 * What is a "slice"?
 * A slice is a collection of Redux logic for a specific feature.
 * This slice manages everything related to posts:
 * - The list of posts
 * - Loading states (is data being fetched?)
 * - Error states (did something go wrong?)
 * - Actions to update the data
 * 
 * Now integrated with real Reddit API!
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSubredditPosts, fetchPostWithComments, searchPosts as searchRedditPosts, normalizePost } from '../../services/redditAPI';

/**
 * Async Thunk: Fetch posts from Reddit API
 * 
 * createAsyncThunk automatically handles:
 * - Dispatching 'pending' action when the request starts
 * - Dispatching 'fulfilled' action when it succeeds
 * - Dispatching 'rejected' action when it fails
 */
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ subreddit = 'all', sort = 'hot', timeframe = 'day' }) => {
    const { posts, after } = await fetchSubredditPosts(subreddit, sort, timeframe);
    return { posts: posts.map(normalizePost), after };
  }
);

/**
 * Async Thunk: Load more posts (pagination)
 */
export const loadMorePosts = createAsyncThunk(
  'posts/loadMorePosts',
  async ({ subreddit = 'all', sort = 'hot', timeframe = 'day', after }) => {
    const { posts, after: nextAfter } = await fetchSubredditPosts(subreddit, sort, timeframe, after);
    return { posts: posts.map(normalizePost), after: nextAfter };
  }
);

/**
 * Async Thunk: Fetch a specific post with comments
 */
export const fetchPostDetails = createAsyncThunk(
  'posts/fetchPostDetails',
  async ({ subreddit, postId }) => {
    const { post, comments } = await fetchPostWithComments(subreddit, postId);
    return { post: normalizePost(post), comments };
  }
);

/**
 * Async Thunk: Search posts
 */
export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async ({ query, subreddit = 'all', sort = 'relevance', timeframe = 'all' }) => {
    const { posts, after } = await searchRedditPosts(query, subreddit, sort, timeframe);
    return { posts: posts.map(normalizePost), after };
  }
);

/**
 * Async Thunk: Load more search results
 */
export const loadMoreSearchResults = createAsyncThunk(
  'posts/loadMoreSearchResults',
  async ({ query, subreddit = 'all', sort = 'relevance', timeframe = 'all', after }) => {
    const { posts, after: nextAfter } = await searchRedditPosts(
      query, 
      subreddit, 
      sort, 
      timeframe, 
      after
    );
    return { posts: posts.map(normalizePost), after: nextAfter };
  }
);

/**
 * Initial State
 * 
 * This is what our posts data looks like when the app first loads
 */
const initialState = {
  // Array of all posts
  posts: [],
  
  // Currently selected post (when viewing details)
  selectedPost: null,
  
  // Comments for the selected post
  comments: [],
  
  // Pagination token for loading more posts
  after: null,
  
  // Flag to track if we're loading more posts (vs initial load)
  isLoadingMore: false,
  
  // Loading state: 'idle' | 'loading' | 'succeeded' | 'failed'
  // This helps us show loading spinners or error messages
  status: 'idle',
  
  // Error message if something goes wrong
  error: null,
};

/**
 * Create the posts slice
 * 
 * This creates:
 * 1. Actions (things we can do, like "load posts")
 * 2. Reducer (how the state changes when actions happen)
 */
const postsSlice = createSlice({
  // Name of this slice (used in Redux DevTools)
  name: 'posts',
  
  // Starting state
  initialState,
  
  /**
   * Reducers - synchronous state updates
   */
  reducers: {
    /**
     * clearSelectedPost - Clear the selected post
     * 
     * Call this when user goes back to the feed
     */
    clearSelectedPost: (state) => {
      state.selectedPost = null;
      state.comments = [];
    },
  },
  
  /**
   * Extra Reducers - handle async thunk actions
   * 
   * These automatically handle the lifecycle of async operations:
   * - pending: when the API call starts
   * - fulfilled: when it succeeds
   * - rejected: when it fails
   */
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isLoadingMore = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.posts;
        state.after = action.payload.after;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Load more posts (pagination)
      .addCase(loadMorePosts.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMorePosts.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.posts = [...state.posts, ...action.payload.posts];
        state.after = action.payload.after;
        state.error = null;
      })
      .addCase(loadMorePosts.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.error.message;
      })
      
      // Fetch post details
      .addCase(fetchPostDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedPost = action.payload.post;
        state.comments = action.payload.comments;
        state.error = null;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Search posts
      .addCase(searchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.isLoadingMore = false;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.posts;
        state.after = action.payload.after;
        state.error = null;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Load more search results (pagination)
      .addCase(loadMoreSearchResults.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreSearchResults.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.posts = [...state.posts, ...action.payload.posts];
        state.after = action.payload.after;
        state.error = null;
      })
      .addCase(loadMoreSearchResults.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.error.message;
      });
  },
});

/**
 * Export actions
 * 
 * These are the functions components will call to update the state
 */
export const {
  clearSelectedPost,
} = postsSlice.actions;

/**
 * Selectors - Functions to read data from the state
 * 
 * These make it easy to get data from Redux in our components
 * Example: const posts = useSelector(selectAllPosts)
 */

// Get all posts
export const selectAllPosts = (state) => state.posts.posts;

// Get selected post (renamed to avoid conflict with selectPost action)
export const selectSelectedPost = (state) => state.posts.selectedPost;

// Get loading status
export const selectPostsStatus = (state) => state.posts.status;

// Get error message
export const selectPostsError = (state) => state.posts.error;

// Check if posts are loading
export const selectIsLoading = (state) => state.posts.status === 'loading';

// Check if loading more posts
export const selectIsLoadingMore = (state) => state.posts.isLoadingMore;

// Get pagination token
export const selectAfter = (state) => state.posts.after;

// Check if there are more posts to load
export const selectHasMore = (state) => state.posts.after !== null;

// Get comments for selected post
export const selectComments = (state) => state.posts.comments;

// Export the reducer (this goes into the store)
export default postsSlice.reducer;
