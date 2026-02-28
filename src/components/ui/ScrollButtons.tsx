import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ScrollButtonsProps {
  showScrollTop: boolean;
  showScrollBottom: boolean;
  onScrollTop: () => void;
  onScrollBottom: () => void;
}

export const ScrollButtons: React.FC<ScrollButtonsProps> = ({
  showScrollTop,
  showScrollBottom,
  onScrollTop,
  onScrollBottom,
}) => {
  return (
    <>
      {showScrollTop && (
        <button
          onClick={onScrollTop}
          className="fixed bottom-20 right-6 w-12 h-12 bg-wa-other-bubble shadow-lg rounded-full flex items-center justify-center text-wa-icon hover:bg-wa-search-bg transition-all z-30 border border-wa-divider"
          title="Scroll to top"
        >
          <ChevronUp size={28} />
        </button>
      )}

      {showScrollBottom && (
        <button
          onClick={onScrollBottom}
          className="fixed bottom-6 right-6 w-12 h-12 bg-wa-other-bubble shadow-lg rounded-full flex items-center justify-center text-wa-icon hover:bg-wa-search-bg transition-all z-30 border border-wa-divider"
          title="Scroll to bottom"
        >
          <ChevronDown size={28} />
        </button>
      )}
    </>
  );
};
