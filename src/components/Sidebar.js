/**
 * Sidebar Component
 * 
 * A sidebar with filter controls for:
 * - Subreddit selection (Popular, News, Technology, etc.)
 * - Sort order (Hot, New, Top, Rising)
 * - Time filter (Hour, Day, Week, Month, Year, All Time)
 * 
 * Props:
 * - selectedSubreddit: Currently selected subreddit
 * - onSubredditChange: Callback when subreddit changes
 * - sortBy: Current sort order
 * - onSortChange: Callback when sort changes
 * - timeFilter: Current time filter
 * - onTimeFilterChange: Callback when time filter changes
 * - onReset: Callback to reset all filters
 * 
 * Why separate callbacks?
 * - Each filter is independent
 * - Parent has full control over state
 * - Easy to test each filter separately
 */

import React from 'react';
import './Sidebar.css';

const Sidebar = ({
  selectedSubreddit,
  onSubredditChange,
  sortBy,
  onSortChange,
  timeFilter,
  onTimeFilterChange,
  onReset,
}) => {
  /**
   * List of popular subreddits to choose from
   * In a real app, this could come from an API or user's subscriptions
   */
  const subreddits = [
    { value: 'all', label: 'All', icon: '🌐' },
    { value: 'popular', label: 'Popular', icon: '🔥' },
    { value: 'news', label: 'News', icon: '📰' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'funny', label: 'Funny', icon: '😂' },
    { value: 'pics', label: 'Pics', icon: '📷' },
    { value: 'science', label: 'Science', icon: '🔬' },
  ];

  /**
   * Sort options
   */
  const sortOptions = [
    { value: 'hot', label: 'Hot', icon: '🔥' },
    { value: 'new', label: 'New', icon: '🆕' },
    { value: 'top', label: 'Top', icon: '⬆️' },
    { value: 'rising', label: 'Rising', icon: '📈' },
  ];

  /**
   * Time filter options (only relevant when sortBy is 'top')
   */
  const timeOptions = [
    { value: 'hour', label: 'Now' },
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <aside className="sidebar" aria-label="Filter options">
      {/* Filter header with reset button */}
      <div className="sidebar__header">
        <h3 className="sidebar__title">Filters</h3>
        <button
          className="sidebar__reset-btn"
          onClick={onReset}
          aria-label="Reset all filters"
        >
          Reset
        </button>
      </div>

      {/* Subreddit Filter Section */}
      <section className="sidebar__section">
        <h4 className="sidebar__section-title">
          <span className="sidebar__section-icon">📂</span>
          Subreddits
        </h4>
        
        <div className="sidebar__options" role="radiogroup" aria-label="Select subreddit">
          {subreddits.map((subreddit) => (
            <button
              key={subreddit.value}
              className={`sidebar__option ${
                selectedSubreddit === subreddit.value ? 'sidebar__option--active' : ''
              }`}
              onClick={() => onSubredditChange(subreddit.value)}
              role="radio"
              aria-checked={selectedSubreddit === subreddit.value}
            >
              <span className="sidebar__option-icon">{subreddit.icon}</span>
              <span className="sidebar__option-label">{subreddit.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Sort By Section */}
      <section className="sidebar__section">
        <h4 className="sidebar__section-title">
          <span className="sidebar__section-icon">🔽</span>
          Sort By
        </h4>
        
        <div className="sidebar__options" role="radiogroup" aria-label="Select sort order">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`sidebar__option ${
                sortBy === option.value ? 'sidebar__option--active' : ''
              }`}
              onClick={() => onSortChange(option.value)}
              role="radio"
              aria-checked={sortBy === option.value}
            >
              <span className="sidebar__option-icon">{option.icon}</span>
              <span className="sidebar__option-label">{option.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Time Filter Section - Only show when sortBy is 'top' */}
      {sortBy === 'top' && (
        <section className="sidebar__section">
          <h4 className="sidebar__section-title">
            <span className="sidebar__section-icon">⏱️</span>
            Time Period
          </h4>
          
          <div className="sidebar__options" role="radiogroup" aria-label="Select time period">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                className={`sidebar__option ${
                  timeFilter === option.value ? 'sidebar__option--active' : ''
                }`}
                onClick={() => onTimeFilterChange(option.value)}
                role="radio"
                aria-checked={timeFilter === option.value}
              >
                <span className="sidebar__option-label">{option.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};

export default Sidebar;
