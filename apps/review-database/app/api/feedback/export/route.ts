import { NextResponse } from 'next/server';
import { listFeedbackEntries } from '@/lib/feedbackStore';
import { buildFeedbackCsv } from '@/lib/feedbackExport';

// 매번 최신 데이터를 반환해야 하므로 캐시되지 않도록 강제
export const dynamic = 'force-dynamic';

export async function GET() {
  let entries;
  try {
    entries = await listFeedbackEntries();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[벗밭 소감] /api/feedback/export 실패', err);
    return NextResponse.json(
      { status: 'error', message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  entries.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const filename = `butground-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
  const csv = buildFeedbackCsv(entries);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
