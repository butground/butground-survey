import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminKey } from '@/lib/admin-auth';
import { listSubmissions } from '@/lib/store';

// 비밀번호 헤더에 따라 응답이 달라지므로 캐시되지 않도록 강제
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const key = req.headers.get('x-admin-key');
  if (!isValidAdminKey(key)) {
    return NextResponse.json(
      { status: 'error', message: 'unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const submissions = await listSubmissions();
  // 최신 제출이 위로 오도록 정렬
  submissions.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return NextResponse.json(
    { status: 'ok', submissions },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
