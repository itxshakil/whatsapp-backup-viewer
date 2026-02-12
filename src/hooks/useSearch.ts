import { useMemo } from 'react';
import { Message } from '../types/message';

export const useSearch = (messages: Message[], query: string) => {
  const filteredMessages = useMemo(() => {
    if (!query.trim()) return messages;
    
    const lowerQuery = query.toLowerCase();
    return messages.filter(
      (m) =>
        (m.type === 'text' || m.type === 'system' || m.type === 'document') &&
        (m.content.toLowerCase().includes(lowerQuery) ||
         m.sender.toLowerCase().includes(lowerQuery))
    );
  }, [messages, query]);

  return filteredMessages;
};
