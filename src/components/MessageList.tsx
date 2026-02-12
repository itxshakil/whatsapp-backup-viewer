import React, { useMemo } from 'react';
import { MessageBubble } from './MessageBubble';
import { Message } from '../types/message';
import dayjs from 'dayjs';
import { useChatStore } from '../store/chatStore';
import { useSearch } from '../hooks/useSearch';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { searchQuery } = useChatStore();
  const filteredMessages = useSearch(messages, searchQuery);

  const renderedMessages = useMemo(() => {
    return filteredMessages.map((message, index) => {
      const prevMessage = index > 0 ? filteredMessages[index - 1] : null;

      // Date grouping logic
      const currentDate = dayjs(message.timestamp).startOf('day');
      const prevDate = prevMessage ? dayjs(prevMessage.timestamp).startOf('day') : null;
      const showDateHeader = !prevDate || !currentDate.isSame(prevDate);

      // Consecutive message grouping logic
      const isSameSenderAsPrev = prevMessage && prevMessage.sender === message.sender && prevMessage.type !== 'system' && message.type !== 'system';
      
      // Only show sender if it's the first message in a group from that sender or date changed
      const showSender = !isSameSenderAsPrev || showDateHeader;
      
      // Only show tail if it's the first message in a group from that sender or date changed
      const showTail = !isSameSenderAsPrev || showDateHeader;

      let dateLabel = currentDate.format('MMMM D, YYYY');
      const today = dayjs().startOf('day');
      const yesterday = dayjs().subtract(1, 'day').startOf('day');

      if (currentDate.isSame(today)) {
        dateLabel = 'TODAY';
      } else if (currentDate.isSame(yesterday)) {
        dateLabel = 'YESTERDAY';
      }

      return (
        <React.Fragment key={message.id}>
          {showDateHeader && (
            <div 
              id={`date-${currentDate.format('YYYY-MM-DD')}`}
              className="flex justify-center my-4 sticky top-2 z-10 pointer-events-none"
            >
              <div className="bg-white/90 dark:bg-[#182229]/90 backdrop-blur-sm dark:text-[#8696a0] text-gray-600 text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm uppercase pointer-events-auto">
                {dateLabel}
              </div>
            </div>
          )}
          <MessageBubble 
            message={message} 
            showSender={showSender}
            showTail={showTail}
          />
        </React.Fragment>
      );
    });
  }, [filteredMessages]);

  if (filteredMessages.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-[#8696a0]">
        <p>No messages found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2 py-4 md:px-16 lg:px-24 max-w-full">
      {renderedMessages}
    </div>
  );
};
