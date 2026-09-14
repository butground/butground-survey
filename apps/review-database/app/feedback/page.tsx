'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function FeedbackInputPage() {
  const router = useRouter();
  const [date, setDate] = useState(today());
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError('소감 텍스트를 붙여넣어주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, text }),
      });
      const json = await res.json();
      if (json.status !== 'ok') {
        setError(json.message || '저장에 실패했어요.');
        setLoading(false);
        return;
      }
      router.push('/feedback/db');
    } catch {
      setError('저장 중 오류가 발생했어요.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-bold text-ink">오늘 소감 남기기</h1>
        <p className="mb-6 text-sm text-ink-soft">
          참가자들이 돌아가면서 말한 소감을 정리한 텍스트를 그대로 붙여넣어주세요. &ldquo;⸻&rdquo; 로 나뉜 사람별 소감이 각각 DB에
          쌓여요.
        </p>

        <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-surface p-5">
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-semibold text-ink-soft">날짜</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border-[1.5px] border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-ink-soft">소감 텍스트</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={'루나 (벗밭)\n\n7월부터 함께하게 되어...\n\n⸻\n\n참여자 1\n\n매주 정성스럽게...'}
              rows={16}
              className="w-full resize-y rounded-lg border-[1.5px] border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-accent"
            />
          </label>

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-accent px-4 py-3 text-sm font-bold text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {loading ? '저장 중...' : 'DB에 추가하기'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push('/feedback/db')}
          className="mt-4 w-full rounded-lg border-[1.5px] border-line bg-surface px-4 py-3 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
        >
          DB 보러가기
        </button>
      </div>
    </div>
  );
}
