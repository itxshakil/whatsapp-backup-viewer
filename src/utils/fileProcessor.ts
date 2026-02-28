import JSZip from 'jszip';
import { normalizeMessages } from './normalizeMessages';
import { linkMediaToMessages, MEDIA_EXTENSIONS } from './mediaLinker';
import { resolveParticipantIdentities } from './identityResolver';
import { Message, ChatMetadata } from '@/types/message';

export const processWhatsAppFile = async (
  file: File, 
  setError: (error: string | null) => void,
  setChatData: (messages: Message[], metadata: ChatMetadata, shouldSave: boolean) => Promise<void>,
  shouldSave: boolean = true
) => {
  setError(null);

  try {
    let text = '';
    let originalFileName = file.name;
    const mediaFiles: { [key: string]: Blob } = {};

    if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file);
      const txtFile = Object.values(zip.files).find(f => f.name.endsWith('.txt'));
      
      if (!txtFile) {
        setError('Could not find a .txt file in the ZIP archive.');
        return;
      }

      text = await txtFile.async('text');

      const extensions = Object.values(MEDIA_EXTENSIONS).flat();
      for (const [path, zipEntry] of Object.entries(zip.files)) {
        const ext = path.split('.').pop()?.toLowerCase();
        if (ext && extensions.includes(ext)) {
          mediaFiles[path] = await zipEntry.async('blob');
        }
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      text = await file.text();
    } else {
      setError('Please upload a .txt file or a .zip archive containing the chat export.');
      return;
    }

    if (!text || text.trim().length === 0) {
      setError('The chat text file is empty.');
      return;
    }

    const messages = normalizeMessages(text);
    
    if (messages.length === 0) {
      setError('Could not find any valid WhatsApp messages. Please make sure it is a correct WhatsApp "Export Chat" file.');
      return;
    }

    linkMediaToMessages(messages, mediaFiles);

    const participants = Array.from(new Set(messages.map(m => m.sender)))
      .filter(s => s !== 'System');

    const { finalParticipants, cleanTitle } = resolveParticipantIdentities(messages, participants, originalFileName);

    const metadata = {
      fileName: cleanTitle,
      participants: finalParticipants,
      messageCount: messages.length
    };

    await setChatData(messages, metadata, shouldSave);
  } catch (err) {
    console.error('File processing error:', err);
    setError('An error occurred while processing the file. It might be corrupted or in an unsupported format.');
  }
};
