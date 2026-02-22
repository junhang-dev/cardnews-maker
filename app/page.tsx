import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-4 px-6 py-16">
      <p className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
        Cardnews Maker
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">카드뉴스 제작 시작하기</h1>
      <p className="text-slate-600">Next.js App Router + TypeScript + Tailwind CSS 기본 구성이 준비되었습니다.</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/create">
          새 프로젝트 만들기
        </Link>
        <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800" href="/editor/sample-id">
          에디터 샘플 보기
        </Link>
      </div>
    </main>
  );
}
