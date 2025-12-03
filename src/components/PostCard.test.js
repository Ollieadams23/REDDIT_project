/**
 * Tests for PostCard Component
 * 
 * What are we testing?
 * - Does the component render correctly?
 * - Does it display all the post data?
 * - Does the click handler work?
 * - Is it accessible (keyboard navigation, ARIA labels)?
 * 
 * Why test components?
 * - Ensure UI displays data correctly
 * - Catch visual bugs before users see them
 * - Make sure accessibility works
 * - Document how the component should behave
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './PostCard';
import { mockPosts } from '../data/mockData';

/**
 * Test Suite for PostCard Component
 */
describe('PostCard', () => {
  // Use the first mock post for testing
  const mockPost = mockPosts[0];
  const mockOnClick = jest.fn(); // Mock function to track clicks

  /**
   * Reset mocks before each test
   * This ensures tests don't interfere with each other
   */
  beforeEach(() => {
    mockOnClick.mockClear();
  });

  /**
   * Test: Component renders without crashing
   */
  test('renders without crashing', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
  });

  /**
   * Test: Displays post title
   */
  test('displays post title', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Look for the title text in the document
    const titleElement = screen.getByText(mockPost.title);
    expect(titleElement).toBeInTheDocument();
  });

  /**
   * Test: Displays subreddit name
   */
  test('displays subreddit name', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Should show "r/pics" (from mockPost)
    const subredditElement = screen.getByText(`r/${mockPost.subreddit}`);
    expect(subredditElement).toBeInTheDocument();
  });

  /**
   * Test: Displays author name
   */
  test('displays author name', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Should show "u/nature_lover_42"
    const authorElement = screen.getByText(`u/${mockPost.author}`);
    expect(authorElement).toBeInTheDocument();
  });

  /**
   * Test: Displays vote score
   * Uses formatNumber, so 1234 becomes "1.2k"
   */
  test('displays formatted vote score', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // mockPost has score of 1234, which formats to "1.2k"
    const scoreElement = screen.getByText('1.2k');
    expect(scoreElement).toBeInTheDocument();
  });

  /**
   * Test: Displays comment count
   */
  test('displays comment count', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Should show "45 comments"
    const commentsElement = screen.getByText('45 comments');
    expect(commentsElement).toBeInTheDocument();
  });

  /**
   * Test: Displays thumbnail image when available
   */
  test('displays thumbnail image when available', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Find the image element
    const imageElement = screen.getByAltText(mockPost.title);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockPost.thumbnail);
  });

  /**
   * Test: Shows placeholder for text posts (no image)
   */
  test('shows placeholder for text posts without thumbnail', () => {
    const textPost = {
      ...mockPost,
      thumbnail: null, // No thumbnail
    };
    
    render(<PostCard post={textPost} onClick={mockOnClick} />);
    
    // Should show the document emoji placeholder
    const placeholderElement = screen.getByText('📄');
    expect(placeholderElement).toBeInTheDocument();
  });

  /**
   * Test: Shows video indicator for video posts
   */
  test('shows video indicator for video posts', () => {
    const videoPost = {
      ...mockPost,
      isVideo: true,
    };
    
    render(<PostCard post={videoPost} onClick={mockOnClick} />);
    
    // Should show the play button
    const videoIndicator = screen.getByText('▶️');
    expect(videoIndicator).toBeInTheDocument();
  });

  /**
   * Test: Calls onClick when card is clicked
   */
  test('calls onClick handler when card is clicked', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Find the card element (it has role="button")
    const cardElement = screen.getByRole('button', { name: /view post/i });
    
    // Click the card
    fireEvent.click(cardElement);
    
    // onClick should have been called once with the post ID
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockPost.id);
  });

  /**
   * Test: Can be activated with keyboard (Enter key)
   * Important for accessibility!
   */
  test('can be activated with Enter key', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    const cardElement = screen.getByRole('button', { name: /view post/i });
    
    // Press Enter key
    fireEvent.keyDown(cardElement, { key: 'Enter', code: 'Enter' });
    
    // onClick should have been called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Can be activated with keyboard (Space key)
   */
  test('can be activated with Space key', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    const cardElement = screen.getByRole('button', { name: /view post/i });
    
    // Press Space key
    fireEvent.keyDown(cardElement, { key: ' ', code: 'Space' });
    
    // onClick should have been called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  /**
   * Test: Vote buttons are present
   */
  test('renders upvote and downvote buttons', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    // Should have two vote buttons
    const upvoteButton = screen.getByLabelText('Upvote');
    const downvoteButton = screen.getByLabelText('Downvote');
    
    expect(upvoteButton).toBeInTheDocument();
    expect(downvoteButton).toBeInTheDocument();
  });

  /**
   * Test: Clicking vote buttons doesn't trigger card click
   * 
   * When you click a vote button, it should NOT open the post detail.
   * We use stopPropagation() to prevent this.
   */
  test('clicking vote buttons does not trigger card onClick', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    const upvoteButton = screen.getByLabelText('Upvote');
    
    // Click the upvote button
    fireEvent.click(upvoteButton);
    
    // Card onClick should NOT have been called
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  /**
   * Test: Component has proper ARIA label
   * Helps screen readers announce what the card is
   */
  test('has proper ARIA label for accessibility', () => {
    render(<PostCard post={mockPost} onClick={mockOnClick} />);
    
    const cardElement = screen.getByLabelText(`View post: ${mockPost.title}`);
    expect(cardElement).toBeInTheDocument();
  });
});
