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
  clearAllData: () => Promise<void>;
  savedChats: SavedChat[];
  loadChat: (id: number) => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  saveCurrentChat: () => Promise<void>;
  highlightedMessageId: string | null;
  setHighlightedMessageId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);

  // Helper to cleanup Blob URLs
  useEffect(() => {
    const urls = messages
      .filter(msg => msg.mediaUrl?.startsWith('blob:'))
      .map(msg => msg.mediaUrl as string);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [messages]);

  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);

  const refreshSavedChats = useCallback(async () => {
    try {
      const chats = await db.chats.orderBy('lastOpened').reverse().toArray();
      setSavedChats(chats);
    } catch (err) {
      console.error('Failed to load saved chats:', err);
    }
  }, []);

  // Load saved chats from IndexedDB on mount
  useEffect(() => {
    refreshSavedChats();
  }, [refreshSavedChats]);

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
  }, [refreshSavedChats]);

  const saveCurrentChat = useCallback(async () => {
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
  }, [metadata, messages, refreshSavedChats]);

  const loadChat = useCallback(async (id: number) => {
    try {
      const chat = await db.chats.get(id);
      if (chat) {
        setMessages(chat.messages);
        setMetadata(chat.metadata);
        setSearchQuery('');
        setError(null);
        
        // Update last opened
        await db.chats.update(id, { lastOpened: Date.now() });
        
        // Update App Badge (PWA feature)
        if ('setAppBadge' in navigator) {
          (navigator as any).setAppBadge(1).catch(() => {});
        }
        
        refreshSavedChats();
      }
    } catch (err) {
      console.error('Failed to load chat:', err);
      setError('Failed to load chat from database.');
    }
  }, [refreshSavedChats]);

  const deleteChat = useCallback(async (id: number) => {
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
  }, [metadata, savedChats, refreshSavedChats]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setMetadata(null);
    setSearchQuery('');
    setError(null);
    
    // Clear App Badge
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge().catch(() => {});
    }
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      await db.chats.clear();
      clearChat();
      await refreshSavedChats();
    } catch (err) {
      console.error('Failed to clear all data:', err);
      setError('Failed to clear database.');
    }
  }, [clearChat, refreshSavedChats]);

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
      clearAllData,
      savedChats,
      loadChat,
      deleteChat,
      saveCurrentChat,
      highlightedMessageId,
      setHighlightedMessageId
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
