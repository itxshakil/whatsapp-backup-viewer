export interface ParsedLine {
  date: string;
  time: string;
  sender: string;
  content: string;
  isSystem: boolean;
}

export interface SavedChat {
  id?: number;
  metadata: ChatMetadata;
  messages: Message[];
  lastOpened: number;
}

export interface ChatContextType {
  messages: Message[];
  metadata: ChatMetadata | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  setChatData: (messages: Message[], metadata: ChatMetadata, shouldSave?: boolean) => Promise<void>;
  clearChat: () => void;
  clearAllData: () => Promise<void>;
  savedChats: SavedChat[];
  loadChat: (id: number) => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  saveCurrentChat: () => Promise<void>;
  highlightedMessageId: string | null;
  setHighlightedMessageId: (id: string | null) => void;
}

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

export interface ChatStats {
  totalMessages: number;
  textMessages: number;
  mediaMessages: number;
  perUser: Record<string, number>;
  byHour: number[];
  byDay: number[];
  topWords: [string, number][];
  topEmojis: [string, number][];
  topHours: { hour: number; count: number }[];
}
