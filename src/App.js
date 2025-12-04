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
   * Step 1: Filter posts based on search and subreddit
   * This reduces the list before sorting
   */
  let filteredPosts = posts.filter((post) => {
    // Filter by search term (checks both title and body)
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
    
    return true;
  });

  /**
   * Step 2: Apply time filter (only for 'top' sort)
   * 
   * When user selects "Top", they can choose a time period.
   * We filter out posts older than the selected period.
   */
  if (sortBy === 'top' && timeFilter !== 'all') {
    const now = Date.now() / 1000; // Current time in seconds
    let timeThreshold = 0;
    
    // Calculate how far back to look based on selected time filter
    switch (timeFilter) {
      case 'hour':
        timeThreshold = now - (60 * 60); // 1 hour ago
        break;
      case 'day':
        timeThreshold = now - (24 * 60 * 60); // 24 hours ago
        break;
      case 'week':
        timeThreshold = now - (7 * 24 * 60 * 60); // 7 days ago
        break;
      case 'month':
        timeThreshold = now - (30 * 24 * 60 * 60); // 30 days ago
        break;
      case 'year':
        timeThreshold = now - (365 * 24 * 60 * 60); // 365 days ago
        break;
      default:
        timeThreshold = 0; // 'all' - no filtering
    }
    
    // Keep only posts created after the threshold time
    if (timeThreshold > 0) {
      filteredPosts = filteredPosts.filter((post) => post.created > timeThreshold);
    }
  }

  /**
   * Step 3: Sort the filtered posts based on selected sort order
   * 
   * Different sort algorithms:
   * - 'hot': Combination of upvotes and recency (most engaging recent posts)
   * - 'new': Most recent posts first
   * - 'top': Highest upvotes (within time period if specified)
   * - 'rising': Posts gaining upvotes quickly
   */
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'new':
        // Sort by creation time, newest first
        // post.created is a Unix timestamp (seconds since 1970)
        return b.created - a.created;
      
      case 'top':
        // Sort by total upvotes, highest first
        // post.ups is the upvote count
        return b.ups - a.ups;
      
      case 'rising':
        /**
         * Rising algorithm: Recent posts with growing engagement
         * 
         * Formula: (upvotes / age_in_hours) * recency_bonus
         * - Posts with more upvotes score higher
         * - Newer posts get a bonus multiplier
         * - Very new posts (< 1 hour) get extra boost
         */
        const now = Date.now() / 1000;
        
        // Calculate score for post A
        const ageA = Math.max(1, (now - a.created) / 3600); // Age in hours (minimum 1)
        const recencyBonusA = ageA < 1 ? 2 : 1; // Double score if less than 1 hour old
        const scoreA = (a.ups / ageA) * recencyBonusA;
        
        // Calculate score for post B
        const ageB = Math.max(1, (now - b.created) / 3600);
        const recencyBonusB = ageB < 1 ? 2 : 1;
        const scoreB = (b.ups / ageB) * recencyBonusB;
        
        return scoreB - scoreA; // Higher score first
      
      case 'hot':
      default:
        /**
         * Hot algorithm: Balance between popularity and recency
         * 
         * This is simplified from Reddit's actual algorithm but captures the idea:
         * - Popular posts (high upvotes) rank higher
         * - Recent posts get a boost
         * - Uses logarithmic scale so mega-popular posts don't dominate forever
         */
        const nowHot = Date.now() / 1000;
        
        // Calculate "hotness" score for post A
        const ageInHoursA = Math.max(1, (nowHot - a.created) / 3600);
        const voteScoreA = Math.log10(Math.max(1, a.ups)); // Logarithmic scale
        const hotScoreA = voteScoreA / Math.pow(ageInHoursA, 1.5); // Age penalty
        
        // Calculate "hotness" score for post B
        const ageInHoursB = Math.max(1, (nowHot - b.created) / 3600);
        const voteScoreB = Math.log10(Math.max(1, b.ups));
        const hotScoreB = voteScoreB / Math.pow(ageInHoursB, 1.5);
        
        return hotScoreB - hotScoreA; // Higher score first
    }
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
