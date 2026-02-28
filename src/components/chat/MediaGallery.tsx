import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { useChatStore } from '@/store/chatStore';
import { Grid, Layout } from 'lucide-react';

interface MediaGalleryProps {
  onClose: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = React.memo(({ onClose }) => {
  const { messages, setHighlightedMessageId } = useChatStore();
  
  const mediaMessages = React.useMemo(() => {
    return messages.filter(m => m.mediaUrl || ['image', 'video', 'audio', 'document'].includes(m.type));
  }, [messages]);

  const jumpToMessage = React.useCallback((id: string) => {
    setHighlightedMessageId(id);
    onClose();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
  }, [setHighlightedMessageId, onClose]);

  return (
    <div className="flex-1 flex flex-col bg-wa-sidebar-bg animate-fade-in overscroll-none h-full min-h-0">
      <div className="h-[59px] flex items-center px-4 bg-wa-header-bg border-b border-wa-divider shrink-0 md:hidden">
        <h2 className="text-base sm:text-lg font-bold text-wa-text-primary flex items-center gap-2">
          <Grid className="text-wa-teal" size={20} />
          Media Gallery
        </h2>
      </div>

      <div className="flex-1 min-h-0 touch-pan-y">
        {mediaMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-wa-text-secondary">
            <Grid size={48} className="mb-4 opacity-20" />
            <p>No media found in this chat</p>
          </div>
        ) : (
          <VirtuosoGrid
            style={{ height: '100%' }}
            totalCount={mediaMessages.length}
            listClassName="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-4 md:p-8"
            itemContent={(index) => {
              const msg = mediaMessages[index];
              return (
                <div 
                  key={msg.id} 
                  onClick={() => jumpToMessage(msg.id)}
                  className="aspect-square bg-gray-200 dark:bg-wa-search-input-bg rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group active:scale-95 transition-transform"
                >
                  {msg.type === 'image' && msg.mediaUrl ? (
                    <img src={msg.mediaUrl} alt="" className="w-full h-full object-cover" />
                  ) : msg.type === 'video' ? (
                     <div className="w-full h-full flex items-center justify-center bg-black/10">
                       <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                         <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-10 border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                       </div>
                     </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                      <Layout className="text-gray-400 mb-1" size={20} />
                      <span className="text-[8px] truncate w-full uppercase">{msg.type}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
});
