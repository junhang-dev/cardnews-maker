import type { Slide } from '../generator';
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

const normalizeSlides = (slides: unknown): Slide[] => {
  if (!Array.isArray(slides)) {
    return [];
  }

  if (slides.every((slide) => typeof slide === 'string')) {
    const textSlides = slides as string[];
    return textSlides.slice(0, 8).map((body, index) => ({
      title: `${index + 1}번 슬라이드`,
      body,
    }));
  }

  return slides
    .filter(
      (slide): slide is Slide =>
        typeof slide === 'object' &&
        slide !== null &&
        'title' in slide &&
        'body' in slide &&
        typeof slide.title === 'string' &&
        typeof slide.body === 'string',
    )
    .slice(0, 8);
};

const normalizeItem = (item: unknown): StorageItem | null => {
  if (
    typeof item !== 'object' ||
    item === null ||
    !('id' in item) ||
    !('topic' in item) ||
    !('keywords' in item) ||
    !('slides' in item)
  ) {
    return null;
  }

  const candidate = item as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.topic !== 'string') {
    return null;
  }

  const keywords = Array.isArray(candidate.keywords)
    ? candidate.keywords.filter((keyword): keyword is string => typeof keyword === 'string')
    : [];

  const createdAt = typeof candidate.createdAt === 'string' ? candidate.createdAt : nowIso();
  const updatedAt = typeof candidate.updatedAt === 'string' ? candidate.updatedAt : createdAt;

  return {
    id: candidate.id,
    topic: candidate.topic,
    keywords,
    slides: normalizeSlides(candidate.slides),
    createdAt,
    updatedAt,
  };
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
      const parsed = JSON.parse(raw) as unknown[];
      return Array.isArray(parsed)
        ? parsed.map(normalizeItem).filter((item): item is StorageItem => item !== null)
        : [];
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
      if (input.topic == null || input.keywords == null || input.slides == null) {
        throw new Error('Storage create input is missing required fields.');
      }

      const created = this.createItem({
        topic: input.topic,
        keywords: input.keywords,
        slides: input.slides,
      });
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
