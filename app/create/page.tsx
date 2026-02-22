'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGenerator } from '@/src/lib/generator';
import { LocalStorageStorage } from '@/src/lib/storage/LocalStorageStorage';

const splitKeywords = (value: string) =>
  value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

export default function CreatePage() {
  const router = useRouter();
  const generator = useMemo(() => createGenerator({ provider: 'mock' }), []);
  const storage = useMemo(() => new LocalStorageStorage(), []);

  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const parsedKeywords = splitKeywords(keywords);
    if (!topic.trim()) {
      setError('주제를 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const generated = await generator.generate({
        topic: topic.trim(),
        keywords: parsedKeywords,
      });

      const saved = await storage.save({
        topic: topic.trim(),
        keywords: parsedKeywords,
        slides: generated.slides,
      });

      router.push(`/editor/${saved.id}`);
    } catch {
      setError('프로젝트 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-900">새 카드뉴스 생성</h1>

      <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-1">
          <label htmlFor="topic" className="text-sm font-medium text-slate-700">
            주제
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring"
            placeholder="예: 생산성 향상"
          />
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <label htmlFor="keywords" className="text-sm font-medium text-slate-700">
            키워드 (쉼표로 구분)
          </label>
          <input
            id="keywords"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring"
            placeholder="예: 집중, 습관, 루틴"
          />
        </div>

        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          aria-label="카드뉴스 생성하기"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? '생성 중...' : '생성 후 에디터로 이동'}
        </button>
      </form>
    </main>
  );
}
