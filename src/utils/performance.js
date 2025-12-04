/**
 * Performance Utilities
 * 
 * Helper functions for monitoring and optimizing app performance
 */

/**
 * Debounce function - delays execution until after a pause
 * Useful for search inputs, resize events, etc.
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution to once per time period
 * Useful for scroll events, window resize, etc.
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds between executions
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Measure component render time (for development)
 * 
 * @param {string} componentName - Name of component being measured
 * @param {Function} callback - Function to measure
 */
export const measureRender = (componentName, callback) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
    return result;
  }
  return callback();
};

/**
 * Check if element is in viewport (for lazy loading)
 * 
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Lazy load images - only load when in viewport
 * 
 * @param {string} imageUrl - URL of image to load
 * @param {HTMLElement} imgElement - Image element to populate
 */
export const lazyLoadImage = (imageUrl, imgElement) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        imgElement.src = imageUrl;
        observer.unobserve(imgElement);
      }
    });
  });
  
  observer.observe(imgElement);
};
