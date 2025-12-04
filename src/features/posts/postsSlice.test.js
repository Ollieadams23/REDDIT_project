/**
 * Tests for Posts Slice
 * 
 * What are we testing?
 * - Does the initial state load correctly?
 * - Do our actions update the state properly?
 * - Does the reducer handle different scenarios?
 * 
 * Why test Redux slices?
 * - Redux logic is pure JavaScript (easy to test!)
 * - If Redux works, our components will work
 * - Catch bugs before they reach the UI
 */

import postsReducer, {
  fetchPosts,
  clearSelectedPost,
} from './postsSlice';
import { mockPosts } from '../../data/mockData';
import * as redditAPI from '../../services/redditAPI';

// Mock the Reddit API
jest.mock('../../services/redditAPI');

/**
 * Test Suite for Posts Slice
 * 
 * describe() groups related tests together
 */
describe('postsSlice', () => {
  /**
   * Test initial state
   * 
   * When the app first loads, the state should be empty
   */
  test('should return the initial state', () => {
    // Call the reducer with undefined state and an empty action
    const result = postsReducer(undefined, { type: '' });
    
    // Expect the initial state with new fields
    expect(result).toEqual({
      posts: [],
      selectedPost: null,
      comments: [],
      after: null,
      isLoadingMore: false,
      status: 'idle',
      error: null,
    });
  });
  
  /**
   * Test fetchPosts pending action
   * 
   * When we start loading posts, status should change to 'loading'
   */
  test('should handle fetchPosts.pending', () => {
    const initialState = {
      posts: [],
      selectedPost: null,
      comments: [],
      after: null,
      isLoadingMore: false,
      status: 'idle',
      error: null,
    };
    
    // Dispatch the fetchPosts pending action
    const result = postsReducer(initialState, fetchPosts.pending());
    
    // Status should now be 'loading'
    expect(result.status).toBe('loading');
    expect(result.isLoadingMore).toBe(false);
  });
  
  /**
   * Test fetchPosts fulfilled action
   * 
   * When posts load successfully:
   * - Posts array should be populated
   * - Status should be 'succeeded'
   * - Error should be null
   */
  test('should handle fetchPosts.fulfilled', () => {
    const initialState = {
      posts: [],
      selectedPost: null,
      comments: [],
      after: null,
      isLoadingMore: false,
      status: 'loading',
      error: null,
    };
    
    // Dispatch success with mock posts and after token
    const mockPayload = { posts: mockPosts, after: 'abc123' };
    const result = postsReducer(
      initialState,
      fetchPosts.fulfilled(mockPayload)
    );
    
    // Check the results
    expect(result.status).toBe('succeeded');
    expect(result.posts).toEqual(mockPosts);
    expect(result.posts.length).toBe(8); // We have 8 mock posts
    expect(result.after).toBe('abc123');
    expect(result.error).toBeNull();
  });
  
  /**
   * Test fetchPosts rejected action
   * 
   * When loading fails:
   * - Status should be 'failed'
   * - Error message should be set
   */
  test('should handle fetchPosts.rejected', () => {
    const initialState = {
      posts: [],
      selectedPost: null,
      comments: [],
      after: null,
      isLoadingMore: false,
      status: 'loading',
      error: null,
    };
    
    const errorMessage = 'Failed to fetch posts';
    
    // Dispatch failure with error
    const action = fetchPosts.rejected(new Error(errorMessage));
    const result = postsReducer(initialState, action);
    
    // Check the results
    expect(result.status).toBe('failed');
    expect(result.error).toBe(errorMessage);
  });
  
  /**
   * Test clearSelectedPost action
   * 
   * Note: selectPost action was removed. Posts are now selected via fetchPostDetails
   * This test has been removed as the functionality changed.
   */
  
  /**
   * Test clearSelectedPost action
   * 
   * When user goes back to the feed:
   * - selectedPost should be null
   */
  test('should handle clearSelectedPost', () => {
    const initialState = {
      posts: mockPosts,
      selectedPost: mockPosts[0],
      comments: [],
      after: null,
      isLoadingMore: false,
      status: 'succeeded',
      error: null,
    };
    
    // Clear selection
    const result = postsReducer(initialState, clearSelectedPost());
    
    // selectedPost should be null
    expect(result.selectedPost).toBeNull();
  });
  
  /**
   * Note: searchPosts tests removed
   * 
   * Search is now handled by Reddit API (server-side), not client-side filtering
   */
  test.skip('searchPosts moved to server-side', () => {
    const initialState = {
      posts: mockPosts,
      selectedPost: null,
      comments: [],
      after: null,
      isLoadingMore: false,
      status: 'succeeded',
      error: null,
    };
    
    // Placeholder test - actual functionality is async
    expect(initialState.posts.length).toBe(8);
  });
});
