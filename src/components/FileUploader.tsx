import React, { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { normalizeMessages } from '../utils/normalizeMessages';
import { Upload } from 'lucide-react';

export const FileUploader: React.FC = () => {
  const { setChatData } = useChatStore();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      alert('Please upload a .txt file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const messages = normalizeMessages(text);
      
      const participants = Array.from(new Set(messages.map(m => m.sender)))
        .filter(s => s !== 'System');

      setChatData(messages, {
        fileName: file.name,
        participants,
        messageCount: messages.length
      });
    };
    reader.readAsText(file);
  }, [setChatData]);

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">Upload WhatsApp Chat</h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Select the exported .txt file from your computer. <br/>
        No data will be uploaded to any server.
      </p>
      <label className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full cursor-pointer transition-colors font-medium">
        Choose File
        <input
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};
