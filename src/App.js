/**
 * Main App Component
 * 
 * This component integrates:
 * - SearchBar for searching posts
 * - Sidebar for filtering by subreddit, sort order, and time
 * - PostCard list displaying filtered results
 * - Redux state management for filters
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import PostCard from './components/PostCard';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import { fetchPosts, searchPosts, filterBySubreddit } from './features/posts/postsSlice';
import { 
  setSubreddit, 
  setSortBy, 
  setTimeFilter, 
  setSearchTerm,
  resetFilters,
  selectSubreddit,
  selectSortBy,
  selectTimeFilter,
  selectSearchTerm
} from './features/filters/filtersSlice';

function App() {
  /**
   * Redux dispatch function for triggering actions
   */
  const dispatch = useDispatch();

  /**
   * Select data from Redux store
   */
  const posts = useSelector((state) => state.posts.posts);
  const isLoading = useSelector((state) => state.posts.status === 'loading');
  const error = useSelector((state) => state.posts.error);
  
  // Get filter values from Redux
  const selectedSubreddit = useSelector(selectSubreddit);
  const sortBy = useSelector(selectSortBy);
  const timeFilter = useSelector(selectTimeFilter);
  const searchTerm = useSelector(selectSearchTerm);

  /**
   * Load posts when component mounts
   */
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  /**
   * Filter posts based on all criteria:
   * - Search term (title or body)
   * - Subreddit selection
   * - Sort order
   * - Time filter (when sort is 'top')
   */
  const filteredPosts = posts.filter((post) => {
    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(lowerSearch);
      const textMatch = post.selftext.toLowerCase().includes(lowerSearch);
      if (!titleMatch && !textMatch) return false;
    }
    
    // Filter by subreddit
    if (selectedSubreddit !== 'all') {
      if (post.subreddit.toLowerCase() !== selectedSubreddit.toLowerCase()) {
        return false;
      }
    }
    
    // TODO: Apply sort order (hot, new, top, rising)
    // TODO: Apply time filter (when sortBy is 'top')
    
    return true;
  });

  /**
   * Handle when search term changes
   */
  const handleSearchChange = (term) => {
    dispatch(setSearchTerm(term));
    dispatch(searchPosts(term));
  };

  /**
   * Handle when subreddit filter changes
   */
  const handleSubredditChange = (subreddit) => {
    dispatch(setSubreddit(subreddit));
    dispatch(filterBySubreddit(subreddit));
  };

  /**
   * Handle when sort order changes
   */
  const handleSortChange = (sort) => {
    dispatch(setSortBy(sort));
    // TODO: Apply sorting logic
  };

  /**
   * Handle when time filter changes
   */
  const handleTimeFilterChange = (time) => {
    dispatch(setTimeFilter(time));
    // TODO: Apply time filtering logic
  };

  /**
   * Handle reset filters button
   */
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  /**
   * Handle when a post card is clicked
   * For now, just log it to console
   * Later, we'll navigate to the post detail page
   */
  const handlePostClick = (postId) => {
    console.log('Post clicked:', postId);
    // TODO: Navigate to post detail view
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="App-header">
        <h1>🔴 Reddit Client</h1>
        <p>A React & Redux app for browsing Reddit</p>
      </header>

      {/* Main content */}
      <main className="App-main">
        <div className="App-container">
          {/* Sidebar with filters */}
          <Sidebar
            selectedSubreddit={selectedSubreddit}
            sortBy={sortBy}
            timeFilter={timeFilter}
            onSubredditChange={handleSubredditChange}
            onSortChange={handleSortChange}
            onTimeFilterChange={handleTimeFilterChange}
            onReset={handleResetFilters}
          />

          {/* Main content area */}
          <div className="App-content">
            {/* Search bar */}
            <SearchBar 
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search posts..."
            />

            {/* Results header */}
            <h2>
              {searchTerm 
                ? `Search results for "${searchTerm}" (${filteredPosts.length})`
                : selectedSubreddit !== 'all'
                  ? `r/${selectedSubreddit} (${filteredPosts.length})`
                  : 'Latest Posts'
              }
            </h2>
            
            {/* Loading state */}
            {isLoading ? (
              <div className="App-loading">
                <p>Loading posts...</p>
              </div>
            ) : error ? (
              // Error state
              <div className="App-error">
                <p>❌ {error}</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              // Display filtered posts
              <div className="App-posts">
                {filteredPosts.map((post) => (
                  <PostCard 
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                  />
                ))}
              </div>
            ) : (
              // Empty state when no results found
              <div className="App-empty-state">
                <p>🔍 No posts found</p>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
