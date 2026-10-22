import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onLaunchedFile, SHARED_FILE_URL, takeSharedFile } from '@/utils/incomingFiles';

describe('takeSharedFile', () => {
  let stored: Map<string, Response>;

  beforeEach(() => {
    stored = new Map();
    const cache = {
      match: async (key: string) => stored.get(key),
      delete: async (key: string) => stored.delete(key),
    };
    vi.stubGlobal('caches', { open: async () => cache });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.history.replaceState(null, '', '/');
  });

  it('returns the file the service worker parked and removes it', async () => {
    stored.set(SHARED_FILE_URL, new Response('12/01/2024, 10:00 - Jane: Hi', {
      headers: { 'Content-Type': 'text/plain', 'X-File-Name': encodeURIComponent('WhatsApp Chat with Jane.txt') },
    }));
    window.history.replaceState(null, '', '/?shared=1');

    const file = await takeSharedFile();

    expect(file?.name).toBe('WhatsApp Chat with Jane.txt');
    expect(await file?.text()).toBe('12/01/2024, 10:00 - Jane: Hi');
    expect(stored.size).toBe(0);
    expect(window.location.search).toBe('');
  });

  it('ignores a normal visit', async () => {
    stored.set(SHARED_FILE_URL, new Response('chat'));

    expect(await takeSharedFile()).toBeNull();
    expect(stored.size).toBe(1);
  });

  it('copes with the share arriving without a file', async () => {
    window.history.replaceState(null, '', '/?shared=1');

    expect(await takeSharedFile()).toBeNull();
  });
});

describe('onLaunchedFile', () => {
  afterEach(() => {
    delete (window as any).launchQueue;
  });

  it('hands over the file the OS opened the app with', async () => {
    let consumer: (params: { files?: unknown[] }) => Promise<void> = async () => {};
    (window as any).launchQueue = { setConsumer: (fn: typeof consumer) => (consumer = fn) };
    const launched = new File(['chat'], 'WhatsApp Chat with Jane.zip');
    const handle = vi.fn();

    onLaunchedFile(handle);
    await consumer({ files: [{ getFile: async () => launched }] });

    expect(handle).toHaveBeenCalledWith(launched);
  });

  it('does nothing where launchQueue is missing', () => {
    expect(() => onLaunchedFile(vi.fn())).not.toThrow();
  });
});
