import type { SubmitPayload } from '@/types';

/**
 * 구글 시트에 저장할 컬럼 순서.
 * doPost가 SpreadsheetApp에 appendRow 할 때 사용하는 순서와 동일하게 맞춰야 함.
 */
const SHEET_COLUMNS = [
  '제출시각',
  '이름',
  '직업',
  '직업(기타)',
  '연령대',
  '몸상태(1-10)',
  '마음상태(1-10)',
  '식사의미',
  '앞으로의식탁',
  '식문화경험',
  '인식_세부',
  '실천_세부',
  '확장_세부',
  '안내_세부',
  '함께하고싶은사람',
  '함께하고싶은사람(기타)',
  '연락처',
  '교육소식이메일',
  '남긴의견',
  '원본JSON',
] as const;

function toRow(data: SubmitPayload, submittedAt: string = new Date().toISOString()): (string | number)[] {
  return [
    submittedAt,
    data.name || '',
    data.job || '',
    data.job_other || '',
    data.age || '',
    data.body ?? '',
    data.mind ?? '',
    (data.meaning || []).join(', '),
    (data.table || []).join(', '),
    (data.experience || []).join(', '),
    (data.branch_인식 || []).join(', '),
    (data.branch_실천 || []).join(', '),
    (data.branch_확장 || []).join(', '),
    (data.branch_안내 || []).join(', '),
    (data.audience || []).join(', '),
    data.audience_other || '',
    data.contact || '',
    data.newsletter_email || '',
    data.feedback || '',
    JSON.stringify(data),
  ];
}

/**
 * ⚠️ 벗밭 실제 운영용 Apps Script 웹앱 기본 주소.
 * Vercel에 GOOGLE_SHEETS_WEBHOOK_URL 환경변수를 별도로 등록하지 않아도 이 주소로 저장되도록
 * 기본값(fallback)으로 넣어둔 것. 다른 시트로 바꾸고 싶으면 Vercel 환경변수에
 * GOOGLE_SHEETS_WEBHOOK_URL을 등록하면 이 기본값 대신 그 값이 우선 사용됨.
 */
const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwAP47Fvd1dxhFuAGL8d-aiR8tTaNYGiRfQB4Ug3e5Y8GvJcyiw99AlF_zVmw-XvrvS/exec';

/**
 * Apps Script 웹앱(/exec) 주소는 POST를 받으면 실제 실행 주소로 302 리다이렉트를 하는데,
 * 표준 fetch는 POST 요청의 리다이렉트를 따라가면서 메서드를 GET으로 바꿔버려 body(설문 데이터)가
 * 통째로 사라진다(그 결과 doPost 대신 doGet이 실행되어 시트에 아무것도 안 쌓임).
 * 이를 막기 위해 리다이렉트를 수동으로 따라가면서 POST를 유지한다.
 */
async function postFollowingRedirects(
  url: string,
  init: { headers: Record<string, string>; body: string },
  maxRedirects = 5
): Promise<Response> {
  let currentUrl = url;
  for (let i = 0; i < maxRedirects; i++) {
    const res = await fetch(currentUrl, { ...init, method: 'POST', redirect: 'manual' });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return res;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    return res;
  }
  throw new Error('too many redirects');
}

/**
 * 방식 1(기본값): 기존 프로토타입과 동일하게 Apps Script 웹앱 URL로 그대로 프록시 전달.
 * Content-Type을 text/plain으로 보내야 Apps Script 웹앱에서 CORS preflight 없이 받을 수 있음
 * (Apps Script 웹앱은 커스텀 헤더의 OPTIONS preflight에 응답하지 않기 때문).
 */
async function saveViaAppsScriptWebhook(data: SubmitPayload): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[벗밭 설문] GOOGLE_SHEETS_WEBHOOK_URL이 비어있어 구글 시트로 전송하지 않았어요.');
    return;
  }
  const res = await postFollowingRedirects(webhookUrl, {
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error('[벗밭 설문] 구글 시트 웹훅 응답 실패', res.status, await res.text());
  }
}

/**
 * 방식 2(확장용): 구글 서비스 계정으로 googleapis를 통해 시트에 직접 append.
 * GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY / GOOGLE_SHEET_ID 환경변수가 필요함.
 * 이 방식을 쓰려면 서비스 계정 이메일을 대상 스프레드시트에 "편집자"로 공유해줘야 함.
 */
async function saveViaServiceAccount(data: SubmitPayload): Promise<void> {
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;
  if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
    console.warn('[벗밭 설문] 서비스 계정 환경변수가 비어있어 구글 시트로 전송하지 않았어요.');
    return;
  }

  // googleapis는 이 방식을 사용할 때만 필요하므로 동적 import로 불러온다.
  const { google } = await import('googleapis');

  const auth = new google.auth.JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // Vercel 환경변수에 개행이 이스케이프되어 저장되는 경우가 많아 복원해줌
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: '응답!A:R',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [toRow(data)],
    },
  });
}

/**
 * 설문 응답을 구글 시트에 저장한다.
 * SHEETS_SAVE_MODE 환경변수로 저장 방식을 스위칭할 수 있음:
 *   - 'webhook'(기본값): Apps Script 웹앱 프록시
 *   - 'service-account': googleapis + 서비스 계정으로 직접 append
 * 실패해도 호출부(결과 화면 전환)에는 영향이 없도록 여기서 에러를 삼키고 로그만 남긴다.
 */
export async function saveSurveyResponse(data: SubmitPayload): Promise<void> {
  const mode = process.env.SHEETS_SAVE_MODE || 'webhook';
  try {
    if (mode === 'service-account') {
      await saveViaServiceAccount(data);
    } else {
      await saveViaAppsScriptWebhook(data);
    }
  } catch (err) {
    console.error('[벗밭 설문] 구글 시트 저장 실패', err);
  }
}

export { SHEET_COLUMNS, toRow };
