import React from 'react';
import { FileIcon, ImageIcon, VideoIcon, MusicIcon, Download } from 'lucide-react';
import { Message } from '../types/message';
import { useChatStore } from '../store/chatStore';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
  showTail?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showSender = true,
  showTail = true,
}) => {
  const { searchQuery } = useChatStore();
  const isSystem = message.type === 'system';
  const isMe = message.isCurrentUser;

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/50 text-inherit rounded-sm px-0.5">
              {part}
            </mark>
          ) : part
        )}
      </>
    );
  };

  const renderMediaContent = () => {
    const isImage = message.type === 'image';
    const isVideo = message.type === 'video';
    const isAudio = message.type === 'audio';
    const isDoc = message.type === 'document';

    if (!isImage && !isVideo && !isAudio && !isDoc) return null;

    return (
      <div className="mb-2 overflow-hidden rounded-lg bg-black/5 dark:bg-black/20">
        {isImage && (
          <div className="relative group">
            <div className="flex items-center justify-center aspect-video bg-gray-200 dark:bg-gray-800">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] bg-black/50 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <ImageIcon size={12} /> IMAGE
              </span>
            </div>
          </div>
        )}
        {isVideo && (
          <div className="relative group flex items-center justify-center aspect-video bg-gray-200 dark:bg-gray-800">
            <VideoIcon className="w-12 h-12 text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] bg-black/50 text-white px-2 py-1 rounded-full flex items-center gap-1">
                <VideoIcon size={12} /> VIDEO
              </span>
            </div>
          </div>
        )}
        {isAudio && (
          <div className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
              <MusicIcon size={20} />
            </div>
            <div className="flex-1">
              <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-green-500"></div>
              </div>
              <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">Audio Message</p>
            </div>
          </div>
        )}
        {isDoc && (
          <div className="p-3 flex items-center gap-3 bg-black/5 dark:bg-white/5">
            <FileIcon className="text-gray-500 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.content}</p>
              <p className="text-[10px] text-gray-500 uppercase">Document</p>
            </div>
            <Download size={18} className="text-teal-600 dark:text-teal-500 cursor-not-allowed" />
          </div>
        )}
      </div>
    );
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-2 px-4">
        <div className="bg-amber-50 dark:bg-[#182229] text-amber-800 dark:text-amber-200/70 text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm border border-amber-100 dark:border-none text-center max-w-[90%] uppercase tracking-wide">
          {highlightText(message.content, searchQuery)}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-2' : 'mt-0'}`}>
      <div
        className={`relative max-w-[90%] sm:max-w-[75%] md:max-w-[65%] px-2.5 py-1.5 shadow-sm ${
          isMe
            ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-l-lg rounded-br-lg ' + (showTail ? 'rounded-tr-none' : 'rounded-tr-lg')
            : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-r-lg rounded-bl-lg ' + (showTail ? 'rounded-tl-none' : 'rounded-tl-lg')
        }`}
      >
        {/* Tail */}
        {showTail && (
          <div
            className={`absolute top-0 w-2 h-2.5 ${
              isMe
                ? 'right-[-8px] text-[#dcf8c6] dark:text-[#005c4b]'
                : 'left-[-8px] text-white dark:text-[#202c33]'
            }`}
          >
            <svg viewBox="0 0 8 13" width="8" height="13">
              <path
                fill="currentColor"
                d={isMe ? "M0 0v13l8-13H0z" : "M8 0v13L0 13V0h8z"}
              ></path>
            </svg>
          </div>
        )}

        {showSender && !isMe && (
          <div className="text-[12.5px] font-semibold text-teal-600 dark:text-teal-500 leading-tight mb-1">
            {highlightText(message.sender, searchQuery)}
          </div>
        )}

        <div className="relative min-w-[80px] pb-1">
          {renderMediaContent()}
          <div className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words pr-[2px]">
            {message.type === 'text' ? highlightText(message.content, searchQuery) : null}
            <span className="inline-block w-[50px]"></span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-[#8696a0] absolute right-0 bottom-[-4px] flex-shrink-0 select-none pb-0.5 pr-0.5">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
