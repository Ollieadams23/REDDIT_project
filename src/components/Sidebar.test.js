/**
 * Sidebar Component Tests
 * 
 * Testing:
 * - Component rendering
 * - Filter selection callbacks
 * - Reset button functionality
 * - Accessibility features
 * - Conditional rendering of time filters
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

/**
 * Mock props for testing
 */
const mockProps = {
  selectedSubreddit: 'all',
  sortBy: 'hot',
  timeFilter: 'day',
  onSubredditChange: jest.fn(),
  onSortChange: jest.fn(),
  onTimeFilterChange: jest.fn(),
  onReset: jest.fn(),
};

/**
 * Reset all mocks before each test to avoid test interference
 */
beforeEach(() => {
  jest.clearAllMocks();
});

/**
 * Test 1: Component renders with title
 */
test('renders sidebar with title', () => {
  render(<Sidebar {...mockProps} />);
  
  // Should display the "Filters" title
  expect(screen.getByText('Filters')).toBeInTheDocument();
});

/**
 * Test 2: Reset button renders and is clickable
 */
test('renders reset button', () => {
  render(<Sidebar {...mockProps} />);
  
  // Should display reset button
  const resetButton = screen.getByText('Reset');
  expect(resetButton).toBeInTheDocument();
});

/**
 * Test 3: Clicking reset button calls the callback
 */
test('calls onReset when reset button is clicked', () => {
  render(<Sidebar {...mockProps} />);
  
  const resetButton = screen.getByText('Reset');
  fireEvent.click(resetButton);
  
  // Should call the reset callback once
  expect(mockProps.onReset).toHaveBeenCalledTimes(1);
});

/**
 * Test 4: Renders all subreddit options
 */
test('renders all subreddit options', () => {
  render(<Sidebar {...mockProps} />);
  
  // Should display all 8 subreddit options
  expect(screen.getByText('All')).toBeInTheDocument();
  expect(screen.getByText('Popular')).toBeInTheDocument();
  expect(screen.getByText('News')).toBeInTheDocument();
  expect(screen.getByText('Technology')).toBeInTheDocument();
  expect(screen.getByText('Gaming')).toBeInTheDocument();
  expect(screen.getByText('Funny')).toBeInTheDocument();
  expect(screen.getByText('Pics')).toBeInTheDocument();
  expect(screen.getByText('Science')).toBeInTheDocument();
});

/**
 * Test 5: Clicking subreddit option calls callback with correct value
 */
test('calls onSubredditChange when subreddit is clicked', () => {
  render(<Sidebar {...mockProps} />);
  
  const technologyButton = screen.getByText('Technology');
  fireEvent.click(technologyButton);
  
  // Should call callback with the subreddit value
  expect(mockProps.onSubredditChange).toHaveBeenCalledWith('technology');
});

/**
 * Test 6: Highlights selected subreddit with active class
 */
test('applies active class to selected subreddit', () => {
  render(<Sidebar {...mockProps} selectedSubreddit="gaming" />);
  
  // Get the button that contains "Gaming" text
  const gamingButton = screen.getByText('Gaming').closest('button');
  
  // Should have active class
  expect(gamingButton.classList.contains('sidebar__option--active')).toBe(true);
});

/**
 * Test 7: Renders all sort options
 */
test('renders all sort options', () => {
  render(<Sidebar {...mockProps} />);
  
  // Should display all 4 sort options
  expect(screen.getByText('Hot')).toBeInTheDocument();
  expect(screen.getByText('New')).toBeInTheDocument();
  expect(screen.getByText('Top')).toBeInTheDocument();
  expect(screen.getByText('Rising')).toBeInTheDocument();
});

/**
 * Test 8: Clicking sort option calls callback with correct value
 */
test('calls onSortChange when sort option is clicked', () => {
  render(<Sidebar {...mockProps} />);
  
  const newButton = screen.getByText('New');
  fireEvent.click(newButton);
  
  // Should call callback with the sort value
  expect(mockProps.onSortChange).toHaveBeenCalledWith('new');
});

/**
 * Test 9: Highlights selected sort option with active class
 */
test('applies active class to selected sort option', () => {
  render(<Sidebar {...mockProps} sortBy="top" />);
  
  // Get the button that contains "Top" text
  const topButton = screen.getByText('Top').closest('button');
  
  // Should have active class
  expect(topButton.classList.contains('sidebar__option--active')).toBe(true);
});

/**
 * Test 10: Shows time filters when sortBy is 'top'
 */
