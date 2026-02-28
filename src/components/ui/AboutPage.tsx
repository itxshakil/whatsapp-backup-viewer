import React from 'react';
import { X, Coffee, Info, BookOpen, Heart, Github, Smartphone, FileArchive, Search, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = React.memo(({ onClose }) => {
  return (
    <div className="fixed inset-0 z-100 bg-wa-sidebar-bg flex flex-col animate-fade-in h-dvh overflow-hidden">
      <div className="h-[60px] flex items-center justify-between px-4 bg-wa-header-bg border-b border-wa-divider shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors text-wa-icon"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <h2 className="text-lg font-semibold text-wa-text-primary">About & How to Use</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-16">
          
          <section className="text-center space-y-4">
            <div className="w-20 h-20 bg-wa-teal rounded-2xl mx-auto flex items-center justify-center shadow-lg transform rotate-3">
              <Info size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-wa-text-primary">WhatsApp Backup Viewer</h1>
            <p className="text-wa-text-secondary max-w-md mx-auto text-lg leading-relaxed">
              A private, secure, and beautiful tool to explore your WhatsApp chat exports right in your browser. 100% offline and local-first.
            </p>
          </section>

          <section className="space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-wa-text-primary flex items-center justify-center gap-3">
                <BookOpen className="text-wa-teal" size={28} />
                Getting Started
              </h2>
              <p className="text-wa-text-secondary">Follow these 4 simple steps to view your chat</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 relative">
              <div className="hidden md:block absolute left-1/2 top-12 bottom-12 w-px bg-teal-100/50 dark:bg-teal-900/30 -translate-x-1/2 z-0"></div>
              <div className="hidden md:block absolute top-1/2 left-12 right-12 h-px bg-teal-100/50 dark:bg-teal-900/30 -translate-y-1/2 z-0"></div>

              <div className="relative z-10 bg-wa-panel-bg p-6 rounded-2xl shadow-sm border border-wa-divider flex flex-col items-center text-center group hover:border-wa-teal/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-wa-sidebar-bg group-hover:scale-110 transition-transform shadow-sm">
                  <Smartphone size={24} />
                </div>
                <h3 className="text-lg font-bold text-wa-text-primary mb-2">Export your chat</h3>
                <p className="text-sm text-wa-text-secondary leading-relaxed">
                  Open a chat in WhatsApp → Tap contact name → Select <strong>Export Chat</strong> → Choose <strong>Attach Media</strong> (recommended).
                </p>
              </div>

              <div className="relative z-10 bg-wa-panel-bg p-6 rounded-2xl shadow-sm border border-wa-divider flex flex-col items-center text-center group hover:border-wa-teal/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-wa-sidebar-bg group-hover:scale-110 transition-transform shadow-sm">
                  <FileArchive size={24} />
                </div>
                <h3 className="text-lg font-bold text-wa-text-primary mb-2">Upload the File</h3>
                <p className="text-sm text-wa-text-secondary leading-relaxed">
                  Upload the exported <strong>.zip</strong> or <strong>_chat.txt</strong> file. 
                  Your data is parsed <strong>locally</strong> in your browser.
                </p>
              </div>

              <div className="relative z-10 bg-wa-panel-bg p-6 rounded-2xl shadow-sm border border-wa-divider flex flex-col items-center text-center group hover:border-wa-teal/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-wa-sidebar-bg group-hover:scale-110 transition-transform shadow-sm">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-bold text-wa-text-primary mb-2">Explore & Analyze</h3>
                <ul className="text-sm text-wa-text-secondary leading-relaxed text-left space-y-1">
                  <li>• Browse messages in a WhatsApp-style layout</li>
                  <li>• View all media in the gallery</li>
                  <li>• Search for keywords instantly</li>
                  <li>• Analyze chat statistics</li>
                </ul>
              </div>

              <div className="relative z-10 bg-wa-panel-bg p-6 rounded-2xl shadow-sm border border-wa-divider flex flex-col items-center text-center group hover:border-wa-teal/30 transition-all hover:shadow-md hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4 ring-8 ring-wa-sidebar-bg group-hover:scale-110 transition-transform shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-wa-text-primary mb-2">Stay Private</h3>
                <p className="text-sm text-wa-text-secondary leading-relaxed">
                  Chats are saved securely in your browser’s local storage (optional).
                  Your conversations <strong>never</strong> leave your device.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-linear-to-br from-wa-header-bg to-teal-50 dark:from-wa-sidebar-bg dark:to-teal-900/10 p-10 rounded-3xl border border-wa-divider text-center space-y-8 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-wa-text-primary">❤️ Built With Care</h2>
              <p className="text-wa-text-secondary max-w-lg mx-auto leading-relaxed">
                Made by <a href={"https://shakiltech.com"} className={"underline"}><strong>Shakil</strong></a> to help people preserve and revisit their chat memories in a better format.
                If you find this useful, consider supporting the project:
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://github.com/itxshakil"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-3 bg-[#24292e] text-white rounded-xl hover:bg-black active:scale-95 transition-all text-sm font-semibold shadow-sm hover:shadow-lg group"
              >
                <Github size={20} className="group-hover:rotate-12 transition-transform" />
                GitHub
              </a>
              <a 
                href="https://buymeacoffee.com/itxshakil"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-3 bg-[#FFDD00] text-black rounded-xl hover:bg-[#FFCC00] active:scale-95 transition-all text-sm font-semibold shadow-sm hover:shadow-lg group"
              >
                <Coffee size={20} className="group-hover:bounce transition-transform" />
                Buy Me a Coffee
              </a>
            </div>
          </section>

          <section className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-wa-my-bubble text-wa-text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-wa-teal" />
              Privacy Guarantee
            </div>
            <p className="text-sm text-wa-text-secondary italic">
              All processing happens locally in your browser. Your chat data never leaves your computer.
            </p>
          </section>

          <footer className="text-center text-[11px] text-gray-400 dark:text-wa-text-secondary pb-8">
            &copy; 2026 WhatsApp Backup Viewer • Not affiliated with WhatsApp or Meta Platforms, Inc.
          </footer>
        </div>
      </div>
    </div>
  );
});
