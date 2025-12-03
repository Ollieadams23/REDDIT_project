/**
 * App Component Tests
 * 
 * Testing the main App component with Redux integration
 */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import postsReducer from './features/posts/postsSlice';
import filtersReducer from './features/filters/filtersSlice';

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
 * Test 1: App renders with header
 */
test('renders app header', () => {
  renderWithRedux(<App />);
  
  // Should display the Reddit Client title
  const header = screen.getByText(/Reddit Client/i);
  expect(header).toBeInTheDocument();
});
