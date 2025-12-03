/**
 * Filters Slice - Redux state for user's filter selections
 * 
 * This slice manages what filters the user has selected:
 * - Which subreddit they want to see
 * - How to sort posts (hot, new, top, etc.)
 * - What they're searching for
 * - Time period filter (for "top" posts)
 * 
 * Why separate this from posts?
 * - Keeps code organized (separation of concerns)
 * - Filters can change without reloading posts
 * - Easy to reset filters
 */

import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial State - Default filter values
 */
const initialState = {
  // Which subreddit to show (default: 'all' means show everything)
  selectedSubreddit: 'all',
  
  // Sort order: 'hot' | 'new' | 'top' | 'rising'
  sortBy: 'hot',
  
  // Time filter for 'top' posts: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  timeFilter: 'day',
  
  // Search term entered by user
  searchTerm: '',
};

/**
 * Create the filters slice
 */
const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  
  /**
   * Reducers - Update filter values
   */
  reducers: {
    /**
     * setSubreddit - Change which subreddit to display
     * 
     * Example: user clicks "r/funny" in the sidebar
     */
    setSubreddit: (state, action) => {
      state.selectedSubreddit = action.payload;
    },
    
    /**
     * setSortBy - Change how posts are sorted
     * 
     * Example: user selects "New" from sort dropdown
     */
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    /**
     * setTimeFilter - Change time period for "top" posts
     * 
     * Example: user selects "This Week"
     * Only relevant when sortBy is 'top'
     */
    setTimeFilter: (state, action) => {
      state.timeFilter = action.payload;
    },
    
    /**
     * setSearchTerm - Update search term
     * 
     * Example: user types in search box
     */
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    /**
     * resetFilters - Reset all filters to defaults
     * 
     * Example: user clicks "Clear All Filters" button
     */
    resetFilters: (state) => {
      state.selectedSubreddit = 'all';
      state.sortBy = 'hot';
      state.timeFilter = 'day';
      state.searchTerm = '';
    },
  },
});

/**
 * Export actions
 */
export const {
  setSubreddit,
  setSortBy,
  setTimeFilter,
  setSearchTerm,
  resetFilters,
} = filtersSlice.actions;

/**
 * Selectors - Read filter values from state
 */

// Get selected subreddit
export const selectSubreddit = (state) => state.filters.selectedSubreddit;

// Get sort order
export const selectSortBy = (state) => state.filters.sortBy;

// Get time filter
export const selectTimeFilter = (state) => state.filters.timeFilter;

// Get search term
export const selectSearchTerm = (state) => state.filters.searchTerm;

// Get all filters at once (useful for displaying current filters)
export const selectAllFilters = (state) => ({
  subreddit: state.filters.selectedSubreddit,
  sortBy: state.filters.sortBy,
  timeFilter: state.filters.timeFilter,
  searchTerm: state.filters.searchTerm,
});

// Export the reducer
export default filtersSlice.reducer;
