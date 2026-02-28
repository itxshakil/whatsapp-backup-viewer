import { Message, ChatMetadata } from '@/types/message';

export const exportChatAsJSON = (metadata: ChatMetadata | null, messages: Message[]) => {
  if (!metadata || messages.length === 0) return;
  
  const data = JSON.stringify({ metadata, messages }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${metadata.fileName.replace('.txt', '')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
