/**
 * 프로그램 종료 후 참가자들이 돌아가면서 말한 소감 텍스트를 붙여넣으면,
 * "⸻" 구분선을 기준으로 사람별로 나눠 이 형태로 저장한다.
 */
export interface FeedbackEntry {
  id: string;
  /** 소감을 나눈 날짜(프로그램 진행일). YYYY-MM-DD */
  date: string;
  /** 같은 붙여넣기에서 나온 항목들을 묶는 id */
  batchId: string;
  /** 구분선 위에 적힌 이름/역할 한 줄 (예: "참여자 3", "벗밭 마무리") */
  name: string;
  /** 이름 줄 아래 나머지 본문 */
  content: string;
  createdAt: string;
}
