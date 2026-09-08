/**
 * 질문 제목 안의 '나/당신' 같은 자기지칭 표현을, 응답자가 입력한 닉네임으로 바꿔치기한다.
 * 예) "나의 연령대는 어떻게 되나요?" + 닉네임 "철수" → "철수님의 연령대는 어떻게 되나요?"
 * 닉네임이 아직 없으면(Q1을 답하기 전) 원래 문구를 그대로 둔다.
 */
export function personalizeTitle(title: string, nickname?: string): string {
  const name = (nickname || '').trim();
  if (!name) return title;
  return title
    .replace(/당신은/g, `${name}님은`)
    .replace(/나의/g, `${name}님의`)
    .replace(/나를/g, `${name}님을`)
    .replace(/나에게/g, `${name}님에게`);
}
