/**
 * SearchBar Component
 * 
 * A reusable search input component that:
 * - Accepts user input for searching posts
 * - Debounces input (waits for user to stop typing)
 * - Calls onChange callback with search term
 * - Has a clear button to reset search
 * - Is fully accessible
 * 
 * Props:
 * - value: Current search term (controlled component)
 * - onChange: Function called when search term changes
 * - placeholder: Placeholder text (optional)
 * 
 * Why debounce?
 * If we search on every keystroke, it's too many searches.
 * Debouncing waits until the user stops typing (300ms)
 * before triggering the search.
 */

import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search posts...' }) => {
  // Local state for the input value
  // This allows us to debounce before calling onChange
  const [inputValue, setInputValue] = useState(value);

  /**
   * Debounce effect
   * 
   * When inputValue changes, wait 300ms before calling onChange.
   * If user types again within 300ms, reset the timer.
   * 
   * This prevents excessive searches while typing.
   */
  useEffect(() => {
    // Set a timer to call onChange after 300ms
    const timeoutId = setTimeout(() => {
      // Only call onChange if value actually changed
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, 300);

    // Cleanup function: clear the timer if component unmounts
    // or if inputValue changes again (user is still typing)
    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, onChange, value]);

  /**
   * Sync local state with prop value
   * 
   * If parent component changes the value prop
   * (e.g., user clicks "Clear All Filters"),
   * update our local state to match
   */
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  /**
   * Handle clear button click
   * Reset search to empty string
   */
  const handleClear = () => {
    setInputValue('');
    onChange(''); // Immediately clear (don't wait for debounce)
  };

  /**
   * Handle form submit
   * Prevent page reload and trigger search immediately
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger search immediately on submit
    onChange(inputValue);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar__container">
        {/* Search icon */}
        <span className="search-bar__icon" aria-hidden="true">
          🔍
        </span>

        {/* Search input */}
        <input
          type="text"
          className="search-bar__input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-label="Search Reddit posts"
        />

        {/* Clear button - only show if there's text */}
        {inputValue && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
