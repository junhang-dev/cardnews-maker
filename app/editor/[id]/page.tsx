'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlideFormEditor } from '@/src/components/SlideFormEditor';
import { SlidePreview } from '@/src/components/SlidePreview';
import { ThumbnailList } from '@/src/components/ThumbnailList';
import type { Slide } from '@/src/lib/generator';
import { downloadBlob, domNodeToPngBlob } from '@/src/lib/export/png';
import { createZipBlob } from '@/src/lib/export/zip';
import { LocalStorageStorage } from '@/src/lib/storage/LocalStorageStorage';

const toUint8Array = async (blob: Blob): Promise<Uint8Array> => new Uint8Array(await blob.arrayBuffer());

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const storage = useMemo(() => new LocalStorageStorage(), []);

  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const project = await storage.getById(id);
      if (!active) {
        return;
      }

      if (!project) {
        setError('프로젝트를 찾을 수 없습니다.');
        return;
      }

      setTopic(project.topic);
      setKeywords(project.keywords);
      setSlides(project.slides);
      setSelectedIndex(0);
    };

    load().catch(() => setError('프로젝트 로드에 실패했습니다.'));

    return () => {
      active = false;
    };
  }, [id, storage]);

  useEffect(() => {
    if (!slides.length) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      try {
        setStatus('saving');
        await storage.save({ id, topic, keywords, slides });
        setStatus('saved');
      } catch {
        setError('자동 저장에 실패했습니다.');
      }
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [id, keywords, slides, storage, topic]);

  const updateSlide = useCallback(
    (index: number, next: Slide) => {
      setSlides((prev) => prev.map((slide, slideIndex) => (slideIndex === index ? next : slide)));
      setStatus('idle');
    },
    [setSlides],
  );

  const exportCurrentPng = async () => {
    if (!previewRef.current) {
      setError('현재 슬라이드 미리보기를 찾을 수 없습니다.');
      return;
    }

    try {
      setExporting(true);
      setError(null);
      const blob = await domNodeToPngBlob(previewRef.current);
      downloadBlob(blob, `slide-${selectedIndex + 1}.png`);
    } catch {
      setError('PNG 내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  };

  const exportZip = async () => {
    if (!previewRef.current || !slides.length) {
      setError('내보낼 슬라이드가 없습니다.');
      return;
    }

    try {
      setExporting(true);
      setError(null);

      const files: Array<{ name: string; data: Uint8Array }> = [];

      const slidesForExport = slides.slice(0, 8);

      for (let index = 0; index < slidesForExport.length; index += 1) {
        const fakeNode = document.createElement('div');
        fakeNode.style.position = 'fixed';
        fakeNode.style.left = '-10000px';
        fakeNode.style.top = '-10000px';
        document.body.appendChild(fakeNode);

        const sourceNode = previewRef.current.cloneNode(true) as HTMLDivElement;
        const title = sourceNode.querySelector('h2');
        const body = sourceNode.querySelector('p:last-of-type');
        const badge = sourceNode.querySelector('p');
        if (badge) badge.textContent = `Slide ${index + 1}`;
        if (title) title.textContent = slidesForExport[index].title;
        if (body) body.textContent = slidesForExport[index].body;

        fakeNode.appendChild(sourceNode);

        const blob = await domNodeToPngBlob(sourceNode);
        files.push({
          name: `slide-${index + 1}.png`,
          data: await toUint8Array(blob),
        });

        fakeNode.remove();
      }

      const zipBlob = createZipBlob(files);
      downloadBlob(zipBlob, `${topic || 'cardnews'}-slides.zip`);
    } catch {
      setError('ZIP 내보내기에 실패했습니다.');
    } finally {
      setExporting(false);
    }
  };

  if (!slides.length && !error) {
    return <main className="mx-auto px-6 py-16">불러오는 중...</main>;
  }

  const selectedSlide = slides[selectedIndex];

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1.1fr_1fr]">
      <section className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">에디터</h1>
          <p className="text-sm text-slate-600">주제: {topic}</p>
          <p className="text-sm text-slate-500">저장 상태: {status === 'saving' ? '저장 중...' : status === 'saved' ? '저장 완료' : '편집 중'}</p>
        </div>

        {selectedSlide ? <SlidePreview ref={previewRef} slide={selectedSlide} index={selectedIndex} /> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCurrentPng}
            aria-label="현재 슬라이드 PNG 다운로드"
            disabled={exporting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
          >
            PNG 다운로드
          </button>
          <button
            type="button"
            onClick={exportZip}
            aria-label="전체 슬라이드 ZIP 다운로드"
            disabled={exporting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
          >
            ZIP 다운로드
          </button>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </section>

      <section className="flex flex-col gap-4">
        <ThumbnailList slides={slides} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        {selectedSlide ? (
          <SlideFormEditor slide={selectedSlide} index={selectedIndex} onChange={(next) => updateSlide(selectedIndex, next)} />
        ) : null}
      </section>
    </main>
  );
}
