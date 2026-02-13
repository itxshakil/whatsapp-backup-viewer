import React from 'react';
import { X, Coffee, Info, BookOpen, Heart, Github, Globe, ExternalLink } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#111b21] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="h-[59px] flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="text-gray-500 dark:text-[#8696a0]" />
          </button>
          <h2 className="text-lg font-medium text-[#111b21] dark:text-[#e9edef]">About & How to Use</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-12">
          
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <div className="w-20 h-20 bg-teal-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg transform rotate-3">
              <Info size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#111b21] dark:text-[#e9edef]">WhatsApp Backup Viewer</h1>
            <p className="text-gray-600 dark:text-[#8696a0] max-w-md mx-auto">
              A private, secure, and beautiful way to explore your WhatsApp chat exports right in your browser.
            </p>
          </section>

          {/* How to Use Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-2">
              <BookOpen className="text-teal-600 dark:text-teal-500" size={24} />
              <h2 className="text-xl font-bold text-[#111b21] dark:text-[#e9edef]">How to Use</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-gray-50 dark:bg-[#202c33] p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-teal-600 dark:text-teal-500 mb-2">1. Export your chat</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0]">
                  Open WhatsApp on your phone, go to a chat, tap on the contact name/group subject, and select <strong>Export Chat</strong>. 
                  Choose <strong>Attach Media</strong> if you want to see photos and videos.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#202c33] p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-teal-600 dark:text-teal-500 mb-2">2. Upload the file</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0]">
                  Upload the <strong>.zip</strong> file (recommended) or the <strong>_chat.txt</strong> file directly to this viewer. 
                  Your data stays on your device and is never uploaded to any server.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#202c33] p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-teal-600 dark:text-teal-500 mb-2">3. Explore & Analyze</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0]">
                  Browse through your messages, view media in the gallery, search for keywords, or check out the <strong>Analytics</strong> tab for interesting insights about your chat.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#202c33] p-5 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-teal-600 dark:text-teal-500 mb-2">4. Save for later</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0]">
                  Chats you upload are saved securely in your browser's local storage (IndexedDB), so you can revisit them anytime without re-uploading.
                </p>
              </div>
            </div>
          </section>

          {/* Creator Section */}
          <section className="bg-teal-50 dark:bg-teal-900/10 p-8 rounded-2xl border border-teal-100 dark:border-teal-900/30 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef]">Made with ❤️ by Shakil</h2>
              <p className="text-gray-600 dark:text-[#8696a0]">
                I built this tool to help people preserve their memories in a more accessible format.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#24292e] text-white rounded-lg hover:bg-black transition-colors text-sm font-medium"
              >
                <Github size={18} />
                GitHub
              </a>
              <a 
                href="https://buymeacoffee.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-black rounded-lg hover:bg-[#FFCC00] transition-colors text-sm font-medium"
              >
                <Coffee size={18} />
                Buy Me a Coffee
              </a>
            </div>
          </section>

          {/* Privacy Note */}
          <section className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <Heart size={12} />
              Privacy First
            </div>
            <p className="text-sm text-gray-500 dark:text-[#8696a0] italic">
              All processing happens locally in your browser. Your chat data never leaves your computer.
            </p>
          </section>

          {/* Footer */}
          <footer className="text-center text-[11px] text-gray-400 dark:text-[#8696a0]/40 pt-8">
            WhatsApp Backup Viewer &copy; {new Date().getFullYear()} • Not affiliated with WhatsApp or Meta.
          </footer>
        </div>
      </div>
    </div>
  );
};
