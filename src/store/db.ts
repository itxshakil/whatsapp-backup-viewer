import Dexie, { Table } from 'dexie';
import { Message, ChatMetadata } from '../types/message';

export interface SavedChat {
  id?: number;
  metadata: ChatMetadata;
  messages: Message[];
  lastOpened: number;
}

export class ChatDatabase extends Dexie {
  chats!: Table<SavedChat>;

  constructor() {
    super('ChatDatabase');
    this.version(3).stores({
      chats: '++id, lastOpened, metadata.fileName'
    });
  }
}

export const db = new ChatDatabase();
