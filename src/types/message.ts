export type MessageType = "text" | "system";

export interface Message {
  id: string;
  timestamp: Date;
  sender: string;
  content: string;
  type: MessageType;
  isCurrentUser: boolean;
}

export interface ChatMetadata {
  fileName: string;
  participants: string[];
  messageCount: number;
}
