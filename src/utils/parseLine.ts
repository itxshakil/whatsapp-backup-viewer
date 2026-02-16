/**
 * WhatsApp export format example:
 * 12/11/23, 9:45 pm - John: Hello
 * 12/11/23, 9:46 pm - Messages are end-to-end encrypted
 * [12/11/23, 9:45:30 pm] John: Hello
 */

const WHATSAPP_LINE_REGEX = /^(?:\[?(\d{1,4}[-./]\d{1,2}[-./]\d{1,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(\s?(?:[ap]\.?m\.?|AM|PM))?)\]?)\s(?:-|:)\s?([^:]+)(?::\s(.*))?$/i;
const WHATSAPP_SQUARE_REGEX = /^\[(\d{1,4}[-./]\d{1,2}[-./]\d{1,4}),?\s(\d{1,2}:\d{2}(?::\d{2})?(\s?(?:[ap]\.?m\.?|AM|PM))?)\]\s([^:]+)(?::\s(.*))?$/i;

export interface ParsedLine {
  date: string;
  time: string;
  sender: string;
  content: string;
  isSystem: boolean;
}

const isInvisible = (text: string) => {
  // Check if string consists only of zero-width or non-breaking spaces
  // \u200e - Left-to-Right Mark
  // \u200f - Right-to-Left Mark
  // \u200b - Zero Width Space
  // \u200c - Zero Width Non-Joiner
  // \u200d - Zero Width Joiner
  // \ufeff - Zero Width No-Break Space
  // \u00a0 - Non-breaking space
  return /^[\u200e\u200f\u200b-\u200d\ufeff\u00a0\s]+$/.test(text);
};

export const parseLine = (line: string): ParsedLine | null => {
  let match = line.match(WHATSAPP_LINE_REGEX);
  if (!match) {
    match = line.match(WHATSAPP_SQUARE_REGEX);
  }
  if (!match) return null;

  let [, date, time, , sender, content] = match;

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

  // Map invisible-character senders to 'You'
  if (isInvisible(sender)) {
    sender = 'Hidden';
  }

  // Handle empty content
  if (!content || isInvisible(content)) {
    content = '';
  }

  return {
    date,
    time,
    sender,
    content,
    isSystem: false
  };
};
