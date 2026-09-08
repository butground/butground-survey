# 벗밭 · 식사 체크리스트 설문

'벗밭'(식문화 소셜벤처)의 설문 기반 인터랙티브 원페이지 웹앱입니다.
Next.js 14(App Router) + TypeScript + Tailwind CSS로 작성되었습니다.

디자인/카피/인터랙션/결과 매칭 로직은 프로토타입(`butground-survey-prototype.html`)의 최종 상태를
그대로 재구현한 것입니다.

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # 환경변수 채우기 (아래 참고)
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 환경변수

`.env.example` 참고. 구글 시트 저장 방식은 `SHEETS_SAVE_MODE`로 전환할 수 있습니다.

| 변수 | 설명 |
| --- | --- |
| `SHEETS_SAVE_MODE` | `webhook`(기본값) 또는 `service-account` |
| `GOOGLE_SHEETS_WEBHOOK_URL` | (webhook 모드) Apps Script 웹앱 배포 URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | (service-account 모드) 서비스 계정 이메일 |
| `GOOGLE_PRIVATE_KEY` | (service-account 모드) 서비스 계정 개인키 (`\n`으로 이스케이프) |
| `GOOGLE_SHEET_ID` | (service-account 모드) 대상 스프레드시트 ID |

`GOOGLE_SHEETS_WEBHOOK_URL`을 별도로 설정하지 않으면 `lib/sheets.ts`에 넣어둔 기본 Apps Script
웹앱 주소로 자동 전송됩니다. 다른 시트로 바꾸고 싶으면 Vercel 환경변수에
`GOOGLE_SHEETS_WEBHOOK_URL`을 등록하면 그 값이 우선 사용됩니다.

### 방식 1: Apps Script 웹앱 (기본값)

기존 프로토타입과 동일한 방식입니다. 아래 스크립트를 Google Apps Script 프로젝트에 붙여넣고
"웹 앱으로 배포"(액세스 권한: 모든 사용자, 실행 사용자: 나)한 뒤 발급받은 URL을
`GOOGLE_SHEETS_WEBHOOK_URL`에 넣어주세요.

```js
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('응답')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('응답');
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['제출시각','이름','직업','직업(기타)','연령대','몸상태(1-10)','마음상태(1-10)',
      '식사의미','앞으로의식탁','식문화경험','인식_세부','실천_세부','확장_세부','안내_세부',
      '함께하고싶은사람','함께하고싶은사람(기타)','남긴의견','원본JSON']);
  }
  sheet.appendRow([new Date(), data.name||'', data.job||'', data.job_other||'',
    data.age||'', data.body||'', data.mind||'', (data.meaning||[]).join(', '),
    (data.table||[]).join(', '), (data.experience||[]).join(', '),
    (data.branch_인식||[]).join(', '), (data.branch_실천||[]).join(', '),
    (data.branch_확장||[]).join(', '), (data.branch_안내||[]).join(', '),
    (data.audience||[]).join(', '), data.audience_other||'', data.feedback||'',
    JSON.stringify(data)]);
  return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) { return ContentService.createTextOutput('OK'); }
```

Next.js 앱은 브라우저에서 이 URL로 직접 fetch하지 않고, `/app/api/submit/route.ts`를 통해
서버에서 프록시로 전달합니다.

### 방식 2: 서비스 계정으로 직접 연동 (확장용)

`googleapis` 패키지로 서비스 계정 인증을 사용해 시트에 직접 행을 추가합니다.
서비스 계정을 만들고 그 이메일을 대상 스프레드시트에 "편집자"로 공유한 뒤,
`SHEETS_SAVE_MODE=service-account`로 설정하고 나머지 서비스 계정 관련 환경변수를 채워주세요.

저장 로직은 `lib/sheets.ts`의 `saveSurveyResponse()` 함수 하나로 분리되어 있어 필요하면
다른 저장 방식으로도 쉽게 확장할 수 있습니다.

## Vercel 배포

1. 이 저장소를 Vercel 프로젝트로 import합니다 (Next.js 프로젝트는 별도 설정 없이 자동 인식됩니다).
2. Vercel 프로젝트의 Environment Variables에 위 표의 환경변수를 등록합니다.
3. Deploy 하면 끝입니다. `vercel.json` 등 별도 설정 파일은 필요 없습니다.

## 아직 확정되지 않은 부분 (TODO)

- `data/programs.ts`의 '인식' · '실천' · '안내' 태그 프로그램은 아직 프로그램명이 (가제) 상태입니다.
  실제 프로그램명이 정해지면 `title`만 교체하면 됩니다.
- 모든 프로그램 카드의 `image`가 `null`로 비어있어 자리표시 아이콘이 보입니다. 실제 대표사진 URL이
  정해지면 `data/programs.ts`에서 `image: null`을 이미지 URL 문자열로만 바꾸면 바로 사진으로 교체됩니다.
- 모든 카드의 `link`가 `'#'`로 비어있습니다. 실제 콘텐츠 링크가 정해지면 같은 파일에서 교체하면 됩니다.
- 구글 시트 실제 연동 정보(Apps Script 웹앱 URL 또는 서비스 계정 정보)가 아직 채워지지 않았습니다.
  `.env.local`(로컬) 또는 Vercel 환경변수(배포)에 채워주세요.
- 결과 화면 하단의 "응답 데이터 확인 (테스트용)" 아코디언은 개발/테스트 확인용입니다.
  실서비스 배포 시 `components/ResultScreen.tsx`에서 해당 `<details>` 블록을 제거해도 됩니다.

## 폴더 구조

```
app/
  layout.tsx, page.tsx, globals.css
  api/submit/route.ts       # 구글 시트 저장 프록시 API
components/
  SurveyApp.tsx              # 설문 진행 상태 관리 + 화면 전환
  ProgressBar.tsx, TopBar.tsx, QuestionCard.tsx, Controls.tsx
  LoadingScreen.tsx, ResultScreen.tsx, ProgramCardView.tsx
data/
  questions.ts                # 질문 목록 + 분기 질문 정의
  programs.ts                  # 태그별 결과 프로그램 카드
lib/
  branching.ts                 # Q8 응답에 따른 분기 질문 삽입 로직
  matching.ts                  # 선택 태그 → 결과 카드 매칭 로직
  sheets.ts                    # 구글 시트 저장 로직 (webhook / service-account)
types/
  index.ts
```
