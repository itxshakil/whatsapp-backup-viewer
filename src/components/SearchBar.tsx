import React from 'react';
import { Search, X } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useChatStore();

  return (
    <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111b21]">
      <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 transition-all">
        <Search className="text-gray-500 w-4 h-4 mr-3" />
        <input
          type="text"
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm w-full focus:outline-none text-gray-700 dark:text-gray-200"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
