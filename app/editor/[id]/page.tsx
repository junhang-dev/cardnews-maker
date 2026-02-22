interface EditorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-900">에디터</h1>
      <p className="text-slate-600">현재 편집 중인 프로젝트 ID: {id}</p>
    </main>
  );
}
