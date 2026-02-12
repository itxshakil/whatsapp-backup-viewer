import React, { useState, useEffect } from 'react';
import { User, MoreVertical, Moon, Sun, Download, Share2, DownloadCloud } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export const SidebarHeader: React.FC = () => {
  const { messages, metadata } = useChatStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WhatsApp Viewer',
          text: `Checking out this WhatsApp backup of ${metadata?.fileName || 'a chat'}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33]">
      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
        <User className="text-gray-500 dark:text-gray-300 w-6 h-6" />
      </div>
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-teal-600 dark:text-teal-500"
            title="Install App"
          >
            <DownloadCloud size={20} />
          </button>
        )}
        {navigator.share && (
          <button 
            onClick={handleShare}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            title="Share App"
          >
            <Share2 size={20} />
          </button>
        )}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-30"
          title="Export as JSON"
          disabled={!metadata || messages.length === 0}
          onClick={() => {
            if (!metadata || messages.length === 0) return;
            const data = {
              metadata,
              messages
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${metadata.fileName.replace('.txt', '')}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};
