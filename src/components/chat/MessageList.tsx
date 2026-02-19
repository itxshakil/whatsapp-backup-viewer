import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { MessageBubble } from './MessageBubble';
import { Message } from '../../types/message';
import dayjs from 'dayjs';
import { useChatStore } from '../../store/chatStore';
import { useSearch } from '../../hooks/useSearch';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = React.memo(({ messages }) => {
  const { searchQuery } = useChatStore();
  const filteredMessages = useSearch(messages, searchQuery);

  const data = useMemo(() => {
    const result: any[] = [];
    filteredMessages.forEach((message: any, index: number) => {
      const prevMessage = index > 0 ? filteredMessages[index - 1] : null;

      // Date grouping logic
      const currentDate = dayjs(message.timestamp).startOf('day');
      const prevDate = prevMessage ? dayjs(prevMessage.timestamp).startOf('day') : null;
      const showDateHeader = !prevDate || !currentDate.isSame(prevDate);

      if (showDateHeader) {
        let dateLabel = currentDate.format('MMMM D, YYYY');
        const today = dayjs().startOf('day');
        const yesterday = dayjs().subtract(1, 'day').startOf('day');

        if (currentDate.isSame(today)) {
          dateLabel = 'TODAY';
        } else if (currentDate.isSame(yesterday)) {
          dateLabel = 'YESTERDAY';
        }
        
        result.push({
          type: 'date-header',
          id: `date-${currentDate.format('YYYY-MM-DD')}`,
          label: dateLabel,
          dateKey: currentDate.format('YYYY-MM-DD')
        });
      }

      // Consecutive message grouping logic
      const isSameSenderAsPrev = prevMessage && prevMessage.sender === message.sender && prevMessage.type !== 'system' && message.type !== 'system';
      
      // Only show sender if it's the first message in a group from that sender or date changed
      const showSender = !isSameSenderAsPrev || showDateHeader;
      
      // WhatsApp: show tail on the FIRST message of a group (top-aligned)
      const showTail = !isSameSenderAsPrev || showDateHeader;

      // Check if next message is from same sender to add some spacing if it's not
      const nextMessage = index < filteredMessages.length - 1 ? filteredMessages[index + 1] : null;
      const isLastInGroup = !nextMessage || nextMessage.sender !== message.sender || nextMessage.type === 'system' || message.type === 'system';
      
      const marginBottom = isLastInGroup ? 'mb-4' : 'mb-0.5';

      result.push({
        type: 'message',
        id: message.id,
        message,
        showSender,
        showTail,
        marginBottom
      });
    });
    return result;
  }, [filteredMessages]);

  if (filteredMessages.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-[#8696a0]">
        <p>No messages found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={data}
      initialTopMostItemIndex={data.length - 1}
      followOutput="smooth"
      itemContent={(index, item) => {
        if (item.type === 'date-header') {
          return (
            <div 
              id={item.id}
              className="flex justify-center my-4 sticky top-2 z-10 pointer-events-none"
            >
              <div className="bg-white/90 dark:bg-[#182229]/90 backdrop-blur-sm dark:text-[#8696a0] text-gray-600 text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm uppercase pointer-events-auto">
                {item.label}
              </div>
            </div>
          );
        }
        return (
          <div className="px-2 md:px-16 lg:px-24 max-w-full">
            <MessageBubble 
              message={item.message} 
              showSender={item.showSender}
              showTail={item.showTail}
              className={item.marginBottom}
            />
          </div>
        );
      }}
    />
  );
});
