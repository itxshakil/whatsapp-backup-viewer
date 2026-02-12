import { Message } from '../types/message';

/**
 * WhatsApp export format example:
 * 12/11/23, 9:45 pm - John: Hello
 * 12/11/23, 9:46 pm - Messages are end-to-end encrypted
 * [12/11/23, 9:45:30 pm] John: Hello
 */

const regex = /^(?:\[?(\d{1,4}[-./]\d{1,2}[-./]\d{1,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?\s?(am|pm|AM|PM)?)\]?)\s(?:-|:)?\s?([^:]+)(?::\s(.*))?$/i;

export interface ParsedLine {
  date: string;
  time: string;
  sender: string;
  content: string;
  isSystem: boolean;
}

export const parseLine = (line: string): ParsedLine | null => {
  const match = line.match(regex);
  if (!match) return null;

  const [, date, time, , sender, content] = match;

  // If content is undefined, it's likely a system message (no colon after sender)
  // Example: "12/11/23, 9:46 pm - John joined using invite link"
  // In this case, 'sender' will actually be the full system message text after " - "
  if (content === undefined) {
    return {
      date,
      time,
      sender: 'System',
      content: sender,
      isSystem: true
    };
  }

  return {
    date,
    time,
    sender,
    content,
    isSystem: false
  };
};
