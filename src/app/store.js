/**
 * Redux Store Configuration
 * 
 * What is Redux?
 * Redux is a state management library. Think of it as a central storage box
 * for all your app's data that any component can access.
 * 
 * Why use Redux?
 * - Without Redux: Components pass data down through props (can get messy!)
 * - With Redux: Any component can access data directly from the store
 * 
 * This file sets up our Redux store using Redux Toolkit (the modern way)
 */

import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import filtersReducer from '../features/filters/filtersSlice';

/**
 * Configure the Redux store
 * 
 * The store holds all our app's data (state) in one place:
 * - posts: All Reddit posts, loading status, errors
 * - filters: User's selected filters (subreddit, sort, search term)
 * 
 * Each "slice" is like a section of the store that manages specific data
 */
export const store = configureStore({
  reducer: {
    // postsReducer manages everything related to posts
    posts: postsReducer,
    
    // filtersReducer manages user's filter selections
    filters: filtersReducer,
  },
});

// Export types for TypeScript users (we're using JavaScript, but it's good practice)
// These help VS Code give us better autocomplete suggestions
export default store;
