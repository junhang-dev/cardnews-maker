import { Storage, StorageItem, StorageSaveInput } from './Storage';

/**
 * Supabase 기반 영구 저장소 스켈레톤.
 *
 * TODO:
 * - supabase-js 클라이언트 주입받기
 * - 테이블 스키마(`cardnews`)와 `StorageItem` 매핑하기
 * - list/getById/save/deleteById 실제 쿼리 구현
 * - RLS 정책과 에러 매핑 정의
 */
export class SupabaseStorage implements Storage {
  async list(): Promise<StorageItem[]> {
    // TODO: supabase.from('cardnews').select('*').order('updated_at', { ascending: false })
    throw new Error('TODO: Implement list in SupabaseStorage');
  }

  async getById(id: string): Promise<StorageItem | null> {
    // TODO: supabase.from('cardnews').select('*').eq('id', id).maybeSingle()
    void id;
    throw new Error('TODO: Implement getById in SupabaseStorage');
  }

  async save(input: StorageSaveInput): Promise<StorageItem> {
    // TODO:
    // - input.id가 없으면 insert
    // - input.id가 있으면 update
    // - upsert 정책 및 updatedAt 처리
    void input;
    throw new Error('TODO: Implement save in SupabaseStorage');
  }

  async deleteById(id: string): Promise<void> {
    // TODO: supabase.from('cardnews').delete().eq('id', id)
    void id;
    throw new Error('TODO: Implement deleteById in SupabaseStorage');
  }
}
