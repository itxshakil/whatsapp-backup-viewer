import React, { useCallback, useState } from 'react';
import JSZip from 'jszip';
import { useChatStore } from '../../store/chatStore';
import { normalizeMessages } from '../../utils/normalizeMessages';
import { trackEvent } from '../../utils/analytics';
import { Upload, AlertCircle, Save, FileArchive, Trash2 } from 'lucide-react';
import { Message } from '../../types/message';
import { SavedChat } from '../../store/db';

export const FileUploader: React.FC = React.memo(() => {
  const { setChatData, setError, error, savedChats, loadChat, deleteChat } = useChatStore();
  const [shouldSave, setShouldSave] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
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

      trackEvent('file_upload_success', {
        file_type: file.name.endsWith('.zip') ? 'zip' : 'txt',
        message_count: messages.length,
        participant_count: finalParticipants.length
      });

      await setChatData(messages, metadata, shouldSave);
    } catch (err) {
      console.error('File processing error:', err);
      trackEvent('file_upload_error', {
        error: err instanceof Error ? err.message : String(err)
      });
      setError('An error occurred while processing the file. It might be corrupted or in an unsupported format.');
    } finally {
      setIsProcessing(false);
    }
  }, [setChatData, setError, shouldSave]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleConfirmDelete = useCallback((e: React.MouseEvent, chat: any) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${chat.metadata.fileName}"?`)) {
      chat.id && deleteChat(chat.id);
    }
  }, [deleteChat]);

  const handleLoadChat = useCallback((id: number) => {
    loadChat(id);
  }, [loadChat]);

  const toggleShouldSave = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShouldSave(e.target.checked);
  }, []);

  return (
    <div className="flex flex-col w-full max-w-2xl gap-6">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-all ${
          isDragging 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
            : 'border-gray-300 bg-white/50 hover:bg-white/80 dark:bg-[#111b21]/50 dark:hover:bg-[#111b21]/80 dark:border-gray-700'
        } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
      >
        <div className="flex gap-4 mb-4">
          <Upload className={`w-12 h-12 transition-colors ${isDragging ? 'text-green-500' : 'text-gray-400'}`} />
          <FileArchive className={`w-12 h-12 transition-colors ${isDragging ? 'text-green-500' : 'text-gray-400'}`} />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-[#e9edef] mb-2">📂 Upload Your WhatsApp Chat Export</h3>
        <p className="text-sm text-gray-500 dark:text-[#8696a0] mb-6 text-center">
          Drag & drop your exported file or choose manually: <br/>
          <span className="text-xs mt-2 block">
            ✅ .zip file (recommended, includes media) <br/>
            ✅ _chat.txt file (text only)
          </span>
          <span className="mt-4 block text-[11px] opacity-70">All processing happens locally in your browser.</span>
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <label className={`bg-[#008069] dark:bg-[#00a884] hover:opacity-90 active:scale-95 text-white px-8 py-2.5 rounded-full cursor-pointer transition-all font-medium shadow-sm ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
            {isProcessing ? 'Processing...' : 'Choose File'}
            <input
              type="file"
              accept=".txt,.zip"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-[#667781] dark:text-[#8696a0] cursor-pointer">
            <input 
              type="checkbox" 
              checked={shouldSave} 
              onChange={toggleShouldSave}
              className="rounded text-[#008069] focus:ring-[#008069] bg-transparent border-gray-300 dark:border-gray-600"
            />
            Save to browser storage
          </label>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm max-w-[350px]">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {savedChats.length > 0 && (
        <div className="bg-white/50 dark:bg-[#111b21]/50 rounded-lg p-6 border border-gray-200 dark:border-gray-800 mt-8">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-[#8696a0] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Save size={16} />
            Recent Chats
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedChats.map((chat: any) => (
              <div 
                key={chat.id} 
                className="group text-left flex flex-col p-3 bg-white dark:bg-[#202c33] border border-gray-100 dark:border-gray-800 rounded-lg hover:border-teal-300 dark:hover:border-teal-900 transition-all cursor-pointer relative shadow-sm hover:shadow-md"
                onClick={() => chat.id && handleLoadChat(chat.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h5 className="text-sm font-medium text-[#111b21] dark:text-[#e9edef] truncate pr-6">{chat.metadata.fileName}</h5>
                  <button 
                    onClick={(e) => handleConfirmDelete(e, chat)}
                    className="absolute top-2.5 right-2.5 p-1 text-[#667781] dark:text-[#8696a0] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete saved chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-[#667781] dark:text-[#8696a0]">{chat.metadata.messageCount} messages</p>
                <p className="text-[10px] text-[#667781]/60 dark:text-[#8696a0]/60 mt-2">
                  Last opened: {new Date(chat.lastOpened).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
