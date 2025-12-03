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

import React from 'react';
import './App.css';
import PostCard from './components/PostCard';
import { mockPosts } from './data/mockData';

function App() {
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
          <h2>Latest Posts</h2>
          
          {/* Display all mock posts */}
          <div className="App-posts">
            {mockPosts.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                onClick={handlePostClick}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
