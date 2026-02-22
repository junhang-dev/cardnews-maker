import {
  Storage,
  StorageItem,
  StorageSaveInput,
  StorageCreateInput,
} from './Storage';

const STORAGE_KEY = 'cardnews-maker:v0';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const nowIso = () => new Date().toISOString();

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `cn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export class LocalStorageStorage implements Storage {
  private readAll(): StorageItem[] {
    if (!isBrowser()) {
      return [];
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as StorageItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeAll(items: StorageItem[]): void {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private createItem(input: StorageCreateInput): StorageItem {
    const now = nowIso();

    return {
      id: createId(),
      topic: input.topic,
      keywords: input.keywords,
      slides: input.slides,
      createdAt: now,
      updatedAt: now,
    };
  }

  async list(): Promise<StorageItem[]> {
    const items = this.readAll();
    return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getById(id: string): Promise<StorageItem | null> {
    const items = this.readAll();
    return items.find((item) => item.id === id) ?? null;
  }

  async save(input: StorageSaveInput): Promise<StorageItem> {
    const items = this.readAll();

    if (!('id' in input) || !input.id) {
      const created = this.createItem(input);
      this.writeAll([created, ...items]);
      return created;
    }

    const index = items.findIndex((item) => item.id === input.id);
    const now = nowIso();

    if (index < 0) {
      throw new Error(`Storage item not found: ${input.id}`);
    }

    const existing = items[index];
    const updated: StorageItem = {
      ...existing,
      ...input,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    const next = [...items];
    next[index] = updated;
    this.writeAll(next);

    return updated;
  }

  async deleteById(id: string): Promise<void> {
    const items = this.readAll();
    this.writeAll(items.filter((item) => item.id !== id));
  }
}
