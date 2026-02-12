import React from 'react';
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
        className={`relative max-w-[85%] sm:max-w-[65%] px-2.5 py-1.5 shadow-sm ${
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
          <div className="text-[14.2px] leading-relaxed whitespace-pre-wrap break-words pr-[2px]">
            {highlightText(message.content, searchQuery)}
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
