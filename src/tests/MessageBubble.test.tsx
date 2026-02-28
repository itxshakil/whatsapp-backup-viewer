import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatProvider } from '@/store/chatStore';
import { Message } from '@/types/message';

const mockMessage: Message = {
  id: '1',
  timestamp: new Date('2023-01-01T10:00:00'),
  sender: 'Alice',
  content: 'Hello World',
  type: 'text',
  isCurrentUser: false,
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <ChatProvider>
      {ui}
    </ChatProvider>
  );
};

describe('MessageBubble', () => {
  it('renders message content', () => {
    renderWithProvider(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders sender name when showSender is true', () => {
    renderWithProvider(<MessageBubble message={mockMessage} showSender={true} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('hides sender name when showSender is false', () => {
    renderWithProvider(<MessageBubble message={mockMessage} showSender={false} />);
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('renders system message correctly', () => {
    const systemMsg: Message = { ...mockMessage, type: 'system', content: 'System Alert' };
    renderWithProvider(<MessageBubble message={systemMsg} />);
    expect(screen.getByText('System Alert')).toBeInTheDocument();
    // System messages usually don't show sender
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('applies correct classes for current user', () => {
    const myMsg: Message = { ...mockMessage, isCurrentUser: true };
    const { container } = renderWithProvider(<MessageBubble message={myMsg} />);
    const bubbleWrapper = container.firstChild?.firstChild;
    expect(bubbleWrapper).toHaveClass('bg-wa-my-bubble');
  });
});
