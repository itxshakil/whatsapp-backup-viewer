import React from 'react';
import { MessageBubble } from './MessageBubble';
import { Message } from '../types/message';
import dayjs from 'dayjs';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex flex-col px-4 py-4 md:px-16 lg:px-24">
      {messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        // Date grouping logic
        const currentDate = dayjs(message.timestamp).startOf('day');
        const prevDate = prevMessage ? dayjs(prevMessage.timestamp).startOf('day') : null;
        const showDateHeader = !prevDate || !currentDate.isSame(prevDate);

        // Consecutive message grouping logic
        const isSameSenderAsPrev = prevMessage && prevMessage.sender === message.sender && prevMessage.type !== 'system' && message.type !== 'system';
        const isSameSenderAsNext = nextMessage && nextMessage.sender === message.sender && nextMessage.type !== 'system' && message.type !== 'system';
        
        // Only show sender if it's the first message in a group from that sender
        const showSender = !isSameSenderAsPrev || showDateHeader;
        
        // Only show tail if it's the first message in a group from that sender
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
              <div className="flex justify-center my-4 sticky top-2 z-10 pointer-events-none">
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
      })}
    </div>
  );
};
