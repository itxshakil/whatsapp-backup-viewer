import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/chat/SearchBar';
import { ChatProvider, useChatStore } from '../store/chatStore';

const TestComponent = () => {
  const { searchQuery } = useChatStore();
  return (
    <>
      <SearchBar />
      <div data-testid="search-value">{searchQuery}</div>
    </>
  );
};

describe('SearchBar', () => {
  it('renders search input', () => {
    render(
      <ChatProvider>
        <SearchBar />
      </ChatProvider>
    );
    
    expect(screen.getByPlaceholderText(/search messages/i)).toBeInTheDocument();
  });

  it('updates search query on change', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    const input = screen.getByPlaceholderText(/search messages/i);
    fireEvent.change(input, { target: { value: 'hello' } });

    expect(screen.getByTestId('search-value')).toHaveTextContent('hello');
  });

  it('clears search query on X click', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    const input = screen.getByPlaceholderText(/search messages/i);
    fireEvent.change(input, { target: { value: 'hello' } });
    
    expect(screen.getByTestId('search-value')).toHaveTextContent('hello');

    const clearButton = screen.getByRole('button');
    fireEvent.click(clearButton);

    expect(screen.getByTestId('search-value')).toHaveTextContent('');
    expect(input).toHaveValue('');
  });
});
