import { NextRequest, NextResponse } from 'next/server';
import { saveSurveyResponse } from '@/lib/sheets';
import { appendSubmission } from '@/lib/store';
import type { SubmitPayload } from '@/types';

export async function POST(req: NextRequest) {
  let data: SubmitPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ status: 'error', message: 'invalid json' }, { status: 400 });
  }

  // 두 저장 방식 모두 실패해도 사용자에게는 항상 성공으로 응답해서 결과 화면 전환을 막지 않는다.
  // 구글 시트 전송이 실패해도 내부 저장소(/admin에서 다운로드 가능)에는 반드시 남도록 별도로 처리.
  await Promise.allSettled([saveSurveyResponse(data), appendSubmission(data)]);

  return NextResponse.json({ status: 'ok' });
}
