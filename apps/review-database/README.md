# 벗밭 소감 DB

프로그램이 끝난 뒤 참가자들의 소감을 붙여넣으면 `⸻` 구분선 기준으로 사람별로 나눠 저장하고,
최신순으로 모아보는 웹 도구입니다.

- `/feedback` — 소감 텍스트를 붙여넣는 입력 화면
- `/feedback/db` — 저장된 소감을 최신순으로 보여주는 DB 화면 (CSV 다운로드 포함)

## 배포 (Vercel)

1. 이 저장소를 Vercel에 Import
2. **Settings → Environment Variables**에 `REDIS_URL`을 등록 (Upstash 등 Redis 접속 URL)
3. Deploy

REDIS_URL이 없으면 소감이 내부 저장소에 쌓이지 않으니 꼭 등록해주세요.

## 로컬 실행

```bash
npm install
REDIS_URL=redis://... npm run dev
```
