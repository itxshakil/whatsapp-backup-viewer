import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Message } from '@/types/message';

export interface GroupedItem {
  type: 'date-header' | 'message';
  id: string;
  label?: string;
  dateKey?: string;
  message?: Message;
  showSender?: boolean;
  showTail?: boolean;
  marginBottom?: string;
  virtuosoIndex: number;
}

export const useGroupedMessages = (messages: Message[]) => {
  return useMemo(() => {
    const result: GroupedItem[] = [];
    
    messages.forEach((message, index) => {
      const prevMessage = index > 0 ? messages[index - 1] : null;

      const currentDate = dayjs(message.timestamp).startOf('day');
      const prevDate = prevMessage ? dayjs(prevMessage.timestamp).startOf('day') : null;
      const isFirstOfDate = !prevDate || !currentDate.isSame(prevDate);

      if (isFirstOfDate) {
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
          dateKey: currentDate.format('YYYY-MM-DD'),
          virtuosoIndex: result.length
        });
      }

      const isSameSenderAsPrev = prevMessage && 
                               prevMessage.sender === message.sender && 
                               prevMessage.type !== 'system' && 
                               message.type !== 'system';
      
      const showSender = !isSameSenderAsPrev || isFirstOfDate;
      const showTail = !isSameSenderAsPrev || isFirstOfDate;

      const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
      const isLastInGroup = !nextMessage || 
                           nextMessage.sender !== message.sender || 
                           nextMessage.type === 'system' || 
                           message.type === 'system';
      
      const marginBottom = isLastInGroup ? 'mb-2' : 'mb-0';

      result.push({
        type: 'message',
        id: message.id,
        message,
        showSender,
        showTail,
        marginBottom,
        virtuosoIndex: result.length
      });
    });
    
    return result;
  }, [messages]);
};
