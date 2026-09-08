import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminKey } from '@/lib/admin-auth';
import { listSubmissions } from '@/lib/store';

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (!isValidAdminKey(key)) {
    return NextResponse.json({ status: 'error', message: 'unauthorized' }, { status: 401 });
  }

  const submissions = await listSubmissions();
  // 최신 제출이 위로 오도록 정렬
  submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return NextResponse.json({ status: 'ok', submissions });
}
