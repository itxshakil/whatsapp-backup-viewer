import React from 'react';

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ sidebar, content }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#0b141a] relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-[85%] max-w-[320px] bg-white dark:bg-[#111b21] transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-[30%] md:min-w-[300px] md:max-w-[420px] md:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        border-r border-gray-300 dark:border-gray-700 flex flex-col
      `}>
        {React.cloneElement(sidebar as React.ReactElement, { onClose: () => setIsSidebarOpen(false) })}
      </div>

      <div className="flex-1 relative flex flex-col bg-[#efeae2] dark:bg-[#0b141a] min-w-0">
        {/* Mobile Toggle Button (only shown when sidebar is closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 md:hidden p-2 bg-white/80 dark:bg-[#202c33]/80 rounded-full shadow-md text-gray-600 dark:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}
        {/* WhatsApp Background Pattern Overlay (Optional) */}
        <div 
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'url("/wa-bg.png")' }}
        ></div>
        <div className="relative flex flex-col h-full">
          {content}
        </div>
      </div>
    </div>
  );
};
