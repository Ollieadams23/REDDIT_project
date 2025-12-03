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
  loadPosts,
  loadPostsSuccess,
  loadPostsFailed,
  selectPost as selectPostAction,
  clearSelectedPost,
  searchPosts,
} from './postsSlice';
import { mockPosts } from '../../data/mockData';

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
    
    // Expect the initial state
    expect(result).toEqual({
      posts: [],
      selectedPost: null,
      status: 'idle',
      error: null,
    });
  });
  
  /**
   * Test loadPosts action
   * 
   * When we start loading posts, status should change to 'loading'
   */
  test('should handle loadPosts', () => {
    const initialState = {
      posts: [],
      selectedPost: null,
      status: 'idle',
      error: null,
    };
    
    // Dispatch the loadPosts action
    const result = postsReducer(initialState, loadPosts());
    
    // Status should now be 'loading'
    expect(result.status).toBe('loading');
  });
  
  /**
   * Test loadPostsSuccess action
   * 
   * When posts load successfully:
   * - Posts array should be populated
   * - Status should be 'succeeded'
   * - Error should be null
   */
  test('should handle loadPostsSuccess', () => {
    const initialState = {
      posts: [],
      selectedPost: null,
      status: 'loading',
      error: null,
    };
    
    // Dispatch success with mock posts
    const result = postsReducer(
      initialState,
      loadPostsSuccess(mockPosts)
    );
    
    // Check the results
    expect(result.status).toBe('succeeded');
    expect(result.posts).toEqual(mockPosts);
    expect(result.posts.length).toBe(8); // We have 8 mock posts
    expect(result.error).toBeNull();
  });
  
  /**
   * Test loadPostsFailed action
   * 
   * When loading fails:
   * - Status should be 'failed'
   * - Error message should be set
   */
  test('should handle loadPostsFailed', () => {
    const initialState = {
      posts: [],
      selectedPost: null,
      status: 'loading',
      error: null,
    };
    
    const errorMessage = 'Failed to fetch posts';
    
    // Dispatch failure
    const result = postsReducer(
      initialState,
      loadPostsFailed(errorMessage)
    );
    
    // Check the results
    expect(result.status).toBe('failed');
    expect(result.error).toBe(errorMessage);
  });
  
  /**
   * Test selectPost action
   * 
   * When user clicks on a post:
   * - That post should be saved as selectedPost
   */
  test('should handle selectPost', () => {
    const initialState = {
      posts: mockPosts,
      selectedPost: null,
      status: 'succeeded',
      error: null,
    };
    
    // Select the first post (ID: '1')
    const result = postsReducer(
      initialState,
      selectPostAction('1')
    );
    
    // selectedPost should now be the first post
    expect(result.selectedPost).toEqual(mockPosts[0]);
    expect(result.selectedPost.id).toBe('1');
  });
  
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
      status: 'succeeded',
      error: null,
    };
    
    // Clear selection
    const result = postsReducer(initialState, clearSelectedPost());
    
    // selectedPost should be null
    expect(result.selectedPost).toBeNull();
  });
  
  /**
   * Test searchPosts action
   * 
   * When user searches:
   * - Only matching posts should remain
   */
  test('should handle searchPosts', () => {
    const initialState = {
      posts: mockPosts,
      selectedPost: null,
      status: 'succeeded',
      error: null,
    };
    
    // Search for "sunset"
    const result = postsReducer(
      initialState,
      searchPosts('sunset')
    );
    
    // Should only return posts with "sunset" in title or text
    expect(result.posts.length).toBe(1);
    expect(result.posts[0].title).toContain('sunset');
  });
  
  /**
   * Test searchPosts with no results
   */
  test('should handle searchPosts with no results', () => {
    const initialState = {
      posts: mockPosts,
      selectedPost: null,
      status: 'succeeded',
      error: null,
    };
    
    // Search for something that doesn't exist
    const result = postsReducer(
      initialState,
      searchPosts('xyzabc123')
    );
    
    // Should return empty array
    expect(result.posts.length).toBe(0);
  });
  
  /**
   * Test searchPosts with empty string
   * 
   * When search is cleared:
   * - All posts should be shown again
   */
  test('should handle searchPosts with empty string', () => {
    const initialState = {
      posts: [mockPosts[0]], // Only one post from previous search
      selectedPost: null,
      status: 'succeeded',
      error: null,
    };
    
    // Clear search (empty string)
    const result = postsReducer(
      initialState,
      searchPosts('')
    );
    
    // Should show all posts again
    expect(result.posts.length).toBe(8);
  });
});
