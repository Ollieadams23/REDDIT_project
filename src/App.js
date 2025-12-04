/**
 * Main App Component
 * 
 * This component integrates:
 * - SearchBar for searching posts
 * - Sidebar for filtering by subreddit, sort order, and time
 * - PostCard list displaying filtered results
 * - PostDetail view for individual posts with comments
 * - Redux state management for filters
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import PostCard from './components/PostCard';
import PostDetail from './components/PostDetail';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';
import { fetchPosts, loadMorePosts, searchPosts as searchPostsThunk } from './features/posts/postsSlice';
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
   * Local state to track which view we're showing
   * null = feed view
   * postId = detail view for that post
   */
  const [selectedPostId, setSelectedPostId] = useState(null);

  /**
   * Select data from Redux store
   */
  const posts = useSelector((state) => state.posts.posts);
  const isLoading = useSelector((state) => state.posts.status === 'loading');
  const isLoadingMore = useSelector((state) => state.posts.isLoadingMore);
  const hasMore = useSelector((state) => state.posts.after !== null);
  const after = useSelector((state) => state.posts.after);
  const error = useSelector((state) => state.posts.error);
  
  // Get filter values from Redux
  const selectedSubreddit = useSelector(selectSubreddit);
  const sortBy = useSelector(selectSortBy);
  const timeFilter = useSelector(selectTimeFilter);
  const searchTerm = useSelector(selectSearchTerm);

  /**
   * Load posts when component mounts or filters change
   * Now using real Reddit API!
   */
  useEffect(() => {
    // If there's a search term, use search API
    if (searchTerm && searchTerm.trim()) {
      dispatch(searchPostsThunk({ 
        query: searchTerm, 
        subreddit: selectedSubreddit,
        sort: sortBy,
        timeframe: timeFilter 
      }));
    } else {
      // Otherwise fetch posts normally
      dispatch(fetchPosts({ 
        subreddit: selectedSubreddit, 
        sort: sortBy, 
        timeframe: timeFilter 
      }));
    }
  }, [dispatch, selectedSubreddit, sortBy, timeFilter, searchTerm]);

  /**
   * Note: With the Reddit API, we no longer need client-side filtering!
   * The API handles:
   * - Sorting (hot/new/top/rising)
   * - Time filtering (hour/day/week/month/year/all)
   * - Subreddit filtering
   * - Search
   * 
   * We just display the posts as they come from the API
   */
  const sortedPosts = posts;

  /**
   * Handle when search term changes
   * The useEffect will automatically fetch new data when searchTerm changes
   */
  const handleSearchChange = (term) => {
    dispatch(setSearchTerm(term));
  };

  /**
   * Handle when subreddit filter changes
   * The useEffect will automatically fetch new data when subreddit changes
   */
  const handleSubredditChange = (subreddit) => {
    dispatch(setSubreddit(subreddit));
  };

  /**
   * Handle when sort order changes
   * 
   * Updates Redux state which triggers re-sorting
   */
  const handleSortChange = (sort) => {
    dispatch(setSortBy(sort));
  };

  /**
   * Handle when time filter changes
   * 
   * Updates Redux state which triggers re-filtering
   * Only applies when sortBy is 'top'
   */
  const handleTimeFilterChange = (time) => {
    dispatch(setTimeFilter(time));
  };

  /**
   * Handle reset filters button
   */
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  /**
   * Handle when a post card is clicked
   * Shows the post detail view
   */
  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    // Scroll to top when opening post detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle going back to feed from post detail
   */
  const handleBackToFeed = () => {
    setSelectedPostId(null);
  };

  /**
   * Handle loading more posts
   */
  const handleLoadMore = () => {
    if (searchTerm && searchTerm.trim()) {
      // For search, we'd need to implement search pagination
      // Reddit search API also supports 'after' parameter
      console.log('Search pagination not yet implemented');
    } else {
      dispatch(loadMorePosts({ 
        subreddit: selectedSubreddit, 
        sort: sortBy, 
        timeframe: timeFilter,
        after: after
      }));
    }
  };

  /**
   * Conditional rendering:
   * - If selectedPostId is set, show PostDetail
   * - Otherwise, show the feed with sidebar and filters
   */
  if (selectedPostId) {
    return (
      <div className="App">
        {/* Header */}
        <header className="App-header">
          <h1>🔴 Reddit Client</h1>
          <p>A React & Redux app for browsing Reddit</p>
        </header>

        {/* Post Detail View */}
        <main className="App-main">
          <div className="App-container App-container--detail">
            <PostDetail 
              postId={selectedPostId}
              onBack={handleBackToFeed}
            />
          </div>
        </main>
      </div>
    );
  }

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
                ? `Search results for "${searchTerm}" (${sortedPosts.length})`
                : selectedSubreddit !== 'all'
                  ? `r/${selectedSubreddit} (${sortedPosts.length})`
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
            ) : sortedPosts.length > 0 ? (
              // Display filtered and sorted posts
              <div className="App-posts">
                {sortedPosts.map((post) => (
                  <PostCard 
                    key={post.id}
                    post={post}
                    onClick={handlePostClick}
                  />
                ))}
                
                {/* Load More button */}
                {hasMore && !isLoading && (
                  <div className="App-load-more">
                    <button 
                      className="App-load-more-btn"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Posts'}
                    </button>
                  </div>
                )}
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
