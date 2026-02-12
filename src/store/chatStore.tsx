import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, ChatMetadata } from '../types/message';

interface ChatContextType {
  messages: Message[];
  metadata: ChatMetadata | null;
  setChatData: (messages: Message[], metadata: ChatMetadata) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);

  const setChatData = (newMessages: Message[], newMetadata: ChatMetadata) => {
    setMessages(newMessages);
    setMetadata(newMetadata);
  };

  const clearChat = () => {
    setMessages([]);
    setMetadata(null);
  };

  return (
    <ChatContext.Provider value={{ messages, metadata, setChatData, clearChat }}>
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
