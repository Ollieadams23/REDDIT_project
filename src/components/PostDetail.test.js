/**
 * PostDetail Component Tests
 * 
 * Tests the PostDetail component which displays full post content
 * with voting, metadata, and integrated comment thread.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PostDetail from './PostDetail';
import postsReducer from '../features/posts/postsSlice';

// Mock the CommentThread component
jest.mock('./CommentThread', () => {
  return function MockCommentThread({ comments }) {
    return (
      <div data-testid="comment-thread">
        {comments ? comments.length : 0} comments rendered
      </div>
    );
  };
});

/**
 * Helper function to create a mock Redux store with posts data
 */
const createMockStore = (initialState = {}) => {
  const defaultState = {
    posts: {
      posts: [ // Note: posts slice uses 'posts' not 'items'
        {
          id: '1',
          title: 'Amazing sunset photo I took from my backyard',
          author: 'nature_lover_42',
          subreddit: 'pics',
          score: 1234,
          numComments: 45,
          created: 1701619200,
          thumbnail: 'https://via.placeholder.com/140x140/FF6B6B/ffffff?text=Sunset',
          url: 'https://via.placeholder.com/800x600/FF6B6B/ffffff?text=Sunset+Photo',
          selftext: 'I was sitting in my backyard when I saw this incredible sunset. Had to capture it!',
          permalink: '/r/pics/comments/1/amazing_sunset_photo',
          ups: 1234, // Add ups field for the vote count
        },
      ],
      selectedPost: null,
      status: 'idle',
      error: null,
    },
    ...initialState,
  };

  return configureStore({
    reducer: {
      posts: postsReducer,
    },
    preloadedState: defaultState,
  });
};

describe('PostDetail Component', () => {
  // Mock onBack handler
  const mockOnBack = jest.fn();

  /**
   * Reset mocks before each test
   */
  beforeEach(() => {
    mockOnBack.mockClear();
  });

  /**
   * Test 1: Component renders with post data
   */
  test('renders post with all content', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Check that post title is displayed (from mock data for post ID '1')
    expect(screen.getByText('Amazing sunset photo I took from my backyard')).toBeInTheDocument();

    // Check that post body is displayed
    expect(screen.getByText(/sitting in my backyard/)).toBeInTheDocument();

    // Check that author is displayed
    expect(screen.getByText(/nature_lover_42/)).toBeInTheDocument();

    // Check that subreddit is displayed
    expect(screen.getByText(/pics/)).toBeInTheDocument();
  });

  /**
   * Test 2: Back button calls onBack handler
   */
  test('back button calls onBack when clicked', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Find and click the back button
    const backButton = screen.getByRole('button', { name: /back to feed/i });
    fireEvent.click(backButton);

    // Verify onBack was called
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 3: Upvote button logs to console
   */
  test('upvote button logs to console when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Find and click the upvote button
    const upvoteButton = screen.getByRole('button', { name: /upvote/i });
    fireEvent.click(upvoteButton);

    // Verify console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Upvote post:', '1');

    consoleSpy.mockRestore();
  });

  /**
   * Test 4: Downvote button logs to console
   */
  test('downvote button logs to console when clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Find and click the downvote button
    const downvoteButton = screen.getByRole('button', { name: /downvote/i });
    fireEvent.click(downvoteButton);

    // Verify console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Downvote post:', '1');

    consoleSpy.mockRestore();
  });

  /**
   * Test 5: Comment thread is rendered
   */
  test('renders comment thread component', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Check that mocked CommentThread is rendered
    expect(screen.getByTestId('comment-thread')).toBeInTheDocument();

    // Verify it shows comments rendered
    expect(screen.getByText(/comments rendered/)).toBeInTheDocument();
  });

  /**
   * Test 6: Vote count is displayed
   */
  test('displays vote count', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Should have a vote count element
    expect(container.querySelector('.post-detail__vote-count')).toBeInTheDocument();
  });

  /**
   * Test 7: Post metadata section is displayed
   */
  test('displays post metadata', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Should have a meta section
    expect(container.querySelector('.post-detail__meta')).toBeInTheDocument();
  });

  /**
   * Test 8: Image is rendered when present
   */
  test('renders post image when image URL is provided', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Check that image is rendered (post 1 has an image)
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Amazing sunset photo I took from my backyard');
  });

  /**
   * Test 9: Comment thread is rendered
   */
  test('comment thread component is displayed', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Should render CommentThread (mocked)
    expect(screen.getByTestId('comment-thread')).toBeInTheDocument();
  });

  /**
   * Test 10: Action buttons are present
   */
  test('displays action buttons', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Check that action buttons section exists
    expect(container.querySelector('.post-detail__actions')).toBeInTheDocument();
  });

  /**
   * Test 11: CSS classes are applied correctly
   */
  test('applies correct CSS classes to elements', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <PostDetail postId="1" onBack={mockOnBack} />
      </Provider>
    );

    // Check main container class
    expect(container.querySelector('.post-detail')).toBeInTheDocument();

    // Check card class
    expect(container.querySelector('.post-detail__card')).toBeInTheDocument();

    // Check votes section class
    expect(container.querySelector('.post-detail__votes')).toBeInTheDocument();

    // Check meta section class
    expect(container.querySelector('.post-detail__meta')).toBeInTheDocument();
  });

  /**
   * Test 12: Handles invalid post ID
   */
  test('displays error when post not found', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <PostDetail postId="999" onBack={mockOnBack} />
      </Provider>
    );

    // Should show error message
    expect(screen.getByText(/Post not found/)).toBeInTheDocument();
  });
});
