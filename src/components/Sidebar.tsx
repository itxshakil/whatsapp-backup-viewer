import React, { useMemo } from 'react';
import { useChatStore } from '../store/chatStore';
import { User, MessageSquare, MoreVertical, Search, LogOut, Trash2, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

import { SidebarHeader } from './SidebarHeader';
import { SearchBar } from './SearchBar';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { messages, metadata, clearChat, savedChats, loadChat, deleteChat, clearAllData } = useChatStore();
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleCloseChat = () => {
    clearChat();
    if (onClose) onClose();
  };

  const availableDates = useMemo(() => {
    if (!messages.length) return [];
    const dates = new Set<string>();
    messages.forEach(msg => {
      dates.add(dayjs(msg.timestamp).format('YYYY-MM-DD'));
    });
    return Array.from(dates).sort().reverse(); // Newest first
  }, [messages]);

  const jumpToDate = (date: string) => {
    const element = document.getElementById(`date-${date}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (onClose) onClose();
    }
  };

  if (!metadata) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#f0f2f5] dark:bg-[#111b21]">
        <div className="w-16 h-16 bg-gray-200 dark:bg-[#202c33] rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="text-gray-400 w-8 h-8" />
        </div>
        <h3 className="text-gray-600 dark:text-[#e9edef] font-medium">WhatsApp Viewer</h3>
        <p className="text-sm text-gray-400 mt-2">Upload a chat backup to get started</p>
        
        {/* Quick access to saved chats in sidebar when none is open */}
        {savedChats.length > 0 && (
          <div className="mt-8 w-full text-left">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Recent</h4>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {savedChats.slice(0, 5).map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => chat.id && loadChat(chat.id)}
                  className="group relative p-3 hover:bg-gray-300/50 dark:hover:bg-[#2a3942] rounded-lg cursor-pointer transition-colors"
                >
                  <p className="text-sm text-gray-700 dark:text-[#e9edef] truncate font-medium pr-6">{chat.metadata.fileName}</p>
                  <p className="text-[10px] text-gray-500">{chat.metadata.messageCount} messages</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      chat.id && deleteChat(chat.id);
                    }}
                    className="absolute top-3 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete saved chat"
                  >
                    <LogOut size={12} className="rotate-180" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21]">
      {/* Sidebar Header */}
      <SidebarHeader />

      {/* Search Bar */}
      <SearchBar />

      {/* Chat List - Display saved chats */}
      <div className="flex-1 overflow-y-auto">
        {savedChats.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => chat.id && loadChat(chat.id)}
            className={`group flex items-center p-3 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 relative ${
              metadata.fileName === chat.metadata.fileName ? 'bg-[#ebebeb] dark:bg-[#2a3942]' : ''
            }`}
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <MessageSquare className="text-gray-400 w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 pr-10">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-[#111b21] dark:text-[#e9edef] truncate mr-2 text-sm">
                  {chat.metadata.fileName}
                </h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-[#8696a0] truncate">
                {chat.metadata.messageCount} messages
              </p>
              <p className="text-[10px] text-gray-400 dark:text-[#8696a0]/60">
                Last opened: {dayjs(chat.lastOpened).format('MMM D, HH:mm')}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${chat.metadata.fileName}"?`)) {
                  chat.id && deleteChat(chat.id);
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Delete saved chat"
            >
              <LogOut size={14} className="rotate-180" />
            </button>
          </div>
        ))}

        {/* Info Section for current chat */}
        <div className="p-4 mt-2 bg-[#f0f2f5] dark:bg-[#111b21]/50">
          <h4 className="text-xs font-semibold text-teal-600 dark:text-teal-500 uppercase tracking-wider mb-3">Chat Info</h4>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-gray-500 uppercase font-bold mb-1">Participants</p>
              <ul className="space-y-1">
                {metadata.participants.map(participant => (
                  <li key={participant} className="text-sm text-gray-700 dark:text-[#e9edef] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    {participant}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Date Jump Section */}
        {availableDates.length > 1 && (
          <div className="p-4 bg-white dark:bg-[#111b21] border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-teal-600 dark:text-teal-500 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} />
                Jump to Date
              </h4>
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-[10px] text-gray-500 hover:text-teal-600 transition-colors font-medium"
              >
                {showCalendar ? 'Show List' : 'Show Calendar'}
              </button>
            </div>

            {showCalendar ? (
              <div className="flex justify-center bg-gray-50 dark:bg-[#202c33] rounded-lg p-1 scale-90 origin-top">
                <DayPicker 
                  mode="single"
                  onSelect={(date) => date && jumpToDate(dayjs(date).format('YYYY-MM-DD'))}
                  disabled={(date) => !availableDates.includes(dayjs(date).format('YYYY-MM-DD'))}
                  modifiers={{
                    available: (date) => availableDates.includes(dayjs(date).format('YYYY-MM-DD'))
                  }}
                  modifiersClassNames={{
                    available: "font-bold text-teal-600 dark:text-teal-400"
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-1">
                {availableDates.slice(0, 12).map(date => (
                  <button
                    key={date}
                    onClick={() => jumpToDate(date)}
                    className="text-[11px] py-1.5 px-2 bg-gray-50 dark:bg-[#202c33] hover:bg-teal-50 dark:hover:bg-teal-900/20 text-gray-600 dark:text-[#e9edef] rounded border border-gray-100 dark:border-gray-700 transition-colors text-center truncate"
                  >
                    {dayjs(date).format('MMM D, YYYY')}
                  </button>
                ))}
              </div>
            )}
            {!showCalendar && availableDates.length > 12 && (
              <p className="text-[10px] text-gray-400 mt-2 text-center italic">Scroll for more dates</p>
            )}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        {savedChats.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear ALL saved chats? This cannot be undone.')) {
                clearAllData();
              }
            }}
            className="flex items-center justify-center gap-2 w-full py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-xs font-medium"
          >
            <Trash2 size={14} />
            Clear All Data
          </button>
        )}
        <button
          onClick={handleCloseChat}
          className="flex items-center justify-center gap-2 w-full py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Close Chat
        </button>
      </div>
    </div>
  );
};
