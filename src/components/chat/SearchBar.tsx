import React from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

export const SearchBar: React.FC = React.memo(() => {
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
      .map((m: any, i: number) => ({ m, i }))
      .filter(({ m }: any) => 
        (m.type === 'text' || m.type === 'system' || m.type === 'document') &&
        (m.content.toLowerCase().includes(lowerQuery) || m.sender.toLowerCase().includes(lowerQuery))
      )
      .map(({ m, i }: any) => ({ id: m.id, index: i }));

    setResults(found);
    setCurrentIndex(found.length > 0 ? 0 : -1);
  }, [searchQuery, messages]);

  const jumpToMessage = React.useCallback((id: string) => {
    setHighlightedMessageId(id);
    // The scrolling is now handled by the useEffect in App.tsx that watches highlightedMessageId
  }, [setHighlightedMessageId]);

  const goToNext = React.useCallback(() => {
    if (results.length === 0) return;
    const nextIdx = (currentIndex + 1) % results.length;
    setCurrentIndex(nextIdx);
    jumpToMessage(results[nextIdx].id);
  }, [results, currentIndex, jumpToMessage, setCurrentIndex]);

  const goToPrev = React.useCallback(() => {
    if (results.length === 0) return;
    const prevIdx = (currentIndex - 1 + results.length) % results.length;
    setCurrentIndex(prevIdx);
    jumpToMessage(results[prevIdx].id);
  }, [results, currentIndex, jumpToMessage, setCurrentIndex]);

  return (
    <div className="p-2 border-b border-wa-divider bg-wa-header-bg">
      <div className="relative flex items-center bg-wa-search-input-bg rounded-lg px-3 py-1.5 shadow-sm">
        <Search className="text-wa-text-secondary w-4 h-4 mr-3" />
        <input
          type="text"
          placeholder="Search messages"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm w-full focus:outline-none text-wa-text-primary placeholder-wa-text-secondary"
        />
        {searchQuery && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                setSearchQuery('');
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(5); } catch (e) {} }
              }}
              className="text-wa-text-secondary hover:text-wa-text-primary p-1 active:scale-90"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-between px-1 py-1">
          <span className="text-[11px] text-wa-text-secondary font-medium">
            {currentIndex + 1} of {results.length}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                goToPrev();
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(5); } catch (e) {} }
              }}
              className="p-1 hover:bg-wa-search-bg dark:hover:bg-white/5 rounded text-wa-icon active:scale-90"
              title="Previous match"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={() => {
                goToNext();
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(5); } catch (e) {} }
              }}
              className="p-1 hover:bg-wa-search-bg dark:hover:bg-white/5 rounded text-wa-icon active:scale-90"
              title="Next match"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
