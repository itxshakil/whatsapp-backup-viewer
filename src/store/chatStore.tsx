import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Message, ChatMetadata } from '../types/message';
import { db, SavedChat } from './db';

interface ChatContextType {
  messages: Message[];
  metadata: ChatMetadata | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setChatData: (messages: Message[], metadata: ChatMetadata, shouldSave?: boolean) => Promise<void>;
  clearChat: () => void;
  savedChats: SavedChat[];
  loadChat: (id: number) => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  saveCurrentChat: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);

  // Load saved chats from IndexedDB on mount
  useEffect(() => {
    refreshSavedChats();
  }, []);

  const refreshSavedChats = async () => {
    try {
      const chats = await db.chats.orderBy('lastOpened').reverse().toArray();
      setSavedChats(chats);
    } catch (err) {
      console.error('Failed to load saved chats:', err);
    }
  };

  const setChatData = useCallback(async (newMessages: Message[], newMetadata: ChatMetadata, shouldSave = false) => {
    setMessages(newMessages);
    setMetadata(newMetadata);
    setSearchQuery(''); // Reset search on new upload
    setError(null);

    if (shouldSave) {
      try {
        const existing = await db.chats.where('metadata.fileName').equals(newMetadata.fileName).first();
        if (existing?.id) {
          await db.chats.update(existing.id, {
            messages: newMessages,
            metadata: newMetadata,
            lastOpened: Date.now()
          });
        } else {
          await db.chats.add({
            messages: newMessages,
            metadata: newMetadata,
            lastOpened: Date.now()
          });
        }
        await refreshSavedChats();
      } catch (err) {
        console.error('Failed to auto-save chat:', err);
      }
    }
  }, []);

  const saveCurrentChat = useCallback(async () => {
    // Note: We use the current state here. In a useCallback, we need to be careful about stale closures.
    // However, since we want to save WHATEVER is currently in state when this is called, 
    // it's actually better to use functional updates or refs if we want to avoid deps.
    // But for this simple app, adding messages/metadata to deps is fine.
    if (!metadata || messages.length === 0) return;

    try {
      const existing = await db.chats.where('metadata.fileName').equals(metadata.fileName).first();
      
      if (existing?.id) {
        await db.chats.update(existing.id, {
          messages,
          metadata,
          lastOpened: Date.now()
        });
      } else {
        await db.chats.add({
          messages,
          metadata,
          lastOpened: Date.now()
        });
      }
      await refreshSavedChats();
    } catch (err) {
      console.error('Failed to save chat:', err);
      setError('Failed to save chat to database.');
    }
  }, [metadata, messages]);

  const loadChat = async (id: number) => {
    try {
      const chat = await db.chats.get(id);
      if (chat) {
        setMessages(chat.messages);
        setMetadata(chat.metadata);
        setSearchQuery('');
        setError(null);
        
        // Update last opened
        await db.chats.update(id, { lastOpened: Date.now() });
        refreshSavedChats();
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
      setError('Failed to load chat from database.');
    }
  };

  const deleteChat = async (id: number) => {
    try {
      await db.chats.delete(id);
      if (metadata && savedChats.find(c => c.id === id)?.metadata.fileName === metadata.fileName) {
        clearChat();
      }
      refreshSavedChats();
    } catch (err) {
      console.error('Failed to delete chat:', err);
      setError('Failed to delete chat.');
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMetadata(null);
    setSearchQuery('');
    setError(null);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      metadata, 
      searchQuery, 
      setSearchQuery, 
      error, 
      setError, 
      setChatData, 
      clearChat,
      savedChats,
      loadChat,
      deleteChat,
      saveCurrentChat
    }}>
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
