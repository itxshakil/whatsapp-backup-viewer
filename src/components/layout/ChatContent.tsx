import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageList } from '../chat/MessageList';
import { AnalyticsView } from '../analytics/AnalyticsView';
import { MediaGallery } from '../chat/MediaGallery';
import { SearchBar } from '../chat/SearchBar';
import { trackEvent } from '@/utils/analytics';
import dayjs from 'dayjs';
import { VirtuosoHandle } from 'react-virtuoso';
import { useChatScroll } from '@/hooks/useChatScroll';
import { exportChatAsJSON } from '@/utils/exportHelpers';
import { ChatHeader } from './ChatHeader';
import { ScrollButtons } from '../ui/ScrollButtons';
import { LandingPage } from './LandingPage';

export const ChatContent = ({ onShowAbout }: { onShowAbout: () => void }) => {
  const { 
    messages, 
    metadata, 
    searchQuery, 
    savedChats, 
    loadChat, 
    setSearchQuery, 
    setHighlightedMessageId, 
    highlightedMessageId 
  } = useChatStore();

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const {
    showScrollBottom,
    showScrollTop,
    scrollToBottom,
    scrollToTop,
    handleScroll
  } = useChatScroll(messages.length, virtuosoRef, scrollRef);

  const handleExportJSON = useCallback(() => {
    exportChatAsJSON(metadata, messages);
  }, [metadata, messages]);

  const closeMediaGallery = useCallback(() => setShowMediaGallery(false), []);

  const toggleAnalytics = useCallback(() => {
    setShowAnalytics(prev => {
      if (!prev) {
        setShowMediaGallery(false);
        setShowSearch(false);
        trackEvent('toggle_analytics', { action: 'open' });
      } else {
        trackEvent('toggle_analytics', { action: 'close' });
      }
      return !prev;
    });
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => {
      if (prev) {
        setSearchQuery('');
        setHighlightedMessageId(null);
        trackEvent('toggle_search', { action: 'close' });
      } else {
        setShowAnalytics(false);
        setShowMediaGallery(false);
        trackEvent('toggle_search', { action: 'open' });
      }
      return !prev;
    });
  }, [setSearchQuery, setHighlightedMessageId]);

  const openMediaGallery = useCallback(() => {
    setShowMediaGallery(true);
    setShowAnalytics(false);
    setShowSearch(false);
    trackEvent('open_media_gallery');
  }, []);

  const handleBackToChat = useCallback(() => {
    if (showAnalytics) toggleAnalytics();
    else if (showMediaGallery) closeMediaGallery();
  }, [showAnalytics, showMediaGallery, toggleAnalytics, closeMediaGallery]);

  useEffect(() => {
    if (highlightedMessageId && virtuosoRef.current) {
      const timer = setTimeout(() => {
        const filteredMessages = messages.filter(m => 
          !searchQuery.trim() || 
          (m.type === 'text' || m.type === 'system' || m.type === 'document') &&
          (m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.sender.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        let virtuosoIndex = -1;
        let lastDateKey = '';
        let found = false;

        for (const msg of filteredMessages) {
          const currentDate = dayjs(msg.timestamp).startOf('day');
          const dateKey = currentDate.format('YYYY-MM-DD');
          
          if (dateKey !== lastDateKey) {
            virtuosoIndex++;
            lastDateKey = dateKey;
          }
          
          virtuosoIndex++;
          if (msg.id === highlightedMessageId) {
            found = true;
            break;
          }
        }

        if (found && virtuosoIndex !== -1) {
          virtuosoRef.current?.scrollToIndex({
            index: virtuosoIndex,
            behavior: 'smooth',
            align: 'center'
          });
        } else {
          const element = document.getElementById(`msg-${highlightedMessageId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightedMessageId, messages, searchQuery]);

  useEffect(() => {
    if (metadata && !showAnalytics && !showSearch) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [metadata?.fileName, searchQuery, showAnalytics, showSearch, scrollToBottom]);

  const hasHandledAction = useRef(false);
  useEffect(() => {
    if (hasHandledAction.current) return;
    
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'recent' && savedChats.length > 0) {
      const mostRecent = savedChats[0];
      if (mostRecent.id) {
        loadChat(mostRecent.id);
        hasHandledAction.current = true;
      }
    }
  }, [savedChats, loadChat]);

  if (!metadata) {
    return <LandingPage onShowAbout={onShowAbout} />;
  }

  return (
    <div className="flex flex-col h-full animate-fade-in relative overflow-hidden">
      <ChatHeader 
        metadata={metadata}
        showAnalytics={showAnalytics}
        showMediaGallery={showMediaGallery}
        showSearch={showSearch}
        onToggleAnalytics={toggleAnalytics}
        onOpenMediaGallery={openMediaGallery}
        onToggleSearch={toggleSearch}
        onExportJSON={handleExportJSON}
        onBackToChat={handleBackToChat}
      />

      <div className="flex-1 relative flex flex-col min-h-0">
        {showSearch && !showAnalytics && (
          <div className="absolute top-0 left-0 right-0 z-30 animate-fade-in shadow-md">
            <SearchBar />
          </div>
        )}
        {showMediaGallery && (
          <div className="absolute inset-0 z-[40] md:z-auto md:relative">
            <MediaGallery onClose={closeMediaGallery} />
          </div>
        )}
        {showAnalytics ? (
          <AnalyticsView messages={messages} participants={metadata.participants} />
        ) : (
          !showMediaGallery && (
            <div ref={scrollRef} className="flex-1 relative">
              <MessageList 
                ref={virtuosoRef} 
                messages={messages} 
                onScroll={handleScroll}
              />
              <ScrollButtons 
                showScrollTop={showScrollTop}
                showScrollBottom={showScrollBottom}
                onScrollTop={scrollToTop}
                onScrollBottom={scrollToBottom}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};
