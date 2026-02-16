import React from 'react';
import { FileIcon, ImageIcon, VideoIcon, MusicIcon, Download, Copy, Check, Phone, Video } from 'lucide-react';
import { Message } from '../../types/message';
import { useChatStore } from '../../store/chatStore';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
  showTail?: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  message,
  showSender = true,
  showTail = true,
  className = '',
}) => {
  const { searchQuery, highlightedMessageId, setHighlightedMessageId } = useChatStore();
  const [copied, setCopied] = useState(false);
  const bubbleRef = React.useRef<HTMLDivElement>(null);

  const isSystem = message.type === 'system';
  const isMe = message.isCurrentUser;
  const isHighlighted = highlightedMessageId === message.id;

  const tailClasses = ""; // Not used anymore as we use SVG tails

  React.useEffect(() => {
    if (isHighlighted) {
      if (bubbleRef.current) {
        bubbleRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
      const timer = setTimeout(() => {
        setHighlightedMessageId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted, setHighlightedMessageId]);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  const highlightText = React.useCallback((text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part: string, i: number) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/50 text-inherit rounded-sm px-0.5">
              {part}
            </mark>
          ) : part
        )}
      </>
    );
  }, []);

  const renderContentWithLinks = React.useCallback((text: string) => {
    // Basic emoji detection to render large emojis if message is just emojis
    const emojiRegex = /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/g;
    const isOnlyEmojis = text.length <= 10 && emojiRegex.test(text.trim());

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <div className={isOnlyEmojis ? 'text-3xl py-1' : ''}>
        {parts.map((part: string, i: number) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                onClick={(e) => e.stopPropagation()}
              >
                {highlightText(part, searchQuery)}
              </a>
            );
          }
          return highlightText(part, searchQuery);
        })}
      </div>
    );
  }, [searchQuery, highlightText]);

  const renderMediaContent = React.useCallback(() => {
    const isImage = message.type === 'image';
    const isVideo = message.type === 'video';
    const isAudio = message.type === 'audio';
    const isDoc = message.type === 'document';
    const isCall = message.type === 'call';

    if (!isImage && !isVideo && !isAudio && !isDoc && !isCall) return null;

    const mediaUrl = message.mediaUrl;

    if (isCall) {
      return (
        <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-lg mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMe ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            <Phone size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-tight">Voice Call</p>
            <p className="text-[10px] opacity-70">No answer</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-2 overflow-hidden rounded-lg bg-black/5 dark:bg-black/20">
        {isImage && (
          <div className="relative group">
            {mediaUrl ? (
              <img 
                src={mediaUrl} 
                alt="Chat attachment" 
                className="max-w-full h-auto max-h-[300px] object-contain mx-auto block cursor-pointer"
                onClick={() => window.open(mediaUrl, '_blank')}
              />
            ) : (
              <div className="flex items-center justify-center aspect-video bg-gray-200 dark:bg-gray-800">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1">
              <ImageIcon size={12} /> IMAGE
            </div>
          </div>
        )}
        {isVideo && (
          <div className="relative group flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            {mediaUrl ? (
              <video 
                src={mediaUrl} 
                controls 
                className="max-w-full max-h-[300px]"
              />
            ) : (
              <div className="aspect-video flex items-center justify-center w-full">
                <VideoIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1">
              <VideoIcon size={12} /> VIDEO
            </div>
          </div>
        )}
        {isAudio && (
          <div className="p-3">
            {mediaUrl ? (
              <audio src={mediaUrl} controls className="w-full h-8" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <MusicIcon size={20} />
                </div>
                <div className="flex-1">
                  <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-green-500"></div>
                  </div>
                  <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">Audio Message (not loaded)</p>
                </div>
              </div>
            )}
          </div>
        )}
        {isDoc && (
          <div className="p-3 flex items-center gap-3 bg-black/5 dark:bg-white/5">
            <FileIcon className="text-gray-500 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.content}</p>
              <p className="text-[10px] text-gray-500 uppercase">Document</p>
            </div>
            {mediaUrl ? (
              <a href={mediaUrl} download={message.content} className="text-teal-600 dark:text-teal-500 hover:text-teal-700">
                <Download size={18} />
              </a>
            ) : (
              <Download size={18} className="text-teal-600 dark:text-teal-500 cursor-not-allowed opacity-50" />
            )}
          </div>
        )}
      </div>
    );
  }, [message]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-2 px-4">
        <div className="bg-[#f0f2f5]/80 dark:bg-[#182229]/80 backdrop-blur-sm text-[#54656f] dark:text-[#8696a0] text-xs px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800/50 uppercase tracking-widest font-medium text-center max-w-[85%]">
          {highlightText(message.content, searchQuery)}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={bubbleRef}
      id={`msg-${message.id}`}
      className={`flex w-full group/msg ${isMe ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-2' : 'mt-0'} ${className} ${isHighlighted ? 'animate-pulse-highlight' : ''}`}
    >
      <div
        className={`relative max-w-[90%] sm:max-w-[75%] md:max-w-[65%] px-2.5 py-1.5 shadow-sm group/bubble ${
          isMe
            ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] ' + (showTail ? 'rounded-l-lg rounded-br-lg rounded-tr-none' : 'rounded-lg')
            : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] ' + (showTail ? 'rounded-r-lg rounded-bl-lg rounded-tl-none' : 'rounded-lg')
        }`}
      >
        {/* Edited Label */}
        {message.isEdited && (
          <div className="absolute top-1.5 right-2 text-[9px] font-bold text-gray-400 dark:text-[#8696a0] select-none pointer-events-none tracking-wider opacity-80 uppercase">
            EDITED
          </div>
        )}

        {/* Copy Button */}
        {!isSystem && (
          <button
            onClick={handleCopy}
            className={`absolute top-1 ${isMe ? 'left-[-30px]' : 'right-[-30px]'} p-1.5 rounded-full bg-white/50 dark:bg-black/20 text-gray-500 dark:text-gray-400 opacity-0 group-hover/bubble:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/40`}
            title="Copy message"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}

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
                d={isMe 
                  ? "M1.2,0.1L0,0c0.1,0.1,1.1,1.2,1.2,2.9V13L8,0.1C4.3,0.1,2.1,0.1,1.2,0.1z" 
                  : "M6.8,0.1L8,0c-0.1,0.1-1.1,1.2-1.2,2.9V13L0,0.1C3.7,0.1,5.9,0.1,6.8,0.1z"}
              ></path>
            </svg>
          </div>
        )}

        {showSender && !isMe && (
          <div className="text-[12.5px] font-semibold text-teal-600 dark:text-teal-500 leading-tight mb-1 px-0.5 pr-8">
            {highlightText(message.sender, searchQuery)}
          </div>
        )}

        <div className="relative min-w-[80px]">
          {renderMediaContent()}
          <div className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words px-0.5 pb-3 pr-8">
            {message.type === 'text' ? renderContentWithLinks(message.content) : null}
            {message.type === 'call' ? (
              <span className="text-gray-500 dark:text-gray-400 font-medium italic">
                {message.content}
              </span>
            ) : null}
            <span className="inline-block w-[60px]"></span>
          </div>
          <div className="text-[11px] text-gray-500 dark:text-[#8696a0] absolute right-0.5 bottom-0.5 flex-shrink-0 select-none flex items-center gap-1">
            {React.useMemo(() => message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(), [message.timestamp])}
          </div>
        </div>
      </div>
    </div>
  );
});
