import React from 'react';
import { ChatProvider, useChatStore } from './store/chatStore';
import { ChatLayout } from './components/ChatLayout';
import { FileUploader } from './components/FileUploader';
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { Search, MoreVertical, Phone, Video, ChevronDown } from 'lucide-react';

const ChatContent = () => {
  const { messages, metadata, searchQuery } = useChatStore();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = React.useState(false);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Show button if we are more than 300px away from bottom
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
  };

  // Scroll to bottom when a new chat is loaded or search changes
  React.useEffect(() => {
    if (metadata) {
      // Small timeout to ensure DOM is rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [metadata?.fileName, searchQuery]);

  if (!metadata) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 animate-fade-in">
        <FileUploader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Chat Header */}
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-gray-200 dark:border-gray-700">
        <div className="flex items-center min-w-0">
          {/* Mobile Spacer for Toggle Button */}
          <div className="w-10 md:hidden flex-shrink-0"></div>
          
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="text-gray-600 dark:text-gray-300 font-bold">{metadata.fileName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] leading-tight truncate">
              {metadata.fileName}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-[#8696a0] truncate">
              {metadata.participants.length} participants
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-5 text-gray-500 dark:text-[#8696a0] flex-shrink-0">
          <Video size={18} className="cursor-not-allowed opacity-50 hidden sm:block" />
          <Phone size={16} className="cursor-not-allowed opacity-50 hidden sm:block" />
          <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
          <Search size={18} className="cursor-pointer" />
          <MoreVertical size={18} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative scroll-smooth"
      >
        <MessageList messages={messages} />
        
        {/* Scroll to Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-6 right-6 w-10 h-10 bg-white dark:bg-[#202c33] shadow-md rounded-full flex items-center justify-center text-gray-500 dark:text-[#8696a0] hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-all z-20"
            title="Scroll to bottom"
          >
            <ChevronDown size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ChatProvider>
      <ChatLayout
        sidebar={<Sidebar />}
        content={<ChatContent />}
      />
    </ChatProvider>
  );
}

export default App;
