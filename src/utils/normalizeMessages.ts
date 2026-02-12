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

    // Detect and remove RTL/LTR marks that sometimes appear in WhatsApp exports
    // We only trim for parseLine detection to handle cases with leading/trailing spaces
    const cleanLine = line.replace(/[\u200e\u200f]/g, '');

    const parsed = parseLine(cleanLine.trim());

    if (parsed) {
      // New message starts
      const timestamp = dayjs(`${parsed.date} ${parsed.time}`, [
        'DD/MM/YY h:mm a',
        'MM/DD/YY h:mm a',
        'DD/MM/YYYY h:mm a',
        'MM/DD/YYYY h:mm a',
        'DD/MM/YY, h:mm a',
        'MM/DD/YY, h:mm a',
        'DD/MM/YYYY, h:mm a',
        'MM/DD/YYYY, h:mm a',
        'DD/MM/YY, HH:mm',
        'MM/DD/YY, HH:mm',
        'YYYY/MM/DD, HH:mm',
        'D/M/YY, H:mm',
        'M/D/YY, H:mm'
      ]).toDate();

      currentMessage = {
        id: `msg-${index}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        sender: parsed.sender,
        content: parsed.content,
        type: parsed.isSystem ? 'system' : 'text',
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
