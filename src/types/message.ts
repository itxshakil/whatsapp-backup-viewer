export type MessageType = "text" | "system" | "image" | "video" | "audio" | "document" | "call";

export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: MessageType;
  isCurrentUser: boolean;
  isEdited?: boolean;
  mediaUrl?: string;
  mediaBlob?: Blob;
}

export interface ChatMetadata {
  fileName: string;
  participants: string[];
  messageCount: number;
}
