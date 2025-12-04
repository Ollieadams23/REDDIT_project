/**
 * ScrollToTop Component Tests
 * 
 * Tests for the scroll-to-top button functionality
 */

import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToTop from './ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    // Mock window.pageYOffset
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not show button when page is at top', () => {
    render(<ScrollToTop />);
    
    const button = screen.queryByRole('button', { name: /scroll to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it('should show button when scrolled down', () => {
    render(<ScrollToTop />);
    
    // Simulate scrolling down
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 400,
    });
    
    // Trigger scroll event
    fireEvent.scroll(window);
    
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button).toBeInTheDocument();
  });

  it('should scroll to top when clicked', () => {
    render(<ScrollToTop />);
    
    // Scroll down
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 500,
    });
    fireEvent.scroll(window);
    
    // Click button
    const button = screen.getByRole('button', { name: /scroll to top/i });
    fireEvent.click(button);
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should have proper accessibility attributes', () => {
    render(<ScrollToTop />);
    
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 400,
    });
    fireEvent.scroll(window);
    
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button).toHaveAttribute('aria-label', 'Scroll to top');
  });
});
