import React, { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { normalizeMessages } from '../utils/normalizeMessages';
import { Upload, AlertCircle } from 'lucide-react';

export const FileUploader: React.FC = () => {
  const { setChatData, setError, error } = useChatStore();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a .txt file (WhatsApp export)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
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

        setChatData(messages, {
          fileName: file.name,
          participants,
          messageCount: messages.length
        });
      } catch (err) {
        console.error('Parsing error:', err);
        setError('An error occurred while parsing the file. It might be corrupted or in an unsupported format.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsText(file);
  }, [setChatData, setError]);

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

      {error && (
        <div className="mt-6 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm max-w-[300px]">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
