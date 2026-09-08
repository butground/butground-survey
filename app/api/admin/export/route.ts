import { NextRequest, NextResponse } from 'next/server';
import { listSubmissions } from '@/lib/store';
import { buildCsv, buildXlsx } from '@/lib/export';

// 매번 최신 데이터를 반환해야 하므로 캐시되지 않도록 강제
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';

  let submissions;
  try {
    submissions = await listSubmissions();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[벗밭 설문] /api/admin/export 실패', err);
    return NextResponse.json(
      { status: 'error', message },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
  submissions.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

  const filename = `butground-survey-${new Date().toISOString().slice(0, 10)}.${format}`;

  if (format === 'xlsx') {
    const buffer = await buildXlsx(submissions);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  const csv = buildCsv(submissions);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
