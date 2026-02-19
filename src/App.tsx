import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatProvider, useChatStore } from './store/chatStore';
import { ChatLayout } from './components/layout/ChatLayout';
import { FileUploader } from './components/ui/FileUploader';
import { Sidebar } from './components/layout/Sidebar';
import { MessageList } from './components/chat/MessageList';
import { BarChart3, ChevronDown, ChevronUp, Download, MessageSquare, Phone, Search, Video, ImageIcon } from 'lucide-react';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MediaGallery } from './components/chat/MediaGallery';
import { SearchBar } from './components/chat/SearchBar';
import { AboutPage } from './components/ui/AboutPage';
import dayjs from 'dayjs';
import { VirtuosoHandle } from 'react-virtuoso';

const ChatContent = ({ onShowAbout }: { onShowAbout: () => void }) => {
  const { messages, metadata, searchQuery, savedChats, loadChat, setSearchQuery, setHighlightedMessageId, highlightedMessageId } = useChatStore();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messages.length - 1,
        behavior: 'auto',
        align: 'end'
      });
    } else {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'auto'
      });
    }
  }, [messages.length]);

  const handleJumpToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const scrollToTop = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: 0,
        behavior: 'auto',
        align: 'start'
      });
    } else {
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
  }, []);

  const handleScroll = useCallback((e: any) => {
    // If e is from Virtuoso, it's the scroll event from the scroller element
    const target = e.target;
    if (!target) return;
    const { scrollTop, scrollHeight, clientHeight } = target;
    // Show button if we are more than 300px away from bottom
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
    // Show top button if we are more than 300px away from top
    setShowScrollTop(scrollTop > 300);
  }, []);

  const handleExportJSON = useCallback(() => {
    if (!metadata || messages.length === 0) return;
    const data = JSON.stringify({ metadata, messages }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.fileName.replace('.txt', '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [metadata, messages]);

  const closeMediaGallery = useCallback(() => setShowMediaGallery(false), []);

  const toggleAnalytics = useCallback(() => {
    setShowAnalytics(prev => {
      if (!prev) {
        setShowMediaGallery(false);
        setShowSearch(false);
      }
      return !prev;
    });
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => {
      if (prev) {
        setSearchQuery('');
        setHighlightedMessageId(null);
      } else {
        setShowAnalytics(false);
        setShowMediaGallery(false);
      }
      return !prev;
    });
  }, [setSearchQuery, setHighlightedMessageId]);

  const openMediaGallery = useCallback(() => {
    setShowMediaGallery(true);
    setShowAnalytics(false);
    setShowSearch(false);
  }, []);

  // Scroll to highlighted message when it changes
  useEffect(() => {
    if (highlightedMessageId && virtuosoRef.current) {
      // Small delay to ensure the list is rendered if we just switched views
      const timer = setTimeout(() => {
        // Since MessageList includes date headers, searching just messages is not enough 
        // to get the correct index in Virtuoso.
        
        // We can get the index directly from the MessageList data if we expose it,
        // but for now, we'll re-calculate it to match MessageList's logic exactly.
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
          // Fallback: search for the DOM element since MessageList items have id={`msg-${id}`}
          const element = document.getElementById(`msg-${highlightedMessageId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightedMessageId, messages, searchQuery]);

  // Scroll to bottom when a new chat is loaded or search changes
  useEffect(() => {
    if (metadata && !showAnalytics && !showSearch) {
      // Small timeout to ensure DOM is rendered
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [metadata?.fileName, searchQuery, showAnalytics, showSearch, scrollToBottom]);

  // Handle URL actions (PWA Shortcuts)
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in relative bg-[#f0f2f5] dark:bg-[#0b141a] overflow-y-auto h-full">
        {/* About button for empty state */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={onShowAbout}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#202c33] hover:bg-gray-50 dark:hover:bg-[#2a3942] text-gray-600 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all text-xs font-medium"
          >
            About & Help
          </button>
        </div>
        
        {/* Landing Page Content */}
        <div className="text-center my-auto animate-fade-in max-w-2xl px-4 py-20 md:py-0 absolute inset-0">
          <div className="w-20 h-20 bg-[#25d366] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform -rotate-3 transition-transform hover:rotate-0 cursor-default flex-shrink-0 relative z-10">
            <MessageSquare size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-[#e9edef] mb-4">WhatsApp Backup Viewer & Analyzer</h1>
          <p className="text-gray-600 dark:text-[#8696a0] text-lg mb-8">
            The most private and secure way to explore your chat memories locally. No data ever leaves your device.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-white dark:bg-[#202c33] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3">
                <Search size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1 dark:text-[#e9edef]">Smart Search</h3>
              <p className="text-xs text-gray-500 dark:text-[#8696a0]">Find any message instantly across thousands of entries.</p>
            </div>
            <div className="bg-white dark:bg-[#202c33] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-3">
                <ImageIcon size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1 dark:text-[#e9edef]">Media Gallery</h3>
              <p className="text-xs text-gray-500 dark:text-[#8696a0]">Browse all your shared photos and videos in one place.</p>
            </div>
            <div className="bg-white dark:bg-[#202c33] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1 dark:text-[#e9edef]">Chat Analytics</h3>
              <p className="text-xs text-gray-500 dark:text-[#8696a0]">Discover patterns, top words, and busiest times.</p>
            </div>
          </div>
          
          <FileUploader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full h-[100dvh] animate-fade-in relative">
      {/* Chat Header */}
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-gray-200 dark:border-gray-700 z-20 flex-shrink-0">
        <div className="flex items-center min-w-0 flex-1">
          {/* Mobile Spacer for Toggle Button */}
          <div className="w-12 md:hidden flex-shrink-0"></div>
          
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-gray-600 dark:text-gray-300 font-bold">{metadata.fileName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => {
            if (showAnalytics) toggleAnalytics();
            else if (showMediaGallery) closeMediaGallery();
          }}>
            <h3 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] leading-tight truncate">
              {metadata.fileName}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-[#8696a0] truncate">
              {showAnalytics ? 'Back to chat' : showMediaGallery ? 'Back to chat' : `${metadata.participants.length} participants`}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-3 md:gap-5 text-gray-500 dark:text-[#8696a0] flex-shrink-0 ${(showAnalytics || showMediaGallery) ? 'hidden md:flex' : 'flex'}`}>
          <button 
            onClick={handleExportJSON}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Export as JSON"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={toggleAnalytics}
            className={`p-1.5 rounded-full transition-colors ${showAnalytics ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Chat Analytics"
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={openMediaGallery}
            className={`p-1.5 rounded-full transition-colors ${showMediaGallery ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Media Gallery"
          >
            <ImageIcon size={20} />
          </button>
          <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
          <Search 
            size={18} 
            className={`cursor-pointer transition-colors ${showSearch ? 'text-green-600 dark:text-green-500' : 'hover:text-gray-700 dark:hover:text-[#e9edef]'}`}
            onClick={toggleSearch}
          />
        </div>
      </div>

      {/* Main Content Area */}
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
            <div 
              ref={scrollRef}
              className="flex-1 relative"
            >
              <MessageList 
                ref={virtuosoRef} 
                messages={messages} 
                onScroll={handleScroll}
              />
              
              {/* Scroll to Top Button */}
              {showScrollTop && (
                <button
                  onClick={scrollToTop}
                  className="fixed bottom-20 right-6 w-12 h-12 bg-white dark:bg-[#202c33] shadow-lg rounded-full flex items-center justify-center text-gray-500 dark:text-[#8696a0] hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-all z-30 border border-gray-100 dark:border-gray-700"
                  title="Scroll to top"
                >
                  <ChevronUp size={28} />
                </button>
              )}

              {/* Scroll to Bottom Button */}
              {showScrollBottom && (
                <button
                  onClick={scrollToBottom}
                  className="fixed bottom-6 right-6 w-12 h-12 bg-white dark:bg-[#202c33] shadow-lg rounded-full flex items-center justify-center text-gray-500 dark:text-[#8696a0] hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-all z-30 border border-gray-100 dark:border-gray-700"
                  title="Scroll to bottom"
                >
                  <ChevronDown size={28} />
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

function App() {
  const [showAbout, setShowAbout] = useState(false);

  const handleShowAbout = useCallback(() => setShowAbout(true), []);
  const handleHideAbout = useCallback(() => setShowAbout(false), []);

  return (
    <ChatProvider>
      <ChatLayout
        sidebar={<Sidebar onShowAbout={handleShowAbout} />}
        content={<ChatContent onShowAbout={handleShowAbout} />}
      />
      {showAbout && <AboutPage onClose={handleHideAbout} />}
    </ChatProvider>
  );
}

export default App;
