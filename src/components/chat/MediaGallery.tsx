import React from 'react';
import { useChatStore } from '../../store/chatStore';
import { X, Grid, Layout } from 'lucide-react';

interface MediaGalleryProps {
  onClose: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = React.memo(({ onClose }) => {
  const { messages, setHighlightedMessageId } = useChatStore();
  
  const mediaMessages = React.useMemo(() => {
    return messages.filter(m => ['image', 'video', 'audio', 'document'].includes(m.type));
  }, [messages]);

  const jumpToMessage = React.useCallback((id: string) => {
    setHighlightedMessageId(id);
    onClose();
    setTimeout(() => {
      const element = document.getElementById(`msg-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }, 100);
  }, [setHighlightedMessageId, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#111b21] flex flex-col animate-fade-in">
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="text-gray-500 dark:text-[#8696a0]" />
          </button>
          <h2 className="text-lg font-medium text-[#111b21] dark:text-[#e9edef]">Media, Links and Docs</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {mediaMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-[#8696a0]">
            <Grid size={48} className="mb-4 opacity-20" />
            <p>No media found in this chat</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {mediaMessages.map((msg: any) => (
              <div 
                key={msg.id} 
                onClick={() => jumpToMessage(msg.id)}
                className="aspect-square bg-gray-200 dark:bg-[#202c33] rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
              >
                {msg.type === 'image' && msg.mediaUrl ? (
                  <img src={msg.mediaUrl} alt="" className="w-full h-full object-cover" />
                ) : msg.type === 'video' ? (
                   <div className="w-full h-full flex items-center justify-center bg-black/10">
                     <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
                       <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
