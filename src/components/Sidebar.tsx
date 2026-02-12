import React from 'react';
import { useChatStore } from '../store/chatStore';
import { User, MessageSquare, MoreVertical, Search, LogOut } from 'lucide-react';
import dayjs from 'dayjs';

export const Sidebar: React.FC = () => {
  const { metadata, clearChat, messages } = useChatStore();

  if (!metadata) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-[#f0f2f5]">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="text-gray-400 w-8 h-8" />
        </div>
        <h3 className="text-gray-600 font-medium">WhatsApp Viewer</h3>
        <p className="text-sm text-gray-400 mt-2">Upload a chat backup to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111b21]">
      {/* Sidebar Header */}
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33]">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <User className="text-gray-500 dark:text-gray-300 w-6 h-6" />
        </div>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-300">
          <button title="Settings">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar Placeholder */}
      <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111b21]">
        <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5">
          <Search className="text-gray-500 w-4 h-4 mr-3" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-sm w-full focus:outline-none text-gray-700 dark:text-gray-200"
            disabled
          />
        </div>
      </div>

      {/* Chat List - Single Chat Item for now */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center p-3 hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <MessageSquare className="text-gray-400 w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className="font-medium text-[#111b21] dark:text-[#e9edef] truncate mr-2">
                {metadata.fileName}
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#8696a0] truncate">
              {messages.length > 0 ? dayjs(messages[0].timestamp).format('DD/MM/YYYY') : ''} - {messages.length > 0 ? dayjs(messages[messages.length - 1].timestamp).format('DD/MM/YYYY') : ''}
            </p>
            <p className="text-xs text-gray-500 dark:text-[#8696a0] truncate">
              {metadata.messageCount} messages
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-teal-600 dark:text-teal-500 uppercase tracking-wider mb-2">Participants</h4>
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

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={clearChat}
          className="flex items-center justify-center gap-2 w-full py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          Close Chat
        </button>
      </div>
    </div>
  );
};
