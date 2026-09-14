'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FeedbackEntry } from '@/types';

export default function FeedbackDbPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', { cache: 'no-store' });
      const json = await res.json();
      setEntries(json.entries || []);
      if (json.status === 'error') {
        setError(`저장소 연결 실패: ${json.message}`);
      }
    } catch {
      setError('불러오는 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function downloadCsv() {
    const res = await fetch('/api/feedback/export', { cache: 'no-store' });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      setError(json?.message ? `다운로드 실패: ${json.message}` : '다운로드에 실패했어요.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `butground-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink">벗밭 소감 DB ({entries.length}건)</h1>
            <p className="text-sm text-ink-soft">최신 등록순으로 보여줘요. CSV로 다운로드해서 구글 시트에 붙여넣을 수 있어요.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/feedback"
              className="rounded-lg border-[1.5px] border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
            >
              새 소감 입력하기
            </Link>
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="rounded-lg border-[1.5px] border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
            >
              새로고침
            </button>
            <button
              type="button"
              onClick={downloadCsv}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent-dark"
            >
              CSV 다운로드
            </button>
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-danger">{error}</p>}

        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="min-w-[800px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-ink-soft">
                <th className="whitespace-nowrap px-3 py-2">날짜</th>
                <th className="whitespace-nowrap px-3 py-2">이름</th>
                <th className="px-3 py-2">소감 내용</th>
                <th className="whitespace-nowrap px-3 py-2">등록시각</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-ink-faint">
                    {loading ? '불러오는 중...' : '아직 등록된 소감이 없어요.'}
                  </td>
                </tr>
              )}
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-line align-top last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 text-ink-soft">{entry.date}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-ink">{entry.name}</td>
                  <td className="px-3 py-2 whitespace-pre-line text-ink">{entry.content}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-ink-soft">
                    {new Date(entry.createdAt).toLocaleString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
