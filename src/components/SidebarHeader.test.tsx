import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarHeader } from './SidebarHeader';

describe('SidebarHeader', () => {
  it('renders correctly', () => {
    render(<SidebarHeader />);
    expect(screen.getByTitle(/Settings/i)).toBeInTheDocument();
  });

  it('toggles theme when button is clicked', () => {
    render(<SidebarHeader />);
    const toggleButton = screen.getByTitle(/Switch to/i);
    const initialTitle = toggleButton.getAttribute('title');
    
    fireEvent.click(toggleButton);
    
    const newTitle = toggleButton.getAttribute('title');
    expect(newTitle).not.toBe(initialTitle);
    
    if (initialTitle?.includes('Dark')) {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    } else {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    }
  });
});
