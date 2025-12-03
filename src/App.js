/**
 * Main App Component
 * 
 * For now, this is a simple demo to show our PostCard component working.
 * Later, we'll add:
 * - React Router for navigation
 * - Full feed view with all posts
 * - Search and filter functionality
 * - Post detail view
 */

import React, { useState } from 'react';
import './App.css';
import PostCard from './components/PostCard';
import SearchBar from './components/SearchBar';
import { mockPosts } from './data/mockData';

function App() {
  /**
   * State for search term
   * This is controlled by the SearchBar component
   */
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Filter posts based on search term
   * 
   * Search looks in both title and selftext (post body)
   * Case-insensitive search
   */
  const filteredPosts = mockPosts.filter((post) => {
    if (!searchTerm) {
      // If no search term, show all posts
      return true;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(lowerSearch);
    const textMatch = post.selftext.toLowerCase().includes(lowerSearch);
    
    return titleMatch || textMatch;
  });

  /**
   * Handle when search term changes
   */
  const handleSearchChange = (term) => {
    setSearchTerm(term);
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
              : 'Latest Posts'
            }
          </h2>
          
          {/* Display filtered posts */}
          {filteredPosts.length > 0 ? (
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
              <p>🔍 No posts found matching "{searchTerm}"</p>
              <p>Try different keywords or clear your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
