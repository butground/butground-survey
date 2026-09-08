import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminKey } from '@/lib/admin-auth';
import { listSubmissions } from '@/lib/store';
import { buildCsv, buildXlsx } from '@/lib/export';

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (!isValidAdminKey(key)) {
    return NextResponse.json({ status: 'error', message: 'unauthorized' }, { status: 401 });
  }

  const format = req.nextUrl.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';
  const submissions = await listSubmissions();
  submissions.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

  const filename = `butground-survey-${new Date().toISOString().slice(0, 10)}.${format}`;

  if (format === 'xlsx') {
    const buffer = await buildXlsx(submissions);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  const csv = buildCsv(submissions);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
