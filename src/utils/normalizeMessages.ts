import { Message } from '../types/message';
import { parseLine } from './parseLine';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const normalizeMessages = (rawText: string): Message[] => {
  const lines = rawText.split(/\r?\n/);
  const messages: Message[] = [];
  let currentMessage: Message | null = null;

  lines.forEach((line, index) => {
    // Check for empty lines but preserve them if they are part of a multiline message
    if (!line.trim() && !currentMessage) return;

    // Detect and remove RTL/LTR marks and other zero-width characters
    const cleanLine = line.replace(/[\u200e\u200f\u200b-\u200d\ufeff]/g, '');

    const parsed = parseLine(cleanLine.trim());

    if (parsed) {
      // New message starts
      const dateTimeStr = `${parsed.date} ${parsed.time}`.replace(',', '');
      const timestamp = dayjs(dateTimeStr, [
        'DD/MM/YY h:mm:ss a',
        'MM/DD/YY h:mm:ss a',
        'DD/MM/YYYY h:mm:ss a',
        'MM/DD/YYYY h:mm:ss a',
        'DD/MM/YY h:mm a',
        'MM/DD/YY h:mm a',
        'DD/MM/YYYY h:mm a',
        'MM/DD/YYYY h:mm a',
        'DD/MM/YY HH:mm',
        'MM/DD/YY HH:mm',
        'YYYY/MM/DD HH:mm',
        'D/M/YY H:mm',
        'M/D/YY H:mm',
        'DD.MM.YY HH:mm',
        'DD.MM.YYYY HH:mm'
      ]).toDate();

      let type: Message['type'] = parsed.isSystem ? 'system' : 'text';
      let content = parsed.content;

      // Detect media attachments
      // Format: "<attached: FILENAME>" or "FILENAME (file attached)" or "FILENAME <attached>"
      const mediaRegex = /<attached:\s*(.*?)>|^(.*?)\s+\(file attached\)$|^(.*?)\s+<attached>$/i;
      const mediaMatch = content?.match(mediaRegex);

      if (mediaMatch) {
        const filename = (mediaMatch[1] || mediaMatch[2] || mediaMatch[3]).trim();
        content = filename;
        const ext = filename.split('.').pop()?.toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
          type = 'image';
        } else if (['mp4', 'mov', 'avi'].includes(ext || '')) {
          type = 'video';
        } else if (['mp3', 'wav', 'ogg', 'm4a', 'opus'].includes(ext || '')) {
          type = 'audio';
        } else {
          type = 'document';
        }
      }

      currentMessage = {
        id: `msg-${index}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        sender: parsed.sender,
        content: content,
        type: type,
        isCurrentUser: parsed.sender.toLowerCase() === 'you'
      };
      messages.push(currentMessage);
    } else if (currentMessage) {
      // Continuation of previous message (multiline)
      // Only append if it's not an empty line at the very end of the file
      if (line.trim() || index < lines.length - 1) {
        currentMessage.content += '\n' + cleanLine;
      }
    }
  });

  return messages;
};
