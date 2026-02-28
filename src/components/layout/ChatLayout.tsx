import React from 'react';

interface ChatLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const ChatLayout: React.FC<ChatLayoutProps> = React.memo(({ sidebar, content }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-dvh w-full overflow-hidden bg-wa-header-bg dark:bg-wa-bg relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 w-[85%] max-w-[360px] bg-wa-sidebar-bg transform transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        md:relative md:translate-x-0 md:w-[30%] md:min-w-[300px] md:max-w-[420px] md:z-auto
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {React.cloneElement(sidebar as React.ReactElement<any>, { onClose: () => setIsSidebarOpen(false) })}
      </div>

      <div className="flex-1 relative flex flex-col bg-wa-bg min-w-0">
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-2.5 left-2.5 z-30 md:hidden p-2 bg-wa-search-input-bg rounded-full shadow-md text-wa-icon border border-wa-divider active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        )}
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
});
