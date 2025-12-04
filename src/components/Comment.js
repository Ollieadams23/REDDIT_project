/**
 * Comment Component
 * 
 * Displays a single Reddit comment with:
 * - Author name and timestamp
 * - Comment text/body
 * - Vote counts (upvotes/downvotes)
 * - Collapse/expand functionality
 * - Reply button (visual only for now)
 * - Recursive rendering for nested replies
 */

import React, { useState } from 'react';
import './Comment.css';
import { getTimeAgo, formatNumber } from '../data/mockData';

/**
 * Comment Component
 * 
 * @param {Object} comment - The comment data object
 * @param {number} depth - How deeply nested this comment is (for indentation)
 */
const Comment = ({ comment, depth = 0 }) => {
  /**
   * State to track if this comment is collapsed
   * Collapsed comments show only the author name and can be expanded
   */
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Toggle collapse/expand state
   */
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  /**
   * Handle upvote click
   * For now, just logs to console (would need API in real app)
   */
  const handleUpvote = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Upvote comment:', comment.id);
  };

  /**
   * Handle downvote click
   */
  const handleDownvote = (e) => {
    e.stopPropagation();
    console.log('Downvote comment:', comment.id);
  };

  /**
   * Handle reply button click
   */
  const handleReply = () => {
    console.log('Reply to comment:', comment.id);
    // TODO: Open reply text box
  };

  /**
   * Calculate indentation based on depth
   * Each level adds 24px of left margin
   * Max depth of 8 levels to prevent excessive indentation
   */
  const indentLevel = Math.min(depth, 8);
  const indentStyle = {
    marginLeft: `${indentLevel * 24}px`,
  };

  return (
    <div 
      className="comment" 
      style={indentStyle}
      data-depth={depth}
    >
      {/* Left border for visual threading */}
      {depth > 0 && <div className="comment__thread-line" />}

      {/* Comment header with author and controls */}
      <div className="comment__header">
        <button
          className="comment__collapse-btn"
          onClick={handleToggleCollapse}
          aria-label={isCollapsed ? 'Expand comment' : 'Collapse comment'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? '+' : '−'}
        </button>

        <span className="comment__author">{comment.author}</span>
        <span className="comment__score">
          {formatNumber(comment.score)} points
        </span>
        <span className="comment__time">{getTimeAgo(comment.created)}</span>

        {/* Show reply count when collapsed */}
        {isCollapsed && comment.replies && comment.replies.length > 0 && (
          <span className="comment__reply-count">
            ({comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'})
          </span>
        )}
      </div>

      {/* Comment body and actions (hidden when collapsed) */}
      {!isCollapsed && (
        <>
          {/* Comment text */}
          <div className="comment__body">
            <p>{comment.body}</p>
          </div>

          {/* Comment actions */}
          <div className="comment__actions">
            {/* Voting buttons */}
            <button
              className="comment__vote-btn comment__vote-btn--up"
              onClick={handleUpvote}
              aria-label="Upvote comment"
            >
              ▲
            </button>

            <button
              className="comment__vote-btn comment__vote-btn--down"
              onClick={handleDownvote}
              aria-label="Downvote comment"
            >
              ▼
            </button>

            {/* Reply button */}
            <button
              className="comment__reply-btn"
              onClick={handleReply}
              aria-label="Reply to comment"
            >
              Reply
            </button>

            {/* Share and report buttons (visual only) */}
            <button className="comment__action-btn" aria-label="Share comment">
              Share
            </button>
          </div>

          {/* Recursively render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="comment__replies">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
