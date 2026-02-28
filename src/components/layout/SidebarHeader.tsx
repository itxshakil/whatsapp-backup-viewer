import React, { useState, useEffect, useCallback } from 'react';
import { User, Download, Share2, DownloadCloud, Info } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

interface SidebarHeaderProps {
  onShowAbout?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = React.memo(({ onShowAbout }) => {
  const { messages, metadata } = useChatStore();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([10, 30, 10]);
        } catch (e) {}
      }
    }
  }, [deferredPrompt]);

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const updateThemeColor = (e: MediaQueryListEvent | MediaQueryList) => {
      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', e.matches ? '#111b21' : '#075e54');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateThemeColor(mediaQuery);
    
    mediaQuery.addEventListener('change', updateThemeColor);
    return () => mediaQuery.removeEventListener('change', updateThemeColor);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(5); } catch (e) {} }
        await navigator.share({
          title: 'WhatsApp Viewer',
          text: `Checking out this WhatsApp backup of ${metadata?.fileName || 'a chat'}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  }, [metadata?.fileName]);

  const handleExportJSON = useCallback(() => {
    if (!metadata || messages.length === 0) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(5); } catch (e) {} }
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
  }, [metadata, messages]);

  return (
    <div className="h-[60px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-300 dark:border-gray-700/50 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/*<div className="w-10 h-10 bg-[#dfe5e7] dark:bg-[#111b21] rounded-full flex items-center justify-center text-[#54656f] dark:text-[#aebac1] overflow-hidden">*/}
        {/*  <User className="w-6 h-6" />*/}
        {/*</div>*/}
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-[#111b21] dark:text-[#e9edef] leading-tight">WhatsApp Backup Viewer</h2>
          <p className="text-[11px] text-[#667781] dark:text-[#8696a0]">Archive Tool</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[#54656f] dark:text-[#aebac1]">
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-teal-600 dark:text-teal-500"
            title="Install App"
          >
            <DownloadCloud size={20} />
          </button>
        )}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button 
            onClick={handleShare}
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            title="Share App"
          >
            <Share2 size={20} />
          </button>
        )}
        <button 
          onClick={() => {
            onShowAbout?.();
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) { try { navigator.vibrate(5); } catch (e) {} }
          }}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors active:scale-90"
          title="About & Help"
        >
          <Info size={20} />
        </button>
        <button 
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors disabled:opacity-30 active:scale-90"
          title="Export as JSON"
          disabled={!metadata || messages.length === 0}
          onClick={handleExportJSON}
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
});
