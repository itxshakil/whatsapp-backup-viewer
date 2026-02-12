import React, { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { normalizeMessages } from '../utils/normalizeMessages';
import { Upload, AlertCircle, Save, FileArchive } from 'lucide-react';
import { useState } from 'react';
import JSZip from 'jszip';
import { Message } from '../types/message';

export const FileUploader: React.FC = () => {
  const { setChatData, setError, error, saveCurrentChat, savedChats, loadChat, deleteChat } = useChatStore();
  const [shouldSave, setShouldSave] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      let text = '';
      let originalFileName = file.name;
      const mediaFiles: { [key: string]: Blob } = {};

      if (file.name.endsWith('.zip')) {
        const zip = await JSZip.loadAsync(file);
        const txtFile = Object.values(zip.files).find(f => f.name.endsWith('.txt'));
        
        if (!txtFile) {
          setError('Could not find a .txt file in the ZIP archive.');
          setIsProcessing(false);
          return;
        }

        text = await txtFile.async('text');

        // Extract media files
        const mediaExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'avi', 'mp3', 'wav', 'ogg', 'm4a', 'opus'];
        for (const [path, zipEntry] of Object.entries(zip.files)) {
          const ext = path.split('.').pop()?.toLowerCase();
          if (ext && mediaExtensions.includes(ext)) {
            mediaFiles[path] = await zipEntry.async('blob');
          }
        }
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        setError('Please upload a .txt file or a .zip archive containing the chat export.');
        setIsProcessing(false);
        return;
      }

      if (!text || text.trim().length === 0) {
        setError('The chat text file is empty.');
        setIsProcessing(false);
        return;
      }

      const messages = normalizeMessages(text);
      
      if (messages.length === 0) {
        setError('Could not find any valid WhatsApp messages. Please make sure it is a correct WhatsApp "Export Chat" file.');
        setIsProcessing(false);
        return;
      }

      // Link media files to messages
      messages.forEach(msg => {
        if (msg.type !== 'text' && msg.type !== 'system') {
          const filename = msg.content;
          if (mediaFiles[filename]) {
            msg.mediaBlob = mediaFiles[filename];
            msg.mediaUrl = URL.createObjectURL(mediaFiles[filename]);
          }
        }
      });

      const participants = Array.from(new Set(messages.map(m => m.sender)))
        .filter(s => s !== 'System');

      // Smart 1-on-1 detection for ZIP files
      let finalParticipants = [...participants];
      let cleanTitle = originalFileName.replace(/^WhatsApp Chat (with|-) /, '').replace(/\.(txt|zip)$/, '');
      
      if (originalFileName.endsWith('.zip')) {
        const otherPartyName = cleanTitle;
        const hasHidden = participants.includes('Hidden');
        const hasYou = participants.includes('You');

        // If it's a 1-on-1 chat where one participant is 'Hidden' and the other is 'You'
        if (participants.length === 2 && hasHidden && hasYou) {
          messages.forEach(msg => {
            if (msg.sender === 'Hidden') {
              msg.sender = otherPartyName;
              msg.isCurrentUser = false;
            } else if (msg.sender === 'You') {
              msg.isCurrentUser = true;
            }
          });
          finalParticipants = finalParticipants.map(p => p === 'Hidden' ? otherPartyName : p);
        } 
        // Or if only 'Hidden' exists
        else if (participants.length === 1 && hasHidden) {
          messages.forEach(msg => {
            if (msg.sender === 'Hidden') {
              msg.sender = otherPartyName;
              msg.isCurrentUser = false;
            }
          });
          finalParticipants = [otherPartyName];
        }
        // Handle case where it's 2 participants, one is explicitly named and matches ZIP title, 
        // and the other is also explicitly named (Shakil). 
        // We assume the one matching ZIP name is the other party.
        else if (participants.length === 2) {
          const namedParticipantMatchingZip = participants.find(p => p.toLowerCase() === otherPartyName.toLowerCase());
          const otherParticipant = participants.find(p => p.toLowerCase() !== otherPartyName.toLowerCase());
          
          if (namedParticipantMatchingZip && otherParticipant) {
             messages.forEach(msg => {
               if (msg.sender === namedParticipantMatchingZip) {
                 msg.isCurrentUser = false;
               } else {
                 msg.sender = 'You';
                 msg.isCurrentUser = true;
               }
             });
             finalParticipants = [namedParticipantMatchingZip, 'You'];
          } else {
            // Fallback to previous named participant logic if zip name doesn't match
            const namedParticipant = participants.find(p => p !== 'You' && p !== 'Hidden');
            if (namedParticipant) {
               messages.forEach(msg => {
                 if (msg.sender === namedParticipant) {
                   msg.isCurrentUser = false;
                 } else if (msg.sender === 'You' || msg.sender === 'Hidden') {
                   msg.isCurrentUser = true;
                 }
               });
            }
          }
        }
      }

      // Cleanup remaining 'Hidden' if any (e.g. in groups)
      messages.forEach(msg => {
        if (msg.sender === 'Hidden') {
          msg.sender = 'You';
          msg.isCurrentUser = true;
        }
      });
      finalParticipants = Array.from(new Set(finalParticipants.map(p => p === 'Hidden' ? 'You' : p)));

      const metadata = {
        fileName: cleanTitle,
        participants: finalParticipants,
        messageCount: messages.length
      };

      await setChatData(messages, metadata, shouldSave);
    } catch (err) {
      console.error('File processing error:', err);
      setError('An error occurred while processing the file. It might be corrupted or in an unsupported format.');
    } finally {
      setIsProcessing(false);
    }
  }, [setChatData, setError, shouldSave]);

  return (
    <div className="flex flex-col w-full max-w-2xl gap-6">
      <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-white/50 hover:bg-white/80 transition-colors ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}>
        <div className="flex gap-4 mb-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <FileArchive className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">Upload WhatsApp Chat</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Select the exported .txt file or a .zip archive (including media). <br/>
          No data will be uploaded to any server.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <label className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full cursor-pointer transition-colors font-medium shadow-sm ${isProcessing ? 'pointer-events-none' : ''}`}>
            {isProcessing ? 'Processing...' : 'Choose File'}
            <input
              type="file"
              accept=".txt,.zip"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
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
