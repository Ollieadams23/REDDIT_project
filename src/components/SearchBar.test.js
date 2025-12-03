/**
 * Tests for SearchBar Component
 * 
 * What are we testing?
 * - Component renders correctly
 * - Input value updates
 * - onChange callback is called (with debounce)
 * - Clear button works
 * - Form submission works
 * - Accessibility features
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

/**
 * Test Suite for SearchBar Component
 */
describe('SearchBar', () => {
  const mockOnChange = jest.fn();

  /**
   * Reset mocks before each test
   */
  beforeEach(() => {
    mockOnChange.mockClear();
    jest.clearAllTimers();
  });

  /**
   * Test: Component renders without crashing
   */
  test('renders without crashing', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
  });

  /**
   * Test: Displays placeholder text
   */
  test('displays placeholder text', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Search posts...');
    expect(input).toBeInTheDocument();
  });

  /**
   * Test: Displays custom placeholder
   */
  test('displays custom placeholder when provided', () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder="Find something..."
      />
    );
    
    const input = screen.getByPlaceholderText('Find something...');
    expect(input).toBeInTheDocument();
  });

  /**
   * Test: Displays current value
   */
  test('displays current value', () => {
    render(<SearchBar value="test search" onChange={mockOnChange} />);
    
    const input = screen.getByDisplayValue('test search');
    expect(input).toBeInTheDocument();
  });

  /**
   * Test: Updates input value when user types
   */
  test('updates input value when user types', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox', { name: /search reddit posts/i });
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'sunset' } });
    
    // Input should show the typed text
    expect(input.value).toBe('sunset');
  });

  /**
   * Test: Debounces onChange callback
   * 
   * onChange should NOT be called immediately
   * It should wait 300ms after user stops typing
   */
  test('debounces onChange callback', async () => {
    jest.useFakeTimers();
    
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox', { name: /search reddit posts/i });
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'test' } });
    
    // onChange should NOT be called immediately
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Fast-forward time by 300ms
    jest.advanceTimersByTime(300);
    
    // Now onChange should have been called
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
    
    jest.useRealTimers();
  });

  /**
   * Test: Debounce resets if user keeps typing
   * 
   * If user types multiple characters quickly,
   * onChange should only be called once (after they stop)
   */
  test('resets debounce timer when user continues typing', async () => {
    jest.useFakeTimers();
    
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox', { name: /search reddit posts/i });
    
    // Type 's'
    fireEvent.change(input, { target: { value: 's' } });
    
    // Wait 200ms (not enough to trigger debounce)
    jest.advanceTimersByTime(200);
    
    // Type 'u' (continuing to type)
    fireEvent.change(input, { target: { value: 'su' } });
    
    // Wait another 200ms
    jest.advanceTimersByTime(200);
    
    // onChange should NOT have been called yet
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Wait 100ms more (total 300ms since last keystroke)
    jest.advanceTimersByTime(100);
    
    // NOW onChange should be called with final value
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('su');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
    
    jest.useRealTimers();
  });

  /**
   * Test: Clear button is visible when there's text
   */
  test('shows clear button when input has text', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  /**
   * Test: Clear button is hidden when input is empty
   */
  test('hides clear button when input is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  /**
   * Test: Clear button clears the input
   */
  test('clear button clears the input and calls onChange', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    const clearButton = screen.getByLabelText('Clear search');
    
    // Click the clear button
    fireEvent.click(clearButton);
    
    // onChange should be called with empty string
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  /**
   * Test: Form submission triggers onChange immediately
   * 
   * When user presses Enter, don't wait for debounce
   */
  test('form submission triggers onChange immediately', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox', { name: /search reddit posts/i });
    
    // Type in the input
    fireEvent.change(input, { target: { value: 'immediate search' } });
    
    // Submit the form (press Enter)
    fireEvent.submit(input.closest('form'));
    
    // onChange should be called immediately (not debounced)
    expect(mockOnChange).toHaveBeenCalledWith('immediate search');
  });

  /**
   * Test: Form submission prevents page reload
   */
  test('form submission prevents default behavior', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const form = screen.getByRole('textbox').closest('form');
    
    // Create a mock event
    const event = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    
    // Submit the form
    form.dispatchEvent(event);
    
    // preventDefault should have been called
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  /**
   * Test: Input has proper ARIA label
   */
  test('has proper ARIA label for accessibility', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByLabelText('Search Reddit posts');
    expect(input).toBeInTheDocument();
  });

  /**
   * Test: Clear button has proper ARIA label
   */
  test('clear button has proper ARIA label', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  /**
   * Test: Updates when value prop changes
   * 
   * If parent component changes the value,
   * SearchBar should update its display
   */
  test('updates input when value prop changes', () => {
    const { rerender } = render(
      <SearchBar value="initial" onChange={mockOnChange} />
    );
    
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('initial');
    
    // Parent changes the value
    rerender(<SearchBar value="updated" onChange={mockOnChange} />);
    
    // Input should show new value
    expect(input.value).toBe('updated');
  });
});
