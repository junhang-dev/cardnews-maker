export interface StorageItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  topic: string;
  keywords: string[];
  slides: string[];
}

export type StorageCreateInput = Omit<StorageItem, 'id' | 'createdAt' | 'updatedAt'>;

export type StorageSaveInput =
  | ({ id?: undefined } & StorageCreateInput)
  | ({ id: string } & Partial<StorageCreateInput>);

export interface Storage {
  list(): Promise<StorageItem[]>;
  getById(id: string): Promise<StorageItem | null>;
  save(input: StorageSaveInput): Promise<StorageItem>;
  deleteById(id: string): Promise<void>;
}
