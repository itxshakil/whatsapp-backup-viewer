import React from 'react';
import { MessageSquare, ShieldCheck, Search, ImageIcon, BarChart3 } from 'lucide-react';
import { FileUploader } from '../ui/FileUploader';

interface LandingPageProps {
  onShowAbout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onShowAbout }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in relative bg-wa-header-bg dark:bg-wa-bg overflow-y-auto h-full">
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={onShowAbout}
          className="flex items-center gap-2 px-3 py-1.5 bg-wa-panel-bg hover:bg-wa-search-bg text-wa-text-secondary rounded-lg shadow-sm border border-wa-divider transition-all text-xs font-medium"
        >
          About & Help
        </button>
      </div>
      
      <div className="text-center my-auto animate-fade-in max-w-2xl px-4 py-20 md:py-0 relative z-10">
        <div className="w-20 h-20 bg-wa-teal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform -rotate-3 transition-transform hover:rotate-0 cursor-default shrink-0 relative z-10">
          <MessageSquare size={40} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-wa-text-primary mb-4">WhatsApp Backup Viewer</h1>
        <p className="text-wa-text-secondary text-lg mb-2">
          Open & Analyze Your WhatsApp Chat Export — 100% Offline & Private
        </p>
        <p className="text-wa-text-secondary mb-8">
          Upload your exported chat file to instantly explore your messages, media, and insights.<br/>
          No servers. No tracking. No data uploads.
        </p>
        
        <h2 className="text-xl font-bold text-wa-text-primary mb-6 flex items-center justify-center gap-2">
          Why Use This WhatsApp Chat Viewer?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left max-w-xl mx-auto">
          <div className="bg-wa-panel-bg p-4 rounded-xl shadow-sm border border-wa-divider">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-bold text-sm mb-1 text-wa-text-primary">Privacy First — Always</h3>
            <p className="text-xs text-wa-text-secondary">Your chat backup is processed entirely inside your browser. Nothing is sent to any server.</p>
          </div>
          <div className="bg-wa-panel-bg p-4 rounded-xl shadow-sm border border-wa-divider">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3">
              <Search size={18} />
            </div>
            <h3 className="font-bold text-sm mb-1 text-wa-text-primary">Smart Search</h3>
            <p className="text-xs text-wa-text-secondary">Instantly find any message across thousands of lines. Jump between results in milliseconds.</p>
          </div>
          <div className="bg-wa-panel-bg p-4 rounded-xl shadow-sm border border-wa-divider">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-3">
              <ImageIcon size={18} />
            </div>
            <h3 className="font-bold text-sm mb-1 text-wa-text-primary">Media Gallery</h3>
            <p className="text-xs text-wa-text-secondary">View all shared photos, videos, and voice notes in one organized gallery.</p>
          </div>
          <div className="bg-wa-panel-bg p-4 rounded-xl shadow-sm border border-wa-divider">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center mb-3">
              <BarChart3 size={18} />
            </div>
            <h3 className="font-bold text-sm mb-1 text-wa-text-primary">Chat Analytics</h3>
            <p className="text-xs text-wa-text-secondary">Discover patterns: Most active days & hours, most used words & emojis.</p>
          </div>
        </div>
        
        <FileUploader />
      </div>
    </div>
  );
};
