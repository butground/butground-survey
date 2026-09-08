import type { StoredSubmission, SubmitPayload } from '@/types';

const LIST_KEY = 'butground:submissions';

/**
 * Vercel의 "Storage" 탭에서 Redis(Upstash)를 연결하면 REST URL/TOKEN 환경변수가 자동으로
 * 채워짐. Vercel KV(구)와 Upstash Redis(신) 마켓플레이스 통합이 서로 다른 이름의
 * 환경변수를 쓸 수 있어 둘 다 확인한다.
 */
function getCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

/**
 * 설문 응답을 내부 저장소(Redis)에 쌓는다.
 * 구글 시트 전송이 실패하더라도 이쪽은 항상 성공하도록, 구글 시트 저장과는 완전히 분리해서 사용함.
 * Redis가 연결되어 있지 않으면(로컬 개발 등) 조용히 건너뛴다.
 */
export async function appendSubmission(data: SubmitPayload): Promise<void> {
  const creds = getCredentials();
  if (!creds) {
    console.warn('[벗밭 설문] Redis(KV)가 연결되어 있지 않아 내부 저장소에는 저장하지 않았어요.');
    return;
  }
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis(creds);
  const record: StoredSubmission = {
    ...data,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  await redis.rpush(LIST_KEY, JSON.stringify(record));
}

export async function listSubmissions(): Promise<StoredSubmission[]> {
  const creds = getCredentials();
  if (!creds) return [];
  const { Redis } = await import('@upstash/redis');
  const redis = new Redis(creds);
  const raw = await redis.lrange<string>(LIST_KEY, 0, -1);
  return raw
    .map((item) => {
      try {
        return typeof item === 'string' ? (JSON.parse(item) as StoredSubmission) : (item as unknown as StoredSubmission);
      } catch {
        return null;
      }
    })
    .filter((v): v is StoredSubmission => v !== null);
}
