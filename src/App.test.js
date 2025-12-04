/**
 * App Component Tests
 * 
 * Testing the main App component with Redux integration
 * Updated to mock Reddit API calls
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import postsReducer from './features/posts/postsSlice';
import filtersReducer from './features/filters/filtersSlice';
import * as redditAPI from './services/redditAPI';

// Mock the Reddit API module
jest.mock('./services/redditAPI');

/**
 * Helper function to render App with Redux store
 */
const renderWithRedux = (component) => {
  const store = configureStore({
    reducer: {
      posts: postsReducer,
      filters: filtersReducer,
    },
  });
  
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

/**
 * Setup: Mock API responses before each test
 */
beforeEach(() => {
  // Mock successful API response with empty posts
  redditAPI.fetchSubredditPosts.mockResolvedValue({
    posts: [],
    after: null,
  });
  
  redditAPI.searchPosts.mockResolvedValue({
    posts: [],
    after: null,
  });
  
  redditAPI.fetchPostWithComments.mockResolvedValue({
    post: {},
    comments: [],
  });
});

/**
 * Cleanup: Clear mocks after each test
 */
afterEach(() => {
  jest.clearAllMocks();
});

/**
 * Test 1: App renders with header
 */
test('renders app header', () => {
  renderWithRedux(<App />);
  
  // Should display the Reddit Client title
  const header = screen.getByText(/Reddit Client/i);
  expect(header).toBeInTheDocument();
});
