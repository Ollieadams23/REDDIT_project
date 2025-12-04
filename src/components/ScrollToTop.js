/**
 * ScrollToTop Button Component
 * 
 * Appears when user scrolls down the page
 * Smoothly scrolls back to top when clicked
 */

import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Show button when page is scrolled down 300px
   * Uses throttling to improve performance (only checks every 100ms)
   */
  useEffect(() => {
    let timeoutId = null;
    
    const toggleVisibility = () => {
      // Throttle: only run once per 100ms
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          if (window.pageYOffset > 300) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Smooth scroll to top of page
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
}

export default ScrollToTop;
