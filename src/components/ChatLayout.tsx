import React from 'react';

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ sidebar, content }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#0b141a]">
      <div className="w-[30%] min-w-[300px] max-w-[420px] flex-shrink-0 border-r border-gray-300 dark:border-gray-700 flex flex-col">
        {sidebar}
      </div>
      <div className="flex-1 relative flex flex-col bg-[#efeae2] dark:bg-[#0b141a]">
        {/* WhatsApp Background Pattern Overlay (Optional) */}
        <div 
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}
        ></div>
        <div className="relative flex flex-col h-full">
          {content}
        </div>
      </div>
    </div>
  );
};
