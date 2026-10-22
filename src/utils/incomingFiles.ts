// The service worker parks a shared file here, then redirects to /?shared=1 for the page to pick up.
export const SHARED_FILE_CACHE = 'shared-files';
export const SHARED_FILE_URL = '/shared-file';
export const SHARED_FILE_NAME_HEADER = 'X-File-Name';

interface LaunchParams {
  files?: FileSystemFileHandle[];
}

interface LaunchQueue {
  setConsumer: (consumer: (params: LaunchParams) => void) => void;
}

export const takeSharedFile = async (): Promise<File | null> => {
  const url = new URL(window.location.href);
  if (url.searchParams.get('shared') !== '1' || !('caches' in window)) {
    return null;
  }

  // Drop the flag first so a reload doesn't look for the file again.
  url.searchParams.delete('shared');
  window.history.replaceState(window.history.state, '', url);

  const cache = await caches.open(SHARED_FILE_CACHE);
  const response = await cache.match(SHARED_FILE_URL);
  if (!response) {
    return null;
  }

  await cache.delete(SHARED_FILE_URL);
  const name = decodeURIComponent(response.headers.get(SHARED_FILE_NAME_HEADER) ?? 'WhatsApp Chat.zip');

  return new File([await response.arrayBuffer()], name, { type: response.headers.get('Content-Type') ?? '' });
};

// Desktop Chromium: double-clicking an export opens the installed app with the file in launchQueue.
export const onLaunchedFile = (handle: (file: File) => void): void => {
  const launchQueue = (window as Window & { launchQueue?: LaunchQueue }).launchQueue;

  launchQueue?.setConsumer(async ({ files }) => {
    const [fileHandle] = files ?? [];
    if (fileHandle) {
      handle(await fileHandle.getFile());
    }
  });
};
