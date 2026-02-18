import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarHeader } from '../components/layout/SidebarHeader';
import { ChatProvider } from '../store/chatStore';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <ChatProvider>
      {ui}
    </ChatProvider>
  );
};

describe('SidebarHeader', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders correctly', () => {
    renderWithProvider(<SidebarHeader />);
    expect(screen.getByTitle(/About & Help/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Export as JSON/i)).toBeInTheDocument();
  });

  it('toggles theme when button is clicked', () => {
    renderWithProvider(<SidebarHeader />);
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
