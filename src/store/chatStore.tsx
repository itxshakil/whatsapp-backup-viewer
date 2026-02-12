import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, ChatMetadata } from '../types/message';

interface ChatContextType {
  messages: Message[];
  metadata: ChatMetadata | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setChatData: (messages: Message[], metadata: ChatMetadata) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const setChatData = (newMessages: Message[], newMetadata: ChatMetadata) => {
    setMessages(newMessages);
    setMetadata(newMetadata);
    setSearchQuery(''); // Reset search on new upload
  };

  const clearChat = () => {
    setMessages([]);
    setMetadata(null);
    setSearchQuery('');
  };

  return (
    <ChatContext.Provider value={{ messages, metadata, searchQuery, setSearchQuery, setChatData, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatStore = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatStore must be used within a ChatProvider');
  }
  return context;
};
