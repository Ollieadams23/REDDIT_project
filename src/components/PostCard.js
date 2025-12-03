/**
 * PostCard Component
 * 
 * This is a reusable component that displays a single Reddit post.
 * It shows:
 * - Vote buttons (up/down arrows with score)
 * - Thumbnail image
 * - Post title
 * - Post metadata (subreddit, author, time)
 * - Comment count
 * 
 * Props:
 * - post: Object containing all post data
 * - onClick: Function called when card is clicked
 * 
 * Why is this component small and reusable?
 * - It only does ONE thing: display a post card
 * - It doesn't know about Redux (receives data via props)
 * - Can be used anywhere in the app
 * - Easy to test
 */

import React from 'react';
import { formatNumber, getTimeAgo } from '../data/mockData';
import './PostCard.css';

/**
 * PostCard Component
 */
const PostCard = ({ post, onClick }) => {
  /**
   * Handle card click
   * When user clicks anywhere on the card, call the onClick function
   */
  const handleClick = () => {
    if (onClick) {
      onClick(post.id);
    }
  };

  /**
   * Handle vote button clicks
   * For now, these don't do anything (Reddit API doesn't allow voting without auth)
   * But we'll add the UI for visual consistency
   */
  const handleUpvote = (e) => {
    // Stop the click from bubbling to the card
    e.stopPropagation();
    // TODO: Implement upvote functionality (if we add authentication)
    console.log('Upvote clicked for post:', post.id);
  };

  const handleDownvote = (e) => {
    // Stop the click from bubbling to the card
    e.stopPropagation();
    // TODO: Implement downvote functionality
    console.log('Downvote clicked for post:', post.id);
  };

  return (
    <article 
      className="post-card" 
      onClick={handleClick}
      // Make it keyboard accessible
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Allow Enter or Space to activate
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent page scroll on Space
          handleClick();
        }
      }}
      aria-label={`View post: ${post.title}`}
    >
      {/* Vote buttons section */}
      <div className="post-card__votes">
        <button 
          className="vote-button vote-button--up"
          onClick={handleUpvote}
          aria-label="Upvote"
        >
          ▲
        </button>
        
        <span className="post-card__score" aria-label={`${post.score} points`}>
          {formatNumber(post.score)}
        </span>
        
        <button 
          className="vote-button vote-button--down"
          onClick={handleDownvote}
          aria-label="Downvote"
        >
          ▼
        </button>
      </div>

      {/* Thumbnail section */}
      <div className="post-card__thumbnail">
        {post.thumbnail && post.thumbnail !== 'self' ? (
          // Show image if available
          <img 
            src={post.thumbnail} 
            alt={post.title}
            className="post-card__thumbnail-image"
            // Lazy loading for performance
            loading="lazy"
          />
        ) : (
          // Show placeholder for text posts
          <div className="post-card__thumbnail-placeholder">
            <span className="post-card__thumbnail-icon">📄</span>
          </div>
        )}
        
        {/* Show video indicator if it's a video post */}
        {post.isVideo && (
          <div className="post-card__video-indicator">
            ▶️
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="post-card__content">
        {/* Title */}
        <h2 className="post-card__title">{post.title}</h2>

        {/* Metadata */}
        <div className="post-card__meta">
          {/* Subreddit */}
          <span className="post-card__subreddit">
            r/{post.subreddit}
          </span>
          
          <span className="post-card__separator">•</span>
          
          {/* Author */}
          <span className="post-card__author">
            u/{post.author}
          </span>
          
          <span className="post-card__separator">•</span>
          
          {/* Time posted */}
          <span className="post-card__time">
            {getTimeAgo(post.created)}
          </span>
        </div>

        {/* Comments count */}
        <div className="post-card__comments">
          <span className="post-card__comments-icon">💬</span>
          <span className="post-card__comments-count">
            {formatNumber(post.numComments)} {post.numComments === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
