import { Message } from '@/types/message';

export const MEDIA_EXTENSIONS = {
  image: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  video: ['mp4', 'mov', 'avi'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'opus']
};

export const linkMediaToMessages = (messages: Message[], mediaFiles: { [key: string]: Blob }) => {
  messages.forEach(msg => {
    if (msg.type !== 'text' && msg.type !== 'system') {
      const filename = msg.content;
      if (mediaFiles[filename]) {
        msg.mediaBlob = mediaFiles[filename];
        msg.mediaUrl = URL.createObjectURL(mediaFiles[filename]);
      }
    }
  });
};
