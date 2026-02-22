import type { Slide } from '@/src/lib/generator';

interface ThumbnailListProps {
  slides: Slide[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ThumbnailList({ slides, selectedIndex, onSelect }: ThumbnailListProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {slides.map((slide, index) => {
        const selected = index === selectedIndex;
        return (
          <li key={`thumb-${index + 1}`}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`${index + 1}번 슬라이드 선택`}
              className={`w-full rounded-lg border p-3 text-left transition ${
                selected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <p className="text-xs font-bold">#{index + 1}</p>
              <p
                className="text-sm"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                }}
              >
                {slide.title}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
