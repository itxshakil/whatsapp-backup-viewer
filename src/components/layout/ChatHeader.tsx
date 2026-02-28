import React from 'react';
import { Download, BarChart3, ImageIcon, Search } from 'lucide-react';
import { ChatMetadata } from '@/types/message';

interface ChatHeaderProps {
  metadata: ChatMetadata;
  showAnalytics: boolean;
  showMediaGallery: boolean;
  showSearch: boolean;
  onToggleAnalytics: () => void;
  onOpenMediaGallery: () => void;
  onToggleSearch: () => void;
  onExportJSON: () => void;
  onBackToChat: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  metadata,
  showAnalytics,
  showMediaGallery,
  showSearch,
  onToggleAnalytics,
  onOpenMediaGallery,
  onToggleSearch,
  onExportJSON,
  onBackToChat,
}) => {
  return (
    <div className="h-[60px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-l border-gray-300 dark:border-gray-700/50 z-20 shrink-0">
      <div className="flex items-center min-w-0 flex-1">
        <div className="md:hidden w-10 shrink-0"></div>
        
        <div className="w-10 h-10 bg-[#dfe5e7] dark:bg-[#111b21] rounded-full flex items-center justify-center mr-2 shrink-0 text-[#54656f] dark:text-[#aebac1]">
          <span className="font-semibold">{metadata.fileName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex flex-col min-w-0 cursor-pointer" onClick={onBackToChat}>
          <h3 className="text-[15px] font-semibold text-[#111b21] dark:text-[#e9edef] leading-tight truncate">
            {metadata.fileName}
          </h3>
          <p className="text-[12px] text-[#667781] dark:text-[#8696a0] truncate">
            {showAnalytics ? 'Back to chat' : showMediaGallery ? 'Back to chat' : `${metadata.participants.length} participants`}
          </p>
        </div>
      </div>
      <div className={`flex items-center gap-2 md:gap-4 text-[#54656f] dark:text-[#aebac1] shrink-0 ${(showAnalytics || showMediaGallery) ? 'hidden md:flex' : 'flex'}`}>
        <button 
          onClick={onExportJSON}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          title="Export as JSON"
        >
          <Download size={20} />
        </button>
        <button 
          onClick={onToggleAnalytics}
          className={`p-2 rounded-full transition-colors ${showAnalytics ? 'text-[#008069] dark:text-[#00a884] bg-white/50 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          title="Chat Analytics"
        >
          <BarChart3 size={20} />
        </button>
        <button 
          onClick={onOpenMediaGallery}
          className={`p-2 rounded-full transition-colors ${showMediaGallery ? 'text-[#008069] dark:text-[#00a884] bg-white/50 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          title="Media Gallery"
        >
          <ImageIcon size={20} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
        <button 
          onClick={onToggleSearch}
          className={`p-2 rounded-full transition-colors ${showSearch ? 'text-[#008069] dark:text-[#00a884]' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          title="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};
