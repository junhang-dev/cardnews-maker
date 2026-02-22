import type { Slide } from '@/src/lib/generator';

interface SlideFormEditorProps {
  slide: Slide;
  index: number;
  onChange: (next: Slide) => void;
}

export function SlideFormEditor({ slide, index, onChange }: SlideFormEditorProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-lg font-bold text-slate-900">{index + 1}번 슬라이드 편집</h3>

      <div className="mb-3 flex flex-col gap-1">
        <label htmlFor="slide-title" className="text-sm font-medium text-slate-700">
          제목
        </label>
        <input
          id="slide-title"
          value={slide.title}
          onChange={(event) => onChange({ ...slide, title: event.target.value })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="slide-body" className="text-sm font-medium text-slate-700">
          본문
        </label>
        <textarea
          id="slide-body"
          value={slide.body}
          onChange={(event) => onChange({ ...slide, body: event.target.value })}
          rows={8}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-indigo-500 focus:ring"
        />
      </div>
    </section>
  );
}
