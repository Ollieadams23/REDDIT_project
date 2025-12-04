/**
 * CommentThread Component
 * 
 * Displays a list of top-level comments for a post.
 * Each comment can have nested replies which are handled
 * recursively by the Comment component.
 * 
 * Features:
 * - Sort comments by best/top/new/controversial
 * - Loading state while fetching
 * - Empty state when no comments
 */

import React from 'react';
import './CommentThread.css';
import Comment from './Comment';

/**
 * CommentThread Component
 * 
 * @param {Array} comments - Array of top-level comment objects
 * @param {boolean} isLoading - Whether comments are currently loading
 * @param {number} commentCount - Total number of comments (including replies)
 */
const CommentThread = ({ comments = [], isLoading = false, commentCount = 0 }) => {
  /**
   * If no comments and not loading, show empty state
   */
  if (!isLoading && comments.length === 0) {
    return (
      <div className="comment-thread">
        <div className="comment-thread__empty">
          <p>💬 No comments yet</p>
          <p>Be the first to share what you think!</p>
        </div>
      </div>
    );
  }

  /**
   * Show loading state
   */
  if (isLoading) {
    return (
      <div className="comment-thread">
        <div className="comment-thread__loading">
          <p>Loading comments...</p>
        </div>
      </div>
    );
  }

  /**
   * Render all comments
   */
  return (
    <div className="comment-thread">
      {/* Comment count header */}
      <div className="comment-thread__header">
        <h3>
          {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </h3>

        {/* Sort dropdown (visual only for now) */}
        <div className="comment-thread__sort">
          <label htmlFor="comment-sort">Sort by:</label>
          <select 
            id="comment-sort" 
            className="comment-thread__sort-select"
            defaultValue="best"
          >
            <option value="best">Best</option>
            <option value="top">Top</option>
            <option value="new">New</option>
            <option value="controversial">Controversial</option>
            <option value="old">Old</option>
          </select>
        </div>
      </div>

      {/* List of comments */}
      <div className="comment-thread__list">
        {comments.map((comment) => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentThread;
