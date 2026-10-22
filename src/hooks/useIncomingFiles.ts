import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { processWhatsAppFile } from '@/utils/fileProcessor';
import { onLaunchedFile, takeSharedFile } from '@/utils/incomingFiles';
import { trackEvent } from '@/utils/analytics';

// Opens a chat handed over by the share sheet or the OS "Open with", wherever the app is.
export const useIncomingFiles = () => {
  const { setChatData, setError } = useChatStore();

  useEffect(() => {
    const open = (source: 'share' | 'launch') => (file: File) => {
      trackEvent('file_received', { source });
      processWhatsAppFile(file, setError, setChatData, true);
    };

    takeSharedFile().then((file) => file && open('share')(file));
    onLaunchedFile(open('launch'));
  }, [setChatData, setError]);
};
