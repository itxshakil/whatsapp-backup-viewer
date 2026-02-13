import { Message } from '../types/message';
import { parseLine } from './parseLine';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const MEDIA_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  video: ['mp4', 'mov', 'avi'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'opus']
};

const MEDIA_REGEX = /<attached:\s*(.*?)>|^(.*?)\s+\(file attached\)$|^(.*?)\s+<attached>$/i;

const DATE_FORMATS = [
  'DD/MM/YY h:mm:ss a',
  'MM/DD/YY h:mm:ss a',
  'DD/MM/YYYY h:mm:ss a',
  'MM/DD/YYYY h:mm:ss a',
  'DD/MM/YY h:mm a',
  'MM/DD/YY h:mm a',
  'DD/MM/YYYY h:mm a',
  'MM/DD/YYYY h:mm a',
  'DD/MM/YY HH:mm:ss',
  'MM/DD/YY HH:mm:ss',
  'DD/MM/YYYY HH:mm:ss',
  'MM/DD/YYYY HH:mm:ss',
  'DD/MM/YY HH:mm',
  'MM/DD/YY HH:mm',
  'YYYY/MM/DD HH:mm',
  'D/M/YY H:mm',
  'M/D/YY H:mm',
  'DD.MM.YY HH:mm',
  'DD.MM.YYYY HH:mm',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD h:mm a'
];

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
      let dateTimeStr = `${parsed.date} ${parsed.time}`.replace(',', '').toLowerCase();
      // Normalize AM/PM (remove dots, ensure space)
      dateTimeStr = dateTimeStr.replace(/([ap])\.m\./g, '$1m');
      dateTimeStr = dateTimeStr.replace(/(\d)(am|pm)/g, '$1 $2');
      const timestamp = dayjs(dateTimeStr, DATE_FORMATS).toDate();

      let type: Message['type'] = parsed.isSystem ? 'system' : 'text';
      let content = parsed.content;

      // Detect media attachments
      // Format: "<attached: FILENAME>" or "FILENAME (file attached)" or "FILENAME <attached>"
      const mediaMatch = content?.match(MEDIA_REGEX);

      if (mediaMatch) {
        const filename = (mediaMatch[1] || mediaMatch[2] || mediaMatch[3]).trim();
        content = filename;
        const ext = filename.split('.').pop()?.toLowerCase() || '';
        
        if (MEDIA_EXTENSIONS.image.includes(ext)) {
          type = 'image';
        } else if (MEDIA_EXTENSIONS.video.includes(ext)) {
          type = 'video';
        } else if (MEDIA_EXTENSIONS.audio.includes(ext)) {
          type = 'audio';
        } else {
          type = 'document';
        }
      }

      currentMessage = {
        id: `msg-${index}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp,
        sender: parsed.sender,
        content: content,
        type: type,
        isCurrentUser: parsed.sender.toLowerCase() === 'you' || parsed.sender === 'Hidden'
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
