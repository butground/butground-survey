import type { StoredSubmission, SubmitPayload } from '@/types';

const LIST_KEY = 'butground:submissions';

// 같은 서버리스 인스턴스에서 재사용하도록 모듈 스코프에 캐시(콜드 스타트마다 재연결하는 걸 방지)
let client: import('ioredis').Redis | null = null;

async function getClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!client) {
    const { Redis } = await import('ioredis');
    // lazyConnect: 연결을 첫 명령 실행 시점으로 미뤄서, 연결 실패가 await한 명령의
    // reject로 잡히게 함(그렇지 않으면 백그라운드에서 처리 안 된 에러로 터질 수 있음).
    client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 2, connectTimeout: 5000 });
    client.on('error', (err) => {
      console.error('[벗밭 설문] Redis 연결 에러', err);
    });
  }
  return client;
}

/**
 * 설문 응답을 내부 저장소(Redis)에 쌓는다.
 * 구글 시트 전송이 실패하더라도 이쪽은 항상 성공하도록, 구글 시트 저장과는 완전히 분리해서 사용함.
 * Redis가 연결되어 있지 않거나(REDIS_URL 미설정) 연결에 실패하면 에러를 삼키고 로그만 남긴다.
 */
export async function appendSubmission(data: SubmitPayload): Promise<void> {
  try {
    const redis = await getClient();
    if (!redis) {
      console.warn('[벗밭 설문] REDIS_URL이 없어 내부 저장소에는 저장하지 않았어요.');
      return;
    }
    const record: StoredSubmission = {
      ...data,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    await redis.rpush(LIST_KEY, JSON.stringify(record));
  } catch (err) {
    console.error('[벗밭 설문] 내부 저장소 저장 실패', err);
  }
}

/**
 * 관리자 페이지에서 호출. Redis 연결/조회 실패 시 원인을 화면에서 바로 볼 수 있도록
 * 에러를 삼키지 않고 그대로 던진다(호출부인 API 라우트에서 잡아서 메시지로 내려줌).
 */
export async function listSubmissions(): Promise<StoredSubmission[]> {
  const redis = await getClient();
  if (!redis) {
    throw new Error('REDIS_URL 환경변수가 설정되어 있지 않아요.');
  }
  const raw = await redis.lrange(LIST_KEY, 0, -1);
  return raw
    .map((item) => {
      try {
        return JSON.parse(item) as StoredSubmission;
      } catch {
        return null;
      }
    })
    .filter((v): v is StoredSubmission => v !== null);
}
