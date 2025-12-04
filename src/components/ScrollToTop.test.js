/**
 * ScrollToTop Component Tests
 * 
 * Tests for the scroll-to-top button functionality
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

  it('should show button when scrolled down', async () => {
    render(<ScrollToTop />);
    
    // Simulate scrolling down
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: 400,
      });
      
      // Trigger scroll event
      fireEvent.scroll(window);
    });
    
    // Wait for throttled state update
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /scroll to top/i });
      expect(button).toBeInTheDocument();
    });
  });

  it('should scroll to top when clicked', async () => {
    render(<ScrollToTop />);
    
    // Scroll down
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: 500,
      });
      fireEvent.scroll(window);
    });
    
    // Wait for button to appear and click it
    await waitFor(async () => {
      const button = screen.getByRole('button', { name: /scroll to top/i });
      fireEvent.click(button);
      
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  it('should have proper accessibility attributes', async () => {
    render(<ScrollToTop />);
    
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        writable: true,
        value: 400,
      });
      fireEvent.scroll(window);
    });
    
    await waitFor(() => {
      const button = screen.getByRole('button', { name: /scroll to top/i });
      expect(button).toHaveAttribute('aria-label', 'Scroll to top');
    });
  });
});
