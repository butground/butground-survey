import { NextRequest, NextResponse } from 'next/server';
import { saveSurveyResponse } from '@/lib/sheets';
import type { SubmitPayload } from '@/types';

export async function POST(req: NextRequest) {
  let data: SubmitPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ status: 'error', message: 'invalid json' }, { status: 400 });
  }

  // 저장 실패해도 사용자에게는 항상 성공으로 응답해서 결과 화면 전환을 막지 않는다.
  await saveSurveyResponse(data);

  return NextResponse.json({ status: 'ok' });
}
