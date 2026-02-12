import React, { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { normalizeMessages } from '../utils/normalizeMessages';
import { Upload, AlertCircle, Save } from 'lucide-react';
import { useState } from 'react';

export const FileUploader: React.FC = () => {
  const { setChatData, setError, error, saveCurrentChat, savedChats, loadChat, deleteChat } = useChatStore();
  const [shouldSave, setShouldSave] = useState(true);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a .txt file (WhatsApp export)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text || text.trim().length === 0) {
          setError('The uploaded file is empty.');
          return;
        }

        const messages = normalizeMessages(text);
        
        if (messages.length === 0) {
          setError('Could not find any valid WhatsApp messages in this file. Please make sure it is a correct WhatsApp "Export Chat" file.');
          return;
        }

        const participants = Array.from(new Set(messages.map(m => m.sender)))
          .filter(s => s !== 'System');

        const metadata = {
          fileName: file.name,
          participants,
          messageCount: messages.length
        };

        await setChatData(messages, metadata, shouldSave);
      } catch (err) {
        console.error('Parsing error:', err);
        setError('An error occurred while parsing the file. It might be corrupted or in an unsupported format.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsText(file);
  }, [setChatData, setError, shouldSave, saveCurrentChat]);

  return (
    <div className="flex flex-col w-full max-w-2xl gap-6">
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Upload WhatsApp Chat</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Select the exported .txt file from your computer. <br/>
          No data will be uploaded to any server.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <label className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full cursor-pointer transition-colors font-medium shadow-sm">
            Choose File
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={shouldSave} 
              onChange={(e) => setShouldSave(e.target.checked)}
              className="rounded text-green-600 focus:ring-green-500"
            />
            Save to browser storage (IndexedDB)
          </label>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm max-w-[350px]">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {savedChats.length > 0 && (
        <div className="bg-white/50 rounded-lg p-6 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Save size={16} />
            Recent Chats
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedChats.map((chat) => (
              <div 
                key={chat.id} 
                className="group flex flex-col p-3 bg-white border border-gray-100 rounded-lg hover:border-green-300 hover:shadow-sm transition-all cursor-pointer relative"
                onClick={() => chat.id && loadChat(chat.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h5 className="text-sm font-medium text-gray-800 truncate pr-6">{chat.metadata.fileName}</h5>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${chat.metadata.fileName}"?`)) {
                        chat.id && deleteChat(chat.id);
                      }
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete saved chat"
                  >
                    <AlertCircle size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-500">{chat.metadata.messageCount} messages</p>
                <p className="text-[10px] text-gray-400 mt-2">
                  Last opened: {new Date(chat.lastOpened).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
