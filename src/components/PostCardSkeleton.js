/**
 * PostCardSkeleton Component
 * 
 * Loading placeholder that mimics PostCard layout
 * Shows while posts are being fetched from Reddit API
 * 
 * Features:
 * - Gray placeholder boxes
 * - Shimmer animation effect
 * - Same dimensions as real PostCard
 */

import React from 'react';
import './PostCardSkeleton.css';

/**
 * PostCardSkeleton Component
 * 
 * Displays a single skeleton card
 * Usually rendered multiple times (3-5) to fill the screen
 * 
 * Wrapped with React.memo since it has no props and never changes
 */
const PostCardSkeleton = React.memo(() => {
  return (
    <div className="post-card-skeleton">
      {/* Vote section placeholder */}
      <div className="post-card-skeleton__votes">
        <div className="post-card-skeleton__vote-btn"></div>
        <div className="post-card-skeleton__score"></div>
        <div className="post-card-skeleton__vote-btn"></div>
      </div>

      {/* Thumbnail placeholder */}
      <div className="post-card-skeleton__thumbnail"></div>

      {/* Content section placeholder */}
      <div className="post-card-skeleton__content">
        {/* Title - 2 lines */}
        <div className="post-card-skeleton__title-line"></div>
        <div className="post-card-skeleton__title-line post-card-skeleton__title-line--short"></div>
        
        {/* Metadata - subreddit, author, time */}
        <div className="post-card-skeleton__meta">
          <div className="post-card-skeleton__meta-item"></div>
          <div className="post-card-skeleton__meta-item"></div>
          <div className="post-card-skeleton__meta-item"></div>
        </div>

        {/* Comments count */}
        <div className="post-card-skeleton__comments"></div>
      </div>
    </div>
  );
});

PostCardSkeleton.displayName = 'PostCardSkeleton';

export default PostCardSkeleton;
