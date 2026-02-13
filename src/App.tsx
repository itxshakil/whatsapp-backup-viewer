import React from 'react';
import { ChatProvider, useChatStore } from './store/chatStore';
import { ChatLayout } from './components/ChatLayout';
import { FileUploader } from './components/FileUploader';
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { BarChart3, ChevronDown, ChevronUp, Download, MessageSquare, MoreVertical, Phone, Search, Video, ImageIcon } from 'lucide-react';
import { AnalyticsView } from './components/AnalyticsView';
import { MediaGallery } from './components/MediaGallery';
import { AboutPage } from './components/AboutPage';

const ChatContent = ({ onShowAbout }: { onShowAbout: () => void }) => {
  const { messages, metadata, searchQuery, savedChats, loadChat } = useChatStore();
  const [showAnalytics, setShowAnalytics] = React.useState(false);
  const [showMediaGallery, setShowMediaGallery] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  const jumpToBottom = () => {
    scrollToBottom();
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Show button if we are more than 300px away from bottom
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
    // Show top button if we are more than 300px away from top
    setShowScrollTop(scrollTop > 300);
  };

  // Scroll to bottom when a new chat is loaded or search changes
  React.useEffect(() => {
    if (metadata && !showAnalytics) {
      // Small timeout to ensure DOM is rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [metadata?.fileName, searchQuery, showAnalytics]);

  // Handle URL actions (PWA Shortcuts)
  const hasHandledAction = React.useRef(false);
  React.useEffect(() => {
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
      <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in relative">
        {/* About button for empty state */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={onShowAbout}
            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#202c33] hover:bg-gray-50 dark:hover:bg-[#2a3942] text-gray-600 dark:text-gray-300 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all text-xs font-medium"
          >
            <MoreVertical size={14} className="rotate-90" />
            About & Help
          </button>
        </div>
        <FileUploader />
      </div>
    );
  }

  const handleExportJSON = () => {
    if (!metadata || messages.length === 0) return;
    const data = JSON.stringify({ metadata, messages }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.fileName.replace('.txt', '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      {/* Chat Header */}
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-gray-200 dark:border-gray-700 z-20">
        <div className="flex items-center min-w-0">
          {/* Mobile Spacer for Toggle Button */}
          <div className="w-10 md:hidden flex-shrink-0"></div>
          
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-gray-600 dark:text-gray-300 font-bold">{metadata.fileName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col min-w-0 cursor-pointer" onClick={() => setShowAnalytics(!showAnalytics)}>
            <h3 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] leading-tight truncate">
              {metadata.fileName}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-[#8696a0] truncate">
              {showAnalytics ? 'Back to chat' : `${metadata.participants.length} participants`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-5 text-gray-500 dark:text-[#8696a0] flex-shrink-0">
          <button 
            onClick={handleExportJSON}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Export as JSON"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`p-1.5 rounded-full transition-colors ${showAnalytics ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            title="Chat Analytics"
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setShowMediaGallery(true)}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Media Gallery"
          >
            <ImageIcon size={20} />
          </button>
          <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
          <Search size={18} className="cursor-pointer" />
          <button 
            onClick={jumpToBottom}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors sm:hidden"
            title="Jump to Bottom"
          >
            <ChevronDown size={18} />
          </button>
          <MoreVertical size={18} className="cursor-pointer" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col min-h-0">
        {showMediaGallery && <MediaGallery onClose={() => setShowMediaGallery(false)} />}
        {showAnalytics ? (
          <AnalyticsView messages={messages} participants={metadata.participants} />
        ) : (
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto relative scroll-smooth"
          >
            <MessageList messages={messages} />
            
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-20 right-6 w-10 h-10 bg-white dark:bg-[#202c33] shadow-md rounded-full flex items-center justify-center text-gray-500 dark:text-[#8696a0] hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-all z-20"
                title="Scroll to top"
              >
                <ChevronUp size={24} />
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
        )}
      </div>
    </div>
  );
};

function App() {
  const [showAbout, setShowAbout] = React.useState(false);

  return (
    <ChatProvider>
      <ChatLayout
        sidebar={<Sidebar onShowAbout={() => setShowAbout(true)} />}
        content={<ChatContent onShowAbout={() => setShowAbout(true)} />}
      />
      {showAbout && <AboutPage onClose={() => setShowAbout(false)} />}
    </ChatProvider>
  );
}

export default App;
