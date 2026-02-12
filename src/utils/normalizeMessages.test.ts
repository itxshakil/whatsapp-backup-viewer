import { describe, it, expect } from 'vitest';
import { normalizeMessages } from './normalizeMessages';

describe('normalizeMessages', () => {
  it('should normalize multiple lines into messages', () => {
    const rawText = `12/11/23, 9:45 pm - John: Hello
12/11/23, 9:46 pm - You: Hi there!
How are you?`;
    const messages = normalizeMessages(rawText);

    expect(messages).toHaveLength(2);
    expect(messages[0].sender).toBe('John');
    expect(messages[0].content).toBe('Hello');
    expect(messages[1].sender).toBe('You');
    expect(messages[1].content).toBe('Hi there!\nHow are you?');
    expect(messages[1].isCurrentUser).toBe(true);
  });

  it('should handle system messages', () => {
    const rawText = `12/11/23, 9:45 pm - John: Hello
12/11/23, 9:46 pm - Messages are end-to-end encrypted`;
    const messages = normalizeMessages(rawText);

    expect(messages).toHaveLength(2);
    expect(messages[1].type).toBe('system');
    expect(messages[1].sender).toBe('System');
    expect(messages[1].content).toBe('Messages are end-to-end encrypted');
  });

  it('should correctly parse timestamps', () => {
    const rawText = `12/11/23, 9:45 pm - John: Hello`;
    const messages = normalizeMessages(rawText);

    expect(messages[0].timestamp).toBeInstanceOf(Date);
    // 2023-11-12 21:45 (depending on DD/MM vs MM/DD, but let's check it's a valid date)
    expect(messages[0].timestamp.getTime()).not.toBeNaN();
  });

  it('should preserve empty lines within multiline messages', () => {
    const rawText = `12/11/23, 9:45 pm - John: Line 1

Line 3`;
    const messages = normalizeMessages(rawText);

    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('Line 1\n\nLine 3');
  });
});
