import React from 'react';
import { X, Coffee, Info, BookOpen, Heart, Github, Smartphone, FileArchive, Search, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = React.memo(({ onClose }) => {
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
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-16">
          
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <div className="w-20 h-20 bg-teal-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg transform rotate-3">
              <Info size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#111b21] dark:text-[#e9edef]">WhatsApp Backup Viewer & Analyzer</h1>
            <p className="text-gray-600 dark:text-[#8696a0] max-w-md mx-auto text-lg">
              A private, secure, and beautiful tool to explore your WhatsApp chat exports right in your browser. 100% offline and local-first.
            </p>
          </section>

          {/* How to Use Section - Modern Visual Guide */}
          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef] flex items-center justify-center gap-3">
                <BookOpen className="text-teal-600 dark:text-teal-500" size={28} />
                Getting Started
              </h2>
              <p className="text-gray-500 dark:text-[#8696a0]">Follow these 4 simple steps to view your chat</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 relative">
              {/* Connector lines for desktop */}
              <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-px bg-teal-100 dark:bg-teal-900/30 -translate-x-1/2 z-0"></div>
              <div className="hidden md:block absolute top-1/2 left-12 right-12 h-px bg-teal-100 dark:bg-teal-900/30 -translate-y-1/2 z-0"></div>

              <div className="relative z-10 bg-white dark:bg-[#202c33] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:border-teal-500/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-white dark:ring-[#111b21] group-hover:scale-110 transition-transform">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#111b21] dark:text-[#e9edef] mb-2">1. Export your chat</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0] leading-relaxed">
                  Open a WhatsApp chat, tap the contact name, and select <strong>Export Chat</strong>. 
                  Choose <strong>Attach Media</strong> for photos and videos.
                </p>
              </div>

              <div className="relative z-10 bg-white dark:bg-[#202c33] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:border-teal-500/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-white dark:ring-[#111b21] group-hover:scale-110 transition-transform">
                  <FileArchive size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#111b21] dark:text-[#e9edef] mb-2">2. Upload the file</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0] leading-relaxed">
                  Upload the <strong>.zip</strong> file (recommended) or the <strong>_chat.txt</strong> file. 
                  All processing happens <strong>locally</strong> in your browser.
                </p>
              </div>

              <div className="relative z-10 bg-white dark:bg-[#202c33] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:border-teal-500/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-white dark:ring-[#111b21] group-hover:scale-110 transition-transform">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#111b21] dark:text-[#e9edef] mb-2">3. Explore & Analyze</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0] leading-relaxed">
                  Browse messages, view media in the gallery, search keywords, or check the <strong>Analytics</strong> tab for insights.
                </p>
              </div>

              <div className="relative z-10 bg-white dark:bg-[#202c33] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center group hover:border-teal-500/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-white dark:ring-[#111b21] group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#111b21] dark:text-[#e9edef] mb-2">4. Private & Secure</h3>
                <p className="text-sm text-gray-600 dark:text-[#8696a0] leading-relaxed">
                  Chats are saved securely in your browser's local storage. Your data <strong>never</strong> leaves your device.
                </p>
              </div>
            </div>
          </section>

          {/* Creator Section */}
          <section className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 p-10 rounded-3xl border border-teal-100 dark:border-teal-900/30 text-center space-y-8 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#111b21] dark:text-[#e9edef]">Made with ❤️ by Shakil</h2>
              <p className="text-gray-600 dark:text-[#8696a0] max-w-lg mx-auto leading-relaxed">
                I built this tool to help people preserve their memories in a more accessible format. If you find it useful, consider supporting the project!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-3 bg-[#24292e] text-white rounded-xl hover:bg-black transition-all text-sm font-semibold shadow-sm hover:shadow-lg active:scale-95 group"
              >
                <Github size={20} className="group-hover:rotate-12 transition-transform" />
                GitHub
              </a>
              <a 
                href="https://buymeacoffee.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-3 bg-[#FFDD00] text-black rounded-xl hover:bg-[#FFCC00] transition-all text-sm font-semibold shadow-sm hover:shadow-lg active:scale-95 group"
              >
                <Coffee size={20} className="group-hover:bounce transition-transform" />
                Buy Me a Coffee
              </a>
            </div>
          </section>

          {/* Privacy Note */}
          <section className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <Heart size={14} className="fill-current" />
              Privacy First
            </div>
            <p className="text-sm text-gray-500 dark:text-[#8696a0] italic">
              All processing happens locally in your browser. Your chat data never leaves your computer.
            </p>
          </section>

          {/* Footer */}
          <footer className="text-center text-[11px] text-gray-400 dark:text-[#8696a0]/40 pb-8">
            WhatsApp Backup Viewer &copy; {new Date().getFullYear()} • Not affiliated with WhatsApp or Meta.
          </footer>
        </div>
      </div>
    </div>
  );
});
