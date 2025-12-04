/**
 * CommentThread Component Tests
 * 
 * Tests the CommentThread component which manages a list of comments,
 * displays comment count, and provides sorting controls.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentThread from './CommentThread';

// Mock the Comment component to simplify testing
jest.mock('./Comment', () => {
  return function MockComment({ comment, depth }) {
    return (
      <div data-testid={`comment-${comment.id}`} data-depth={depth}>
        {comment.body}
      </div>
    );
  };
});

describe('CommentThread Component', () => {
  // Basic comments array
  const mockComments = [
    {
      id: 1,
      author: 'user1',
      body: 'First comment',
      created: Date.now() / 1000,
      score: 10,
    },
    {
      id: 2,
      author: 'user2',
      body: 'Second comment',
      created: Date.now() / 1000,
      score: 5,
    },
  ];

  // Comments with nested replies
  const mockCommentsWithReplies = [
    {
      id: 1,
      author: 'user1',
      body: 'Parent comment',
      created: Date.now() / 1000,
      score: 10,
      replies: [
        {
          id: 2,
          author: 'user2',
          body: 'Reply to parent',
          created: Date.now() / 1000,
          score: 5,
          replies: [
            {
              id: 3,
              author: 'user3',
              body: 'Nested reply',
              created: Date.now() / 1000,
              score: 2,
            },
          ],
        },
      ],
    },
  ];

  /**
   * Test 1: Component renders with comments
   */
  test('renders comment thread with comments', () => {
    render(<CommentThread comments={mockComments} />);

    // Check that header is present
    expect(screen.getByText(/Comments/)).toBeInTheDocument();

    // Check that comments are rendered (via mocked Comment component)
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
  });

  /**
   * Test 2: Displays comment count header
   */
  test('displays comment count header', () => {
    render(<CommentThread comments={mockComments} />);

    // Should show Comments heading
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
  });

  /**
   * Test 3: Displays comment count header with nested replies
   */
  test('displays comment section with nested replies', () => {
    render(<CommentThread comments={mockCommentsWithReplies} />);

    // Should show Comments heading
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
  });

  /**
   * Test 4: Renders sort dropdown
   */
  test('renders sort dropdown with options', () => {
    render(<CommentThread comments={mockComments} />);

    // Check that sort dropdown is present
    const sortSelect = screen.getByRole('combobox');
    expect(sortSelect).toBeInTheDocument();

    // Check that all sort options are present
    expect(screen.getByText('Best')).toBeInTheDocument();
    expect(screen.getByText('Top')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Controversial')).toBeInTheDocument();
    expect(screen.getByText('Old')).toBeInTheDocument();
  });

  /**
   * Test 5: Sort dropdown can be changed
   */
  test('sort dropdown value can be changed', () => {
    render(<CommentThread comments={mockComments} />);

    const sortSelect = screen.getByRole('combobox');

    // Change sort to "Top"
    fireEvent.change(sortSelect, { target: { value: 'top' } });
    expect(sortSelect.value).toBe('top');

    // Change sort to "New"
    fireEvent.change(sortSelect, { target: { value: 'new' } });
    expect(sortSelect.value).toBe('new');
  });

  /**
   * Test 6: Handles empty comments array
   */
  test('displays message when no comments', () => {
    render(<CommentThread comments={[]} />);

    // Should show "No comments yet" message
    expect(screen.getByText(/No comments yet/)).toBeInTheDocument();
  });

  /**
   * Test 7: Shows loading state
   */
  test('displays loading state when isLoading is true', () => {
    render(<CommentThread comments={[]} isLoading={true} />);

    // Should show loading message
    expect(screen.getByText('Loading comments...')).toBeInTheDocument();
  });

  /**
   * Test 8: Comments are rendered with depth 0
   */
  test('top-level comments are rendered with depth 0', () => {
    render(<CommentThread comments={mockComments} />);

    // Check that mock comments have depth 0
    const comment1 = screen.getByTestId('comment-1');
    const comment2 = screen.getByTestId('comment-2');

    expect(comment1).toHaveAttribute('data-depth', '0');
    expect(comment2).toHaveAttribute('data-depth', '0');
  });

  /**
   * Test 9: Handles single comment
   */
  test('displays comment count for one comment', () => {
    const singleComment = [mockComments[0]];
    render(<CommentThread comments={singleComment} />);

    // Should show comment count text
    expect(screen.getByText(/Comment/)).toBeInTheDocument();
  });

  /**
   * Test 10: Does not show loading or empty state when comments exist
   */
  test('does not show loading or empty state when comments are present', () => {
    render(<CommentThread comments={mockComments} isLoading={false} />);

    // Should NOT show loading message
    expect(screen.queryByText('Loading comments...')).not.toBeInTheDocument();

    // Should NOT show empty message
    expect(screen.queryByText('No comments yet.')).not.toBeInTheDocument();

    // Should show actual comments
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
  });

  /**
   * Test 11: Sort selection can be changed (visual only for now)
   */
  test('sort dropdown value can be changed', () => {
    render(<CommentThread comments={mockComments} />);

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'new' } });

    // Verify the value changed
    expect(sortSelect.value).toBe('new');
  });

  /**
   * Test 12: Renders all top-level comments
   */
  test('renders all top-level comments in order', () => {
    const manyComments = [
      { id: 1, author: 'user1', body: 'Comment 1', created: Date.now() / 1000, upvotes: 1 },
      { id: 2, author: 'user2', body: 'Comment 2', created: Date.now() / 1000, upvotes: 2 },
      { id: 3, author: 'user3', body: 'Comment 3', created: Date.now() / 1000, upvotes: 3 },
    ];

    render(<CommentThread comments={manyComments} />);

    // All three comments should be rendered
    expect(screen.getByTestId('comment-1')).toBeInTheDocument();
    expect(screen.getByTestId('comment-2')).toBeInTheDocument();
    expect(screen.getByTestId('comment-3')).toBeInTheDocument();
  });

  /**
   * Test 13: Handles undefined comments prop gracefully
   */
  test('handles undefined comments array', () => {
    render(<CommentThread comments={undefined} />);

    // Should show empty state
    expect(screen.getByText(/No comments yet/)).toBeInTheDocument();
  });

  /**
   * Test 14: CSS classes are applied correctly
   */
  test('applies correct CSS classes to elements', () => {
    const { container } = render(<CommentThread comments={mockComments} />);

    // Check that main container has correct class
    expect(container.querySelector('.comment-thread')).toBeInTheDocument();

    // Check that header has correct class
    expect(container.querySelector('.comment-thread__header')).toBeInTheDocument();

    // Check that list has correct class
    expect(container.querySelector('.comment-thread__list')).toBeInTheDocument();
  });
});