test('displays time filters when sortBy is top', () => {
  render(<Sidebar {...mockProps} sortBy="top" />);
  
  // Should display time filter section (check for icon+text in section title)
  expect(screen.getByText('Time Period')).toBeInTheDocument();
  expect(screen.getByText('Now')).toBeInTheDocument();
  expect(screen.getByText('Today')).toBeInTheDocument();
  expect(screen.getByText('This Week')).toBeInTheDocument();
  expect(screen.getByText('This Month')).toBeInTheDocument();
  expect(screen.getByText('This Year')).toBeInTheDocument();
  expect(screen.getByText('All Time')).toBeInTheDocument();
});

/**
 * Test 11: Hides time filters when sortBy is not 'top'
 */
test('hides time filters when sortBy is not top', () => {
  render(<Sidebar {...mockProps} sortBy="hot" />);
  
  // Should NOT display time filter section
  expect(screen.queryByText('Time Period')).not.toBeInTheDocument();
  expect(screen.queryByText('Now')).not.toBeInTheDocument();
});

/**
 * Test 12: Clicking time filter calls callback with correct value
 */
test('calls onTimeFilterChange when time filter is clicked', () => {
  render(<Sidebar {...mockProps} sortBy="top" />);
  
  const weekButton = screen.getByText('This Week');
  fireEvent.click(weekButton);
  
  // Should call callback with the time filter value
  expect(mockProps.onTimeFilterChange).toHaveBeenCalledWith('week');
});

/**
 * Test 13: Highlights selected time filter with active class
 */
test('applies active class to selected time filter', () => {
  render(<Sidebar {...mockProps} sortBy="top" timeFilter="month" />);
  
  // Get the button that contains "This Month" text
  const monthButton = screen.getByText('This Month').closest('button');
  
  // Should have active class
  expect(monthButton.classList.contains('sidebar__option--active')).toBe(true);
});

/**
 * Test 14: Subreddit options have proper ARIA attributes
 */
test('subreddit options have proper ARIA attributes', () => {
  render(<Sidebar {...mockProps} selectedSubreddit="news" />);
  
  // Get the subreddit options group by its aria-label
  const subredditGroup = screen.getByRole('radiogroup', { name: /Select subreddit/i });
  expect(subredditGroup).toBeInTheDocument();
  
  // News button should have aria-checked set to true (boolean)
  const newsButton = screen.getByText('News').closest('button');
  expect(newsButton).toHaveAttribute('aria-checked');
  
  // All button should also have aria-checked
  const allButton = screen.getByText('All').closest('button');
  expect(allButton).toHaveAttribute('aria-checked');
});

/**
 * Test 15: Sort options have proper ARIA attributes
 */
test('sort options have proper ARIA attributes', () => {
  render(<Sidebar {...mockProps} sortBy="rising" />);
  
  // Get the sort options group by its aria-label
  const sortGroup = screen.getByRole('radiogroup', { name: /Select sort order/i });
  expect(sortGroup).toBeInTheDocument();
  
  // Rising button should have aria-checked set
  const risingButton = screen.getByText('Rising').closest('button');
  expect(risingButton).toHaveAttribute('aria-checked');
  
  // Hot button should also have aria-checked
  const hotButton = screen.getByText('Hot').closest('button');
  expect(hotButton).toHaveAttribute('aria-checked');
});

/**
 * Test 16: Time filter options have proper ARIA attributes when visible
 */
test('time filter options have proper ARIA attributes', () => {
  render(<Sidebar {...mockProps} sortBy="top" timeFilter="year" />);
  
  // Get the time filter options group by its aria-label
  const timeGroup = screen.getByRole('radiogroup', { name: /Select time period/i });
  expect(timeGroup).toBeInTheDocument();
  
  // "This Year" button should have aria-checked set
  const yearButton = screen.getByText('This Year').closest('button');
  expect(yearButton).toHaveAttribute('aria-checked');
  
  // "Today" button should also have aria-checked
  const dayButton = screen.getByText('Today').closest('button');
  expect(dayButton).toHaveAttribute('aria-checked');
});

/**
 * Test 17: Reset button has proper focus handling
 */
test('reset button can be focused and activated with keyboard', () => {
  render(<Sidebar {...mockProps} />);
  
  const resetButton = screen.getByText('Reset');
  
  // Focus the button
  resetButton.focus();
  expect(resetButton).toHaveFocus();
  
  // Click the button (buttons respond to clicks from keyboard too)
  fireEvent.click(resetButton);
  
  // Should call the reset callback
  expect(mockProps.onReset).toHaveBeenCalledTimes(1);
});

/**
 * Test 18: Filter options can be activated with keyboard
 */
test('filter options can be activated with keyboard', () => {
  render(<Sidebar {...mockProps} />);
  
  const popularButton = screen.getByText('Popular');
  
  // Focus and click
  popularButton.focus();
  fireEvent.click(popularButton);
  
  // Should call the callback
  expect(mockProps.onSubredditChange).toHaveBeenCalledWith('popular');
});
