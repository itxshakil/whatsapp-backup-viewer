import { useCallback, useState } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';

export const useChatScroll = (messagesLength: number, virtuosoRef: React.RefObject<VirtuosoHandle | null>, scrollRef: React.RefObject<HTMLDivElement | null>) => {
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: messagesLength - 1,
        behavior: 'auto',
        align: 'end'
      });
    } else {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'auto'
      });
    }
  }, [messagesLength, virtuosoRef, scrollRef]);

  const scrollToTop = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: 0,
        behavior: 'auto',
        align: 'start'
      });
    } else {
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
  }, [virtuosoRef, scrollRef]);

  const handleScroll = useCallback((e: any) => {
    const target = e.target;
    if (!target) return;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 300);
    setShowScrollTop(scrollTop > 300);
  }, []);

  return {
    showScrollBottom,
    showScrollTop,
    scrollToBottom,
    scrollToTop,
    handleScroll
  };
};
