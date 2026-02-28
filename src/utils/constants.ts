export const EMOJI_REGEX = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

export const EXCLUDED_SYMBOLS = new Set([
  '©', '®', '™', ' ', "'", '"', '!', '?', '#', '*', '+', '.', ',', ':', ';', '-', '_', 
  '(', ')', '[', ']', '{', '}', '@', '&', '^', '%', '$', '|', '\\', '/', '<', '>', '~', 
  '=', '`', '°', '•', '·', '…', '–', '—', '✓', '✔', '✕', '✖', '✗', '✘', '★', '☆', '✡', 
  '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '✱', '✲', '✳', '✴', '✵', '✶', '✷', 
  '✸', '✹', '✺', '✻', '✼', '✽', '✾', '✿', '❀', '❁', '❂', '❃', '❄', '❅', '❆', '❇', '❈', 
  '❉', '❊', '❋', '❍', '❏', '❐', '❑', '❒', '❖', '❘', '❙', '❚', '❛', '❜', '❝', '❞'
]);

export const COMMON_STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 
  'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 
  'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'person', 'into', 
  'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 
  'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 
  'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 
  'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'am', 'been', 'has', 
  'had', 'media', 'omitted', 'https', 'com'
]);

export const INSTALL_INSTRUCTIONS = {
  IOS: "To install on iOS: tap the Share button (square with arrow) and then 'Add to Home Screen' ➕",
  MAC: "To install on macOS: in Safari, go to File > Add to Dock... or use the Share menu ➕"
};
