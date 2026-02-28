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
          className="fixed bottom-20 right-6 w-12 h-12 bg-white dark:bg-[#202c33] shadow-lg rounded-full flex items-center justify-center text-gray-500 dark:text-[#8696a0] hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-all z-30 border border-gray-100 dark:border-gray-700"
          title="Scroll to top"
        >
          <ChevronUp size={28} />
        </button>
      )}

      {showScrollBottom && (
        <button
          onClick={onScrollBottom}
          className="fixed bottom-6 right-6 w-12 h-12 bg-white dark:bg-[#202c33] shadow-lg rounded-full flex items-center justify-center text-gray-500 dark:text-[#8696a0] hover:bg-gray-50 dark:hover:bg-[#2a3942] transition-all z-30 border border-gray-100 dark:border-gray-700"
          title="Scroll to bottom"
        >
          <ChevronDown size={28} />
        </button>
      )}
    </>
  );
};
