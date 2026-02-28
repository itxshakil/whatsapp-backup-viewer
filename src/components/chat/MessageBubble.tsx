import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { FileIcon, ImageIcon, VideoIcon, MusicIcon, Download, Copy, Check, Phone, Video } from 'lucide-react';
import { Message } from '@/types/message';
import { useChatStore } from '@/store/chatStore';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
  showTail?: boolean;
  className?: string;
}

const SystemMessage: React.FC<{ content: string; highlightText: (text: string) => React.ReactNode }> = React.memo(({ content, highlightText }) => (
  <div className="flex justify-center my-3 px-4">
    <div className="bg-[#e1f3fb] dark:bg-[#182229] text-[#54656f] dark:text-[#8696a0] text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm border border-transparent dark:border-gray-800/50 uppercase tracking-tight font-normal text-center max-w-[85%]">
      {highlightText(content)}
    </div>
  </div>
));

const MessageTail: React.FC<{ isMe: boolean }> = React.memo(({ isMe }) => (
  <div
    className={`absolute top-0 w-[12px] h-[19px] ${
      isMe
        ? 'right-[-12px] text-[#dcf8c6] dark:text-[#005c4b]'
        : 'left-[-12px] text-white dark:text-[#202c33]'
    }`}
  >
    <svg viewBox="0 0 12 19" width="12" height="19">
      <path
        fill="currentColor"
        d={isMe 
          ? "M0,0 C3,0 12,0 12,0 L12,19 C12,19 3,8 0,0" 
          : "M12,0 C9,0 0,0 0,0 L0,19 C0,19 9,8 12,0"}
      ></path>
    </svg>
  </div>
));

