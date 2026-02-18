import Dexie, { Table } from 'dexie';
import { SavedChat } from '../types/message';

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
