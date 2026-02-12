import { describe, it, expect } from 'vitest';
import { parseLine } from './parseLine';

describe('parseLine', () => {
  it('should parse a standard message', () => {
    const line = '12/11/23, 9:45 pm - John: Hello world';
    const result = parseLine(line);
    expect(result).toEqual({
      date: '12/11/23',
      time: '9:45 pm',
      sender: 'John',
      content: 'Hello world',
      isSystem: false
    });
  });

  it('should parse a system message', () => {
    const line = '12/11/23, 9:46 pm - John joined using invite link';
    const result = parseLine(line);
    expect(result).toEqual({
      date: '12/11/23',
      time: '9:46 pm',
      sender: 'System',
      content: 'John joined using invite link',
      isSystem: true
    });
  });

  it('should return null for non-matching lines', () => {
    const line = 'This is just some random text';
    const result = parseLine(line);
    expect(result).toBeNull();
  });

  it('should handle different date formats', () => {
    const line = '2023/11/12, 09:45 - John: Hello';
    const result = parseLine(line);
    expect(result).toEqual({
      date: '2023/11/12',
      time: '09:45',
      sender: 'John',
      content: 'Hello',
      isSystem: false
    });
  });
});
