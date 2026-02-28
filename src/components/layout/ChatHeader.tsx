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
    <div className="h-[60px] flex items-center justify-between px-4 bg-wa-header-bg border-l border-wa-divider z-20 shrink-0">
      <div className="flex items-center min-w-0 flex-1">
        <div className="md:hidden w-10 shrink-0"></div>
        
        <div className="w-10 h-10 bg-wa-search-bg dark:bg-wa-sidebar-bg rounded-full flex items-center justify-center mr-2 shrink-0 text-wa-icon">
          <span className="font-semibold">{metadata.fileName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="flex flex-col min-w-0 cursor-pointer" onClick={onBackToChat}>
          <h3 className="text-[15px] font-semibold text-wa-text-primary leading-tight truncate">
            {metadata.fileName}
          </h3>
          <p className="text-[12px] text-wa-text-secondary truncate">
            {showAnalytics ? 'Back to chat' : showMediaGallery ? 'Back to chat' : `${metadata.participants.length} participants`}
          </p>
        </div>
      </div>
      <div className={`flex items-center gap-2 md:gap-4 text-wa-icon shrink-0 ${(showAnalytics || showMediaGallery) ? 'hidden md:flex' : 'flex'}`}>
        <button 
          onClick={onExportJSON}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          title="Export as JSON"
        >
          <Download size={20} />
        </button>
        <button 
          onClick={onToggleAnalytics}
          className={`p-2 rounded-full transition-colors ${showAnalytics ? 'text-wa-teal bg-white/50 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          title="Chat Analytics"
        >
          <BarChart3 size={20} />
        </button>
        <button 
          onClick={onOpenMediaGallery}
          className={`p-2 rounded-full transition-colors ${showMediaGallery ? 'text-wa-teal bg-white/50 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          title="Media Gallery"
        >
          <ImageIcon size={20} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
        <button 
          onClick={onToggleSearch}
          className={`p-2 rounded-full transition-colors ${showSearch ? 'text-wa-teal' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
          title="Search"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};
