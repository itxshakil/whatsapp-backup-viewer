import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { MessageBubble } from './MessageBubble';
import { Message } from '@/types/message';
import { useChatStore } from '@/store/chatStore';
import { useSearch } from '@/hooks/useSearch';
import { useGroupedMessages, GroupedItem } from '@/hooks/useGroupedMessages';

interface MessageListProps {
  messages: Message[];
  onScroll?: (e: any) => void;
}

const DateHeader: React.FC<{ label: string; id: string }> = React.memo(({ label, id }) => (
  <div id={id} className="flex justify-center my-4 sticky top-2 z-10 pointer-events-none">
    <div className="bg-white/90 dark:bg-[#182229]/90 backdrop-blur-sm dark:text-[#8696a0] text-gray-600 text-[12.5px] px-3 py-1.5 rounded-lg shadow-sm uppercase pointer-events-auto">
      {label}
    </div>
  </div>
));

export const MessageList: React.FC<MessageListProps & { ref?: React.Ref<VirtuosoHandle> }> = React.memo(forwardRef(({ messages, onScroll }, ref) => {
  const { searchQuery } = useChatStore();
  const filteredMessages = useSearch(messages, searchQuery);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useImperativeHandle(ref, () => virtuosoRef.current!);

  const data = useGroupedMessages(filteredMessages);

  if (filteredMessages.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500 dark:text-[#8696a0]">
        <p>No messages found matching "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <Virtuoso
      ref={virtuosoRef}
      style={{ height: '100%' }}
      data={data}
      initialTopMostItemIndex={data.length - 1}
      followOutput="smooth"
      onScroll={onScroll}
      itemContent={(index, item: GroupedItem) => {
        if (item.type === 'date-header') {
          return <DateHeader label={item.label!} id={item.id} />;
        }
        return (
          <div id={item.id} className="px-2 md:px-16 lg:px-24 max-w-full">
            <MessageBubble 
              message={item.message!} 
              showSender={item.showSender}
              showTail={item.showTail}
              className={item.marginBottom}
            />
          </div>
        );
      }}
    />
  );
}));
