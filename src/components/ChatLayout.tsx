import React from 'react';

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ sidebar, content }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-80 flex-shrink-0 border-r border-gray-300 bg-gray-50 flex flex-col">
        {sidebar}
      </div>
      <div className="flex-1 relative flex flex-col bg-[#e5ddd5] dark:bg-[#111b21]">
        {content}
      </div>
    </div>
  );
};
