import { baseAfter, baseBefore, branchDefs, branchOrder } from '@/data/questions';
import type { ExperienceTag, Question, SurveyAnswers } from '@/types';

/**
 * Q8(experience) 응답에 따라 branchOrder(인식→실천→확장→안내) 순서대로
 * 분기 질문을 baseBefore와 baseAfter 사이에 끼워 넣은 전체 질문 흐름을 계산한다.
 */
export function buildFlow(answers: SurveyAnswers): Question[] {
  const tags = (answers.experience || []) as ExperienceTag[];
  const branchSlides = branchOrder.filter((t) => tags.includes(t)).map((t) => branchDefs[t]);
  return [...baseBefore, ...branchSlides, ...baseAfter];
}
