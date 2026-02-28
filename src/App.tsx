import React, { useCallback, useState } from 'react';
import { ChatProvider } from './store/chatStore';
import { ChatLayout } from './components/layout/ChatLayout';
import { Sidebar } from './components/layout/Sidebar';
import { AboutPage } from './components/ui/AboutPage';
import { ChatContent } from './components/layout/ChatContent';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  const handleShowAbout = useCallback(() => setShowAbout(true), []);
  const handleHideAbout = useCallback(() => setShowAbout(false), []);

  return (
    <ChatProvider>
      <ChatLayout
        sidebar={<Sidebar onShowAbout={handleShowAbout} />}
        content={<ChatContent onShowAbout={handleShowAbout} />}
      />
      {showAbout && <AboutPage onClose={handleHideAbout} />}
    </ChatProvider>
  );
}

export default App;
