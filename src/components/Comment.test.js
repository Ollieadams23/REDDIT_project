/**
 * Comment Component Tests
 * 
 * Tests the Comment component which displays individual comments
 * with recursive nesting, collapse/expand, voting, and threading.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from './Comment';

describe('Comment Component', () => {
  // Basic comment data without replies
  const mockComment = {
    id: 1,
    author: 'testuser',
    body: 'This is a test comment',
    created: Date.now() / 1000, // Unix timestamp
    score: 42,
  };

  // Comment with nested replies
  const mockCommentWithReplies = {
    id: 1,
    author: 'testuser',
    body: 'Parent comment',
    created: Date.now() / 1000,
    score: 42,
    replies: [
      {
        id: 2,
        author: 'replyuser',
        body: 'First reply',
        created: Date.now() / 1000,
        score: 10,
      },
      {
        id: 3,
        author: 'anotheruser',
        body: 'Second reply',
        created: Date.now() / 1000,
        score: 5,
        replies: [
          {
            id: 4,
            author: 'deepuser',
            body: 'Nested reply',
            created: Date.now() / 1000,
            score: 2,
          },
        ],
      },
    ],
  };

  /**
   * Test 1: Component renders with basic comment data
   */
  test('renders comment with all basic elements', () => {
    render(<Comment comment={mockComment} depth={0} />);

    // Check that author is displayed
    expect(screen.getByText('testuser')).toBeInTheDocument();

    // Check that comment body is displayed
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();

    // Check that comment score text is displayed (uses " points")
    expect(screen.getByText(/points/)).toBeInTheDocument();
  });

  /**
   * Test 2: Upvote button works correctly
   */
  test('upvote button logs to console when clicked', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<Comment comment={mockComment} depth={0} />);

    // Find and click the upvote button
    const upvoteButton = screen.getByRole('button', { name: /upvote/i });
    fireEvent.click(upvoteButton);

    // Verify console.log was called with correct message
    expect(consoleSpy).toHaveBeenCalledWith('Upvote comment:', mockComment.id);

    consoleSpy.mockRestore();
  });

  /**
   * Test 3: Downvote button works correctly
   */
  test('downvote button logs to console when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<Comment comment={mockComment} depth={0} />);

    // Find and click the downvote button
    const downvoteButton = screen.getByRole('button', { name: /downvote/i });
    fireEvent.click(downvoteButton);

    // Verify console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Downvote comment:', mockComment.id);

    consoleSpy.mockRestore();
  });

  /**
   * Test 4: Reply button works correctly
   */
  test('reply button logs to console when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(<Comment comment={mockComment} depth={0} />);

    // Find and click the reply button
    const replyButton = screen.getByRole('button', { name: /reply/i });
    fireEvent.click(replyButton);

    // Verify console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Reply to comment:', mockComment.id);

    consoleSpy.mockRestore();
  });

  /**
   * Test 5: Collapse button toggles comment visibility
   */
  test('collapse button hides and shows comment content', () => {
    render(<Comment comment={mockComment} depth={0} />);

    // Initially, comment body should be visible
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();

    // Find and click the collapse button
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    fireEvent.click(collapseButton);

    // Comment body should now be hidden
    expect(screen.queryByText('This is a test comment')).not.toBeInTheDocument();

    // Verify button changed to expand
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();

    // Click again to expand
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);

    // Comment body should be visible again
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  /**
   * Test 6: Renders nested replies recursively
   */
  test('renders nested replies recursively', () => {
    render(<Comment comment={mockCommentWithReplies} depth={0} />);

    // Check parent comment is rendered
    expect(screen.getByText('Parent comment')).toBeInTheDocument();

    // Check first-level replies are rendered
    expect(screen.getByText('First reply')).toBeInTheDocument();
    expect(screen.getByText('Second reply')).toBeInTheDocument();

    // Check nested reply is rendered
    expect(screen.getByText('Nested reply')).toBeInTheDocument();

    // Check all authors are rendered
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('replyuser')).toBeInTheDocument();
    expect(screen.getByText('anotheruser')).toBeInTheDocument();
    expect(screen.getByText('deepuser')).toBeInTheDocument();
  });

  /**
   * Test 7: Collapsing parent hides all nested replies
   */
  test('collapsing parent comment hides all nested replies', () => {
    render(<Comment comment={mockCommentWithReplies} depth={0} />);

    // Verify replies are visible initially
    expect(screen.getByText('First reply')).toBeInTheDocument();
    expect(screen.getByText('Second reply')).toBeInTheDocument();
    expect(screen.getByText('Nested reply')).toBeInTheDocument();

    // Find and click the collapse button on parent comment
    const collapseButtons = screen.getAllByRole('button', { name: /collapse/i });
    fireEvent.click(collapseButtons[0]); // First button is parent's collapse

    // All replies should be hidden
    expect(screen.queryByText('First reply')).not.toBeInTheDocument();
    expect(screen.queryByText('Second reply')).not.toBeInTheDocument();
    expect(screen.queryByText('Nested reply')).not.toBeInTheDocument();
  });

  /**
   * Test 8: Depth prop affects indentation
   */
  test('depth prop is applied as data-depth attribute', () => {
    const { container } = render(<Comment comment={mockComment} depth={3} />);

    // The comment div should have data-depth="3"
    const commentDiv = container.querySelector('.comment');
    expect(commentDiv).toHaveAttribute('data-depth', '3');
  });

  /**
   * Test 9: Maximum depth is enforced for indentation
   */
  test('indentation maxes out at depth 8', () => {
    const { container } = render(<Comment comment={mockComment} depth={12} />);

    // Even though depth is 12, the indentation should be capped at 8
    const commentDiv = container.querySelector('.comment');
    const marginLeft = commentDiv.style.marginLeft;

    // Max depth is 8, so 8 * 24px = 192px
    expect(marginLeft).toBe('192px');
  });

  /**
   * Test 10: Comment without replies doesn't render empty replies list
   */
  test('comment without replies does not render replies container', () => {
    const { container } = render(<Comment comment={mockComment} depth={0} />);

    // Should not find a nested comment (only one comment element)
    const comments = container.querySelectorAll('.comment');
    expect(comments.length).toBe(1);
  });

  /**
   * Test 11: Vote count formatting works correctly
   */
  test('formats vote counts correctly', () => {
    const highVoteComment = {
      ...mockComment,
      score: 12500,
    };

    render(<Comment comment={highVoteComment} depth={0} />);

    // Should display formatted number (with k suffix)
    expect(screen.getByText(/k points/)).toBeInTheDocument();
  });

  /**
   * Test 12: Handles comments with no author gracefully
   */
  test('handles missing author field', () => {
    const commentNoAuthor = {
      ...mockComment,
      author: undefined,
    };

    render(<Comment comment={commentNoAuthor} depth={0} />);

    // Should still render comment body
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
  });

  /**
   * Test 13: Thread line is rendered for nested comments
   */
  test('renders thread line for depth > 0', () => {
    const { container } = render(<Comment comment={mockComment} depth={1} />);

    // Thread line should be present for nested comments
    const threadLine = container.querySelector('.comment__thread-line');
    expect(threadLine).toBeInTheDocument();
  });

  /**
   * Test 14: No thread line for top-level comments
   */
  test('does not render thread line for depth 0', () => {
    const { container } = render(<Comment comment={mockComment} depth={0} />);

    // Thread line should NOT be present for top-level comments
    const threadLine = container.querySelector('.comment__thread-line');
    expect(threadLine).not.toBeInTheDocument();
  });

  /**
   * Test 15: Collapsed state shows comment count for comments with replies
   */
  test('collapsed state shows comment count when comment has replies', () => {
    render(<Comment comment={mockCommentWithReplies} depth={0} />);

    // Collapse the comment
    const collapseButtons = screen.getAllByRole('button', { name: /collapse/i });
    fireEvent.click(collapseButtons[0]); // Click the first (parent) button

    // Should show collapsed indicator with comment count
    // The comment has 2 direct replies (nested ones are hidden)
    expect(screen.getByText(/2.*replies/i)).toBeInTheDocument();
  });

  /**
   * Test 16: Handles empty comment body
   */
  test('handles empty comment body gracefully', () => {
    const emptyBodyComment = {
      ...mockComment,
      body: '',
    };

    render(<Comment comment={emptyBodyComment} depth={0} />);

    // Should still render author and controls
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
  });
});
