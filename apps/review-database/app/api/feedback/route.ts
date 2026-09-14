import { NextRequest, NextResponse } from 'next/server';
import { appendFeedbackBatch, listFeedbackEntries } from '@/lib/feedbackStore';

// 매번 최신 데이터를 반환해야 하므로 캐시되지 않도록 강제
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = await listFeedbackEntries();
    // 최신 등록순으로 정렬
    entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json(
      { status: 'ok', entries },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[벗밭 소감] GET /api/feedback 실패', err);
    return NextResponse.json(
      { status: 'error', message, entries: [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: { date?: string; text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: 'error', message: 'invalid json' }, { status: 400 });
  }

  const date = body.date || new Date().toISOString().slice(0, 10);
  const text = (body.text || '').trim();
  if (!text) {
    return NextResponse.json({ status: 'error', message: '텍스트를 입력해주세요.' }, { status: 400 });
  }

  try {
    const entries = await appendFeedbackBatch(date, text);
    return NextResponse.json({ status: 'ok', entries });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[벗밭 소감] POST /api/feedback 실패', err);
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
