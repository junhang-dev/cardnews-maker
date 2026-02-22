import type { Slide } from '@/src/lib/generator';
import { forwardRef } from 'react';

interface SlidePreviewProps {
  slide: Slide;
  index: number;
}

export const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(function SlidePreview(
  { slide, index },
  ref,
) {
  return (
    <article
      ref={ref}
      className="aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 shadow-lg"
      aria-label={`${index + 1}번 슬라이드 미리보기`}
    >
      <p className="mb-4 text-sm font-semibold text-indigo-600">Slide {index + 1}</p>
      <h2
        className="mb-5 text-3xl font-extrabold leading-tight text-slate-900"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          wordBreak: 'keep-all',
        }}
      >
        {slide.title}
      </h2>
      <p
        className="text-lg leading-relaxed text-slate-700"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 11,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          textOverflow: 'ellipsis',
        }}
      >
        {slide.body}
      </p>
    </article>
  );
});