const MediaContent: React.FC<{ message: Message; isMe: boolean }> = React.memo(({ message, isMe }) => {
  const { type, mediaUrl, content } = message;
  
  if (type === 'call') {
    const isVideo = content.toLowerCase().includes('video');
    const isMissed = content.toLowerCase().includes('missed');
    
    return (
      <div className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 rounded-lg mb-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isMissed ? 'bg-red-500 text-white' : (isMe ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300')}`}>
          {isVideo ? <Video size={20} /> : <Phone size={20} />}
        </div>
        <div className="flex-1 min-w-0 pr-14">
          <p className="text-sm font-semibold tracking-tight">{isVideo ? 'Video Call' : 'Voice Call'}</p>
          <p className="text-[10px] opacity-70">{isMissed ? 'Missed' : 'Answered'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 overflow-hidden rounded-lg bg-black/5 dark:bg-black/20">
      {type === 'image' && (
        <div className="relative group min-h-[100px] min-w-[100px]">
          {mediaUrl ? (
            <img 
              src={mediaUrl} 
              alt="Chat attachment" 
              className="max-w-full h-auto max-h-[300px] object-contain mx-auto block cursor-pointer p-1"
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
      {type === 'video' && (
        <div className="relative group flex items-center justify-center bg-gray-200 dark:bg-gray-800 min-h-[100px]">
          {mediaUrl ? (
            <video src={mediaUrl} controls className="max-w-full max-h-[300px] p-1" />
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
      {type === 'audio' && (
        <div className="p-4">
          {mediaUrl ? (
            <audio src={mediaUrl} controls className="w-full h-10" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                <MusicIcon size={24} />
              </div>
              <div className="flex-1">
                <div className="h-1.5 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-green-500"></div>
                </div>
                <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">Audio Message (not loaded)</p>
              </div>
            </div>
          )}
        </div>
      )}
      {type === 'document' && (
        <div className="p-4 flex items-center gap-3 bg-black/5 dark:bg-white/5 active:bg-black/10 dark:active:bg-white/10 transition-colors">
          <FileIcon className="text-gray-500 dark:text-gray-400 shrink-0" size={24} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{content}</p>
            <p className="text-[10px] text-gray-500 uppercase">Document</p>
          </div>
          {mediaUrl ? (
            <a href={mediaUrl} download={content} className="text-teal-600 dark:text-teal-500 hover:text-teal-700 p-2">
              <Download size={20} />
            </a>
          ) : (
            <div className="p-2 opacity-50">
              <Download size={20} className="text-teal-600 dark:text-teal-500 cursor-not-allowed" />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({
  message,
  showSender = true,
  showTail = true,
  className = '',
}) => {
  const { searchQuery, highlightedMessageId, setHighlightedMessageId } = useChatStore();
  const [copied, setCopied] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSystem = message.type === 'system';
  const isMe = message.isCurrentUser;
  const isHighlighted = highlightedMessageId === message.id;

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setHighlightedMessageId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted, setHighlightedMessageId]);

  const handleCopy = useCallback(() => {
    if (message.type !== 'text' && !message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(20); } catch (e) {}
    }
    setTimeout(() => setCopied(false), 2000);
  }, [message.content, message.type]);

  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([30, 10, 30]); } catch (e) {}
      }
      handleCopy();
    }, 600);
  }, [handleCopy]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const highlightText = useCallback((text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part: string, i: number) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/50 text-inherit rounded-sm px-0.5">
              {part}
            </mark>
          ) : part
        )}
      </>
    );
  }, [searchQuery]);

  const renderContentWithLinks = useCallback((text: string) => {
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+$/u;
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
                {highlightText(part)}
              </a>
            );
          }
          return highlightText(part);
        })}
      </div>
    );
  }, [highlightText]);

  if (isSystem) {
    return <SystemMessage content={message.content} highlightText={highlightText} />;
  }

  return (
    <div 
      ref={bubbleRef}
      id={`msg-${message.id}`}
      className={`flex w-full group/msg ${isMe ? 'justify-end' : 'justify-start'} ${showTail ? 'mt-3 mb-1' : 'my-px'} ${className} ${isHighlighted ? 'animate-pulse-highlight' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      <div
        className={`relative max-w-[90%] sm:max-w-[75%] md:max-w-[65%] px-2 py-1.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] group/bubble ${
          isMe
            ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] ' + (showTail ? 'rounded-l-lg rounded-br-lg rounded-tr-none' : 'rounded-lg')
            : 'bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] ' + (showTail ? 'rounded-r-lg rounded-bl-lg rounded-tl-none' : 'rounded-lg')
        }`}
      >
        {message.type === 'text' && (
          <button
            onClick={handleCopy}
            className={`absolute top-1 ${isMe ? 'left-[-36px]' : 'right-[-36px]'} p-2 rounded-full bg-white/80 dark:bg-[#202c33]/80 text-gray-500 dark:text-gray-400 opacity-0 group-hover/bubble:opacity-100 transition-opacity hover:bg-white dark:hover:bg-black/40 shadow-sm z-10`}
            title="Copy message"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}

        {showTail && <MessageTail isMe={isMe} />}

        {showSender && !isMe && (
          <div className="text-[12.5px] font-semibold text-teal-700 dark:text-[#53bdeb] leading-tight mb-1 px-1 pr-8">
            {highlightText(message.sender)}
          </div>
        )}

        <div className="relative min-w-[60px] pr-12">
          <MediaContent message={message} isMe={isMe} />
          {message.type !== 'call' && (
            <div className="text-[14.2px] leading-[1.4] whitespace-pre-wrap wrap-break-word px-1 pb-1">
              {message.type === 'text' ? renderContentWithLinks(message.content) : null}
            </div>
          )}
          <div className="text-[11px] text-[#667781] dark:text-[#8696a0] absolute right-0 bottom-0.5 shrink-0 select-none flex items-center gap-1 bg-inherit pl-1 rounded-tl-md">
            {message.isEdited && (
              <span className="text-[9px] font-medium opacity-70 uppercase tracking-tight">edited</span>
            )}
            <span>
              {useMemo(() => message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(), [message.timestamp])}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
