import type { StoredSubmission, SubmitPayload } from '@/types';

const LIST_KEY = 'butground:submissions';

// 같은 서버리스 인스턴스에서 재사용하도록 모듈 스코프에 캐시(콜드 스타트마다 재연결하는 걸 방지)
let client: import('ioredis').Redis | null = null;

async function getClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!client) {
    const { Redis } = await import('ioredis');
    client = new Redis(url, { maxRetriesPerRequest: 3 });
  }
  return client;
}

/**
 * 설문 응답을 내부 저장소(Redis)에 쌓는다.
 * 구글 시트 전송이 실패하더라도 이쪽은 항상 성공하도록, 구글 시트 저장과는 완전히 분리해서 사용함.
 * Redis가 연결되어 있지 않으면(REDIS_URL 미설정, 로컬 개발 등) 조용히 건너뛴다.
 */
export async function appendSubmission(data: SubmitPayload): Promise<void> {
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
}

export async function listSubmissions(): Promise<StoredSubmission[]> {
  const redis = await getClient();
  if (!redis) return [];
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
