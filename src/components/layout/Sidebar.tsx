import React, { useMemo, useCallback } from 'react';
import { useChatStore } from '../../store/chatStore';
import { User, MessageSquare, Search, LogOut, Trash2, Calendar, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { SidebarHeader } from './SidebarHeader';
import { DayPicker } from 'react-day-picker';
import { SavedChat } from '../../store/db';
import 'react-day-picker/dist/style.css';

export const Sidebar: React.FC<{ onClose?: () => void; onShowAbout?: () => void }> = React.memo(({ onClose, onShowAbout }) => {
  const { messages, metadata, clearChat, savedChats, loadChat, deleteChat, clearAllData, setHighlightedMessageId } = useChatStore();
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleCloseChat = useCallback(() => {
    clearChat();
  }, [clearChat]);

  const availableDates = useMemo(() => {
    if (!messages.length) return [];
    const dates = new Set<string>();
    messages.forEach((msg: any) => {
      dates.add(dayjs(msg.timestamp).format('YYYY-MM-DD'));
    });
    return Array.from(dates).sort((a, b) => b.localeCompare(a)); // Newest first
  }, [messages]);

  const handleJumpToDate = useCallback((date: string) => {
    // Find the index of the date header in the MessageList's data
    // We need to match how MessageList generates its data
    // However, Sidebar doesn't have access to MessageList's internal data
    // So we'll try to find the message ID and then use a new store function to trigger scroll
    const firstMessageOfDay = messages.find((m: any) => {
      return dayjs(m.timestamp).format('YYYY-MM-DD') === date;
    });

    if (firstMessageOfDay) {
      setHighlightedMessageId(firstMessageOfDay.id);
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
    onClose?.();
  }, [messages, setHighlightedMessageId, onClose]);

  const handleDaySelect = useCallback((date: any) => {
    if (date) {
      handleJumpToDate(dayjs(date).format('YYYY-MM-DD'));
    }
  }, [handleJumpToDate]);

  const handleLoadChat = useCallback((id: number) => {
    loadChat(id);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
    onClose?.();
  }, [loadChat, onClose]);

  const toggleCalendar = useCallback(() => {
    setShowCalendar(prev => !prev);
  }, []);

  const handleConfirmDelete = useCallback((e: React.MouseEvent, chat: any) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${chat.metadata.fileName}"?`)) {
      chat.id && deleteChat(chat.id);
    }
  }, [deleteChat]);

  const handleJumpToBottom = useCallback(() => {
    // Scroll to bottom of message list
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'auto'
      });
    }
  }, []);

  const participantItems = useMemo(() => {
    if (!metadata) return [];
    return metadata.participants.map((participant: string) => (
      <li key={participant} className="text-sm text-gray-700 dark:text-[#e9edef] flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
        {participant}
      </li>
    ));
  }, [metadata]);

  const sidebarChatInfo = useMemo(() => {
    if (!metadata) return null;
    return (
      <div className="p-4 mt-2 bg-[#f0f2f5] dark:bg-[#111b21]/50 border-y border-gray-100 dark:border-gray-800/50">
        <h4 className="text-[12px] font-semibold text-teal-700 dark:text-[#00a884] uppercase tracking-[0.1em] mb-3">Chat Info</h4>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-[#667781] dark:text-[#8696a0] uppercase font-bold mb-2">Participants</p>
            <ul className="space-y-1.5">
              {participantItems}
            </ul>
          </div>
        </div>
      </div>
    );
  }, [participantItems, metadata]);

  const chatItems = useMemo(() => {
    return savedChats.map((chat: any) => {
      const isActive = metadata?.fileName === chat.metadata.fileName;
      return (
        <div 
          key={chat.id}
          onClick={() => chat.id && handleLoadChat(chat.id)}
          className={`group flex items-center p-3 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800/50 relative ${
            isActive ? 'bg-[#ebebeb] dark:bg-[#2a3942]' : ''
          }`}
        >
          <div className="w-12 h-12 bg-gray-200 dark:bg-[#202c33] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <MessageSquare className="text-[#8696a0] w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 pr-10">
            <div className="flex justify-between items-baseline">
              <h3 className={`font-normal truncate mr-2 text-base ${isActive ? 'text-[#111b21] dark:text-[#e9edef]' : 'text-[#111b21] dark:text-[#e9edef]'}`}>
                {chat.metadata.fileName}
              </h3>
            </div>
            <p className="text-sm text-[#667781] dark:text-[#8696a0] truncate">
              {chat.metadata.messageCount} messages
            </p>
            <p className="text-[11px] text-[#667781]/70 dark:text-[#8696a0]/60 mt-0.5">
              Last opened: {dayjs(chat.lastOpened).fromNow()}
            </p>
          </div>
          <button 
            onClick={(e) => handleConfirmDelete(e, chat)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8696a0] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Delete saved chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    });
  }, [savedChats, metadata?.fileName, handleLoadChat, handleConfirmDelete]);

  const dateJumpItems = useMemo(() => {
    return availableDates.slice(0, 12).map((date: string) => (
      <button
        key={date}
        onClick={() => handleJumpToDate(date)}
        className="text-[11px] py-1.5 px-2 bg-gray-50 dark:bg-[#202c33] hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-600 dark:text-[#e9edef] rounded border border-gray-100 dark:border-gray-700 transition-colors text-center truncate"
      >
        {dayjs(date).format('MMM D, YYYY')}
      </button>
    ));
  }, [availableDates, handleJumpToDate]);

  const dateJumpSection = useMemo(() => {
    if (!metadata || availableDates.length <= 1) return null;
    return (
      <div className="p-4 bg-white dark:bg-[#111b21] border-t border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[12px] font-semibold text-teal-700 dark:text-[#00a884] uppercase tracking-[0.1em] flex items-center gap-2">
            <Calendar size={14} />
            Jump to Date
          </h4>
          <button 
            onClick={toggleCalendar}
            className="text-[11px] text-[#667781] dark:text-[#8696a0] hover:text-teal-700 dark:hover:text-[#00a884] transition-colors font-medium"
          >
            {showCalendar ? 'Show List' : 'Show Calendar'}
          </button>
        </div>

        {showCalendar ? (
          <div className="flex justify-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg p-1 scale-90 origin-top overflow-hidden">
            <DayPicker 
              mode="single"
              onSelect={handleDaySelect}
              disabled={(date: any) => !availableDates.includes(dayjs(date).format('YYYY-MM-DD'))}
              modifiers={{
                available: (date: any) => availableDates.includes(dayjs(date).format('YYYY-MM-DD'))
              }}
              modifiersClassNames={{
                available: "font-bold text-teal-700 dark:text-[#00a884]"
              }}
              classNames={{
                root: "w-full flex justify-center",
                month: "w-full",
                caption: "flex justify-center items-center h-10 relative mb-2",
                caption_label: "text-sm font-medium text-[#111b21] dark:text-[#e9edef]",
                nav: "flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-[#667781] dark:text-[#8696a0] rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-8 w-8 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-full text-[#111b21] dark:text-[#e9edef]",
                day_selected: "bg-teal-700 text-white hover:bg-teal-700 hover:text-white focus:bg-teal-700 focus:text-white dark:bg-[#00a884]",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-[#667781] dark:text-[#8696a0] opacity-50",
                day_disabled: "text-[#667781] dark:text-[#8696a0] opacity-20",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1">
            {dateJumpItems}
          </div>
        )}
        {!showCalendar && availableDates.length > 12 && (
          <p className="text-[11px] text-[#667781]/70 dark:text-[#8696a0]/60 mt-2 text-center italic">Scroll for more dates</p>
        )}
      </div>
    );
  }, [metadata, availableDates, showCalendar, toggleCalendar, handleDaySelect, dateJumpItems]);

  const handleClearAllData = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear ALL saved chats? This cannot be undone.')) {
      await clearAllData();
    }
  }, [clearAllData]);

  const sidebarActions = useMemo(() => {
    if (!metadata) return null;
    return (
      <div className="p-3 border-t border-gray-100 dark:border-gray-800/50 space-y-2 bg-[#f0f2f5] dark:bg-[#111b21]">
        {savedChats.length > 0 && (
          <button
            onClick={handleClearAllData}
            className="flex items-center justify-center gap-2 w-full py-2 text-[#667781] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-xs font-medium"
          >
            <Trash2 size={14} />
            Clear All Data
          </button>
        )}
        <button
          onClick={() => {
            handleJumpToBottom();
            onClose?.();
          }}
          className="flex items-center justify-center gap-2 w-full py-2 text-teal-700 dark:text-[#00a884] hover:bg-teal-50 dark:hover:bg-teal-900/10 rounded-lg transition-colors text-sm font-medium"
        >
          <ChevronDown size={16} />
          Jump to Bottom
        </button>
        <button
          onClick={handleCloseChat}
          className="flex items-center justify-center gap-2 w-full py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Close Chat
        </button>
      </div>
    );
  }, [metadata, savedChats.length, handleClearAllData, handleJumpToBottom, onClose, handleCloseChat]);

  const sidebarRecentChats = useMemo(() => {
    if (savedChats.length === 0) return null;
    return (
      <div className="mt-2 w-full text-left">
        <h4 className="text-[12px] font-semibold text-[#667781] dark:text-[#8696a0] uppercase tracking-[0.1em] mb-3 px-3">Recent Chats</h4>
        <div className="space-y-0">
          {chatItems}
        </div>
      </div>
    );
  }, [savedChats, chatItems]);

  const sidebarEmptyState = useMemo(() => {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#111b21]">
        <SidebarHeader onShowAbout={onShowAbout} />
        
        <div className="flex-1 flex flex-col items-center justify-center md:p-2 text-center bg-white dark:bg-[#111b21] overflow-y-auto">
          {savedChats.length === 0 ? (
            <div className="px-6">
              <div className="w-16 h-16 bg-[#f0f2f5] dark:bg-[#202c33] rounded-full flex items-center justify-center mb-6 mx-auto">
                <MessageSquare className="text-[#8696a0] w-8 h-8" />
              </div>
              <h3 className="text-[#111b21] dark:text-[#e9edef] font-medium text-lg">WhatsApp Viewer</h3>
              <p className="text-sm text-[#667781] dark:text-[#8696a0] mt-2">Upload a chat backup to get started</p>
            </div>
          ) : (
            <div className="w-full flex flex-col h-full">
              {sidebarRecentChats}
            </div>
          )}
        </div>
      </div>
    );
  }, [onShowAbout, sidebarRecentChats, savedChats.length]);

  if (!metadata) {
    return sidebarEmptyState;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21]">
      {/* Sidebar Header */}
      <SidebarHeader onShowAbout={onShowAbout} />

      {/* Chat List - Display saved chats */}
      <div className="flex-1 overflow-y-auto">
        {chatItems}

        {/* Info Section for current chat */}
        {sidebarChatInfo}

        {/* Date Jump Section */}
        {dateJumpSection}
      </div>

      {/* Footer / Actions */}
      {sidebarActions}
    </div>
  );
});
