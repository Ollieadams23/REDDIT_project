/**
 * PostDetail Component
 * 
 * Displays full post details with:
 * - Complete post content
 * - Author information
 * - Vote counts and buttons
 * - All comments with nested replies
 * - Back navigation
 * 
 * This is the view you see when clicking on a post
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './PostDetail.css';
import CommentThread from './CommentThread';
import { getTimeAgo, formatNumber } from '../data/mockData';
import { 
  fetchPostDetails, 
  selectSelectedPost,
  selectComments,
  selectIsLoading
} from '../features/posts/postsSlice';

/**
 * Convert YouTube URL to embed URL
 * 
 * @param {string} url - YouTube URL
 * @returns {string} Embed URL
 */
const getYoutubeEmbedUrl = (url) => {
  // Handle youtu.be short links
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Handle regular youtube.com links
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

/**
 * PostDetail Component
 * 
 * @param {string} postId - The ID of the post to display
 * @param {function} onBack - Callback when user clicks back button
 */
const PostDetail = ({ postId, onBack }) => {
  const dispatch = useDispatch();

  /**
   * Get the selected post and comments from Redux
   */
  const post = useSelector(selectSelectedPost);
  const comments = useSelector(selectComments);
  const isLoading = useSelector(selectIsLoading);
  
  /**
   * Get all posts to find the subreddit for this postId
   */
  const allPosts = useSelector((state) => state.posts.posts);

  /**
   * Load the post and comments when component mounts or postId changes
   * We need to find the post in our posts array to get its subreddit
   */
  useEffect(() => {
    if (postId) {
      // Find the post in our current posts to get its subreddit
      const foundPost = allPosts.find(p => p.id === postId);
      
      if (foundPost) {
        // Fetch full post details with comments from Reddit API
        dispatch(fetchPostDetails({ 
          subreddit: foundPost.subreddit, 
          postId: postId 
        }));
      }
    }
  }, [dispatch, postId, allPosts]);

  /**
   * Calculate total comment count including nested replies
   */
  const countCommentsRecursive = (commentList) => {
    let count = commentList.length;
    commentList.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        count += countCommentsRecursive(comment.replies);
      }
    });
    return count;
  };

  const totalCommentCount = countCommentsRecursive(comments);

  /**
   * Handle upvote click
   */
  const handleUpvote = () => {
    console.log('Upvote post:', post?.id);
  };

  /**
   * Handle downvote click
   */
  const handleDownvote = () => {
    console.log('Downvote post:', post?.id);
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="post-detail">
        <div className="post-detail__loading">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  /**
   * Error state - post not found
   */
  if (!post) {
    return (
      <div className="post-detail">
        <div className="post-detail__error">
          <p>❌ Post not found</p>
          <button onClick={onBack} className="post-detail__back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail">
      {/* Back button */}
      <button 
        onClick={onBack} 
        className="post-detail__back-btn"
        aria-label="Go back to feed"
      >
        ← Back to feed
      </button>

      {/* Main post card */}
      <article className="post-detail__card">
        {/* Vote section */}
        <div className="post-detail__votes">
          <button
            className="post-detail__vote-btn post-detail__vote-btn--up"
            onClick={handleUpvote}
            aria-label="Upvote post"
          >
            ▲
          </button>
          <span className="post-detail__vote-count">
            {formatNumber(post.ups)}
          </span>
          <button
            className="post-detail__vote-btn post-detail__vote-btn--down"
            onClick={handleDownvote}
            aria-label="Downvote post"
          >
            ▼
          </button>
        </div>

        {/* Post content */}
        <div className="post-detail__content">
          {/* Subreddit and author info */}
          <div className="post-detail__meta">
            <span className="post-detail__subreddit">
              r/{post.subreddit}
            </span>
            <span className="post-detail__separator">•</span>
            <span className="post-detail__author">
              Posted by u/{post.author}
            </span>
            <span className="post-detail__separator">•</span>
            <span className="post-detail__time">
              {getTimeAgo(post.created)}
            </span>
          </div>

          {/* Post title */}
          <h1 className="post-detail__title">{post.title}</h1>

          {/* Post body/text */}
          {post.selftext && (
            <div className="post-detail__body">
              <p>{post.selftext}</p>
            </div>
          )}

          {/* Video player for Reddit-hosted videos */}
          {post.is_video && post.videoUrl && (
            <div className="post-detail__video">
              <video 
                controls 
                className="post-detail__video-player"
                poster={post.thumbnail && post.thumbnail !== 'self' ? post.thumbnail : undefined}
              >
                <source src={post.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* YouTube embedded player */}
          {post.videoType === 'youtube' && post.videoUrl && (
            <div className="post-detail__video">
              <iframe
                className="post-detail__video-player"
                src={getYoutubeEmbedUrl(post.videoUrl)}
                title={post.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* External video link */}
          {!post.is_video && post.videoType && post.videoUrl && (
            <div className="post-detail__external-link">
              <a href={post.videoUrl} target="_blank" rel="noopener noreferrer">
                🎬 Watch video on {post.videoType}
              </a>
            </div>
          )}

          {/* Thumbnail/image for non-video posts */}
          {!post.is_video && post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && (
            <div className="post-detail__image">
              <img 
                src={post.thumbnail} 
                alt={post.title}
                loading="lazy"
              />
            </div>
          )}

          {/* Post actions */}
          <div className="post-detail__actions">
            <div className="post-detail__action-item">
              💬 {totalCommentCount} {totalCommentCount === 1 ? 'Comment' : 'Comments'}
            </div>
            <button className="post-detail__action-btn">
              Share
            </button>
            <button className="post-detail__action-btn">
              Save
            </button>
            <button className="post-detail__action-btn">
              Report
            </button>
          </div>
        </div>
      </article>

      {/* Comments section */}
      <CommentThread 
        comments={comments}
        commentCount={totalCommentCount}
        isLoading={false}
      />
    </div>
  );
};

export default PostDetail;
