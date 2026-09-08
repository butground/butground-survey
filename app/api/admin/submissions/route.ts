import { NextResponse } from 'next/server';
import { listSubmissions } from '@/lib/store';

// 매번 최신 데이터를 반환해야 하므로 캐시되지 않도록 강제
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const submissions = await listSubmissions();
    // 최신 제출이 위로 오도록 정렬
    submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

    return NextResponse.json(
      { status: 'ok', submissions },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[벗밭 설문] /api/admin/submissions 실패', err);
    return NextResponse.json(
      { status: 'error', message, submissions: [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
