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
 * Think of it like a recipe book just for posts!
 */

import { createSlice } from '@reduxjs/toolkit';
import { mockPosts } from '../../data/mockData';

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
   * Reducers - functions that change the state
   * 
   * Each reducer is like a command:
   * - "Load these posts"
   * - "Select this post"
   * - "Handle this error"
   */
  reducers: {
    /**
     * loadPosts - Load the initial list of posts
     * 
     * For now, we're using mock data from mockData.js
     * Later, we'll replace this with real API calls
     */
    loadPosts: (state) => {
      // Set status to loading
      state.status = 'loading';
      
      // Simulate loading delay (remove this later with real API)
      // In real app, this happens automatically during the API call
    },
    
    /**
     * loadPostsSuccess - Called when posts load successfully
     */
    loadPostsSuccess: (state, action) => {
      state.status = 'succeeded';
      // action.payload contains the posts data
      state.posts = action.payload;
      state.error = null;
    },
    
    /**
     * loadPostsFailed - Called when loading posts fails
     */
    loadPostsFailed: (state, action) => {
      state.status = 'failed';
      // action.payload contains the error message
      state.error = action.payload;
    },
    
    /**
     * selectPost - Select a post to view its details
     * 
     * When user clicks on a post card, we save it here
     * so the PostDetail page can display it
     */
    selectPost: (state, action) => {
      // action.payload is the post ID
      const postId = action.payload;
      // Find the post in our posts array
      state.selectedPost = state.posts.find(post => post.id === postId);
    },
    
    /**
     * clearSelectedPost - Clear the selected post
     * 
     * Call this when user goes back to the feed
     */
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    
    /**
     * searchPosts - Filter posts by search term
     * 
     * This is a simple client-side search
     * Later, we'll use Reddit's search API instead
     */
    searchPosts: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      
      if (!searchTerm) {
        // If search is empty, show all posts
        state.posts = mockPosts;
      } else {
        // Filter posts that match the search term
        state.posts = mockPosts.filter(post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.selftext.toLowerCase().includes(searchTerm)
        );
      }
    },
    
    /**
     * filterBySubreddit - Show only posts from a specific subreddit
     */
    filterBySubreddit: (state, action) => {
      const subreddit = action.payload;
      
      if (subreddit === 'all') {
        // Show all posts
        state.posts = mockPosts;
      } else {
        // Filter by subreddit
        state.posts = mockPosts.filter(
          post => post.subreddit.toLowerCase() === subreddit.toLowerCase()
        );
      }
    },
  },
});

/**
 * Export actions
 * 
 * These are the functions components will call to update the state
 * Example: dispatch(loadPosts())
 */
export const {
  loadPosts,
  loadPostsSuccess,
  loadPostsFailed,
  selectPost,
  clearSelectedPost,
  searchPosts,
  filterBySubreddit,
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

/**
 * Thunk to load posts with mock data
 * 
 * A "thunk" is a function that does async work (like API calls)
 * For now, we're just using setTimeout to simulate loading
 */
export const fetchPosts = () => (dispatch) => {
  // Tell Redux we're starting to load
  dispatch(loadPosts());
  
  // Simulate API delay (500ms)
  setTimeout(() => {
    // After "loading", dispatch success with mock data
    dispatch(loadPostsSuccess(mockPosts));
  }, 500);
};

// Export the reducer (this goes into the store)
export default postsSlice.reducer;
