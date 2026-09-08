'use client';

import { useEffect, useState } from 'react';
import type { StoredSubmission } from '@/types';

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/submissions', { cache: 'no-store' });
      const json = await res.json();
      setSubmissions(json.submissions || []);
    } catch {
      setError('불러오는 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function download(format: 'csv' | 'xlsx') {
    const res = await fetch(`/api/admin/export?format=${format}`, { cache: 'no-store' });
    if (!res.ok) {
      setError('다운로드에 실패했어요.');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `butground-survey-${new Date().toISOString().slice(0, 10)}.${format}`;
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
            <h1 className="text-xl font-bold text-ink">벗밭 설문 응답 ({submissions.length}건)</h1>
            <p className="text-sm text-ink-soft">여기서 CSV/엑셀 파일로 다운로드해서 구글 시트에 붙여넣을 수 있어요.</p>
          </div>
          <div className="flex gap-2">
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
              onClick={() => download('csv')}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent-dark"
            >
              CSV 다운로드
            </button>
            <button
              type="button"
              onClick={() => download('xlsx')}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white hover:bg-accent-dark"
            >
              엑셀(XLSX) 다운로드
            </button>
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-danger">{error}</p>}

        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-ink-soft">
                <th className="px-3 py-2">제출시각</th>
                <th className="px-3 py-2">이름</th>
                <th className="px-3 py-2">직업</th>
                <th className="px-3 py-2">연령대</th>
                <th className="px-3 py-2">몸상태</th>
                <th className="px-3 py-2">마음상태</th>
                <th className="px-3 py-2">식문화경험</th>
                <th className="px-3 py-2">남긴의견</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-ink-faint">
                    {loading ? '불러오는 중...' : '아직 응답이 없어요.'}
                  </td>
                </tr>
              )}
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 text-ink-soft">
                    {new Date(s.submittedAt).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-3 py-2">{s.name}</td>
                  <td className="px-3 py-2">{s.job === '기타' ? s.job_other || '기타' : s.job}</td>
                  <td className="px-3 py-2">{s.age}</td>
                  <td className="px-3 py-2">{s.body}</td>
                  <td className="px-3 py-2">{s.mind}</td>
                  <td className="px-3 py-2">{(s.experience || []).join(', ')}</td>
                  <td className="max-w-[240px] truncate px-3 py-2">{s.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
