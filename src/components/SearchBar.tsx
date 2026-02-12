import React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, messages, setHighlightedMessageId } = useChatStore();
  const [results, setResults] = React.useState<{id: string, index: number}[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setCurrentIndex(-1);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const found = messages
      .map((m, i) => ({ m, i }))
      .filter(({ m }) => 
        (m.type === 'text' || m.type === 'system' || m.type === 'document') &&
        (m.content.toLowerCase().includes(lowerQuery) || m.sender.toLowerCase().includes(lowerQuery))
      )
      .map(({ m, i }) => ({ id: m.id, index: i }));

    setResults(found);
    setCurrentIndex(found.length > 0 ? 0 : -1);
  }, [searchQuery, messages]);

  const goToNext = () => {
    if (results.length === 0) return;
    const nextIdx = (currentIndex + 1) % results.length;
    setCurrentIndex(nextIdx);
    jumpToMessage(results[nextIdx].id);
  };

  const goToPrev = () => {
    if (results.length === 0) return;
    const prevIdx = (currentIndex - 1 + results.length) % results.length;
    setCurrentIndex(prevIdx);
    jumpToMessage(results[prevIdx].id);
  };

  const jumpToMessage = (id: string) => {
    setHighlightedMessageId(id);
    const element = document.getElementById(`msg-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111b21]">
      <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 transition-all mb-1">
        <Search className="text-gray-500 w-4 h-4 mr-3" />
        <input
          type="text"
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm w-full focus:outline-none text-gray-700 dark:text-gray-200"
        />
        {searchQuery && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setSearchQuery('')}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-between px-1 py-1">
          <span className="text-[11px] text-gray-500 dark:text-[#8696a0]">
            {currentIndex + 1} of {results.length}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={goToPrev}
              className="p-1 hover:bg-[#f0f2f5] dark:hover:bg-[#202c33] rounded text-gray-500"
              title="Previous match"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={goToNext}
              className="p-1 hover:bg-[#f0f2f5] dark:hover:bg-[#202c33] rounded text-gray-500"
              title="Next match"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
