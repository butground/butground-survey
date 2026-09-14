import type { FeedbackEntry } from '@/types';

const LIST_KEY = 'butground:feedback-entries';

// 같은 서버리스 인스턴스에서 재사용하도록 모듈 스코프에 캐시(콜드 스타트마다 재연결하는 걸 방지)
let client: import('ioredis').Redis | null = null;

async function getClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!client) {
    const { default: Redis } = await import('ioredis');
    client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 2, connectTimeout: 5000 });
    client.on('error', (err) => {
      console.error('[벗밭 소감] Redis 연결 에러', err);
    });
  }
  return client;
}

/**
 * 붙여넣은 소감 텍스트를 "⸻"(또는 --- 등 대시 3개 이상) 구분선 기준으로 사람별 블록으로 나눈다.
 * 각 블록의 첫 줄은 이름/역할(예: "참여자 3", "벗밭 마무리")로, 나머지는 본문으로 취급한다.
 */
export function parseFeedbackBlocks(raw: string): { name: string; content: string }[] {
  const normalized = raw.replace(/\r\n/g, '\n');
  const chunks = normalized.split(/\n[ \t]*(?:⸻+|[-—]{3,})[ \t]*\n/g);

  const blocks: { name: string; content: string }[] = [];
  for (const chunk of chunks) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const lines = trimmed.split('\n').map((l) => l.trim());
    const name = lines[0] || '(이름 없음)';
    const content = lines.slice(1).join('\n').trim();
    blocks.push({ name, content: content || trimmed });
  }
  return blocks;
}

/**
 * 붙여넣은 소감 텍스트를 파싱해서 사람별로 나눈 뒤 내부 저장소(Redis)에 쌓는다.
 * Redis가 연결되어 있지 않으면(REDIS_URL 미설정) 에러를 던져서 호출부에서 사용자에게 알리게 한다.
 */
export async function appendFeedbackBatch(date: string, rawText: string): Promise<FeedbackEntry[]> {
  const redis = await getClient();
  if (!redis) {
    throw new Error('REDIS_URL 환경변수가 설정되어 있지 않아요.');
  }

  const blocks = parseFeedbackBlocks(rawText);
  if (blocks.length === 0) {
    throw new Error('저장할 내용이 없어요. 텍스트를 붙여넣어주세요.');
  }

  const batchId = crypto.randomUUID();
  const now = new Date().toISOString();
  const entries: FeedbackEntry[] = blocks.map((block) => ({
    id: crypto.randomUUID(),
    date,
    batchId,
    name: block.name,
    content: block.content,
    createdAt: now,
  }));

  const pipeline = redis.pipeline();
  for (const entry of entries) {
    pipeline.rpush(LIST_KEY, JSON.stringify(entry));
  }
  await pipeline.exec();

  return entries;
}

/**
 * DB 페이지에서 호출. Redis 연결/조회 실패 시 원인을 화면에서 바로 볼 수 있도록
 * 에러를 삼키지 않고 그대로 던진다(호출부인 API 라우트에서 잡아서 메시지로 내려줌).
 */
export async function listFeedbackEntries(): Promise<FeedbackEntry[]> {
  const redis = await getClient();
  if (!redis) {
    throw new Error('REDIS_URL 환경변수가 설정되어 있지 않아요.');
  }
  const raw = await redis.lrange(LIST_KEY, 0, -1);
  return raw
    .map((item) => {
      try {
        return JSON.parse(item) as FeedbackEntry;
      } catch {
        return null;
      }
    })
    .filter((v): v is FeedbackEntry => v !== null);
}
