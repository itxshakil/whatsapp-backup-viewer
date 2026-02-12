import React from 'react';
import { ChatProvider, useChatStore } from './store/chatStore';
import { ChatLayout } from './components/ChatLayout';
import { FileUploader } from './components/FileUploader';
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { Search, MoreVertical, Phone, Video } from 'lucide-react';

const ChatContent = () => {
  const { messages, metadata } = useChatStore();

  if (!metadata) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <FileUploader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-gray-600 dark:text-gray-300 font-bold">{metadata.fileName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] leading-tight truncate max-w-[200px]">
              {metadata.fileName}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-[#8696a0]">
              {metadata.participants.length} participants
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-500 dark:text-[#8696a0]">
          <Video size={20} />
          <Phone size={18} />
          <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-1"></div>
          <Search size={20} />
          <MoreVertical size={20} />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
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
