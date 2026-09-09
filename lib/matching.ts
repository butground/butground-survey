import { branchOrder } from '@/data/questions';
import { programsByTag } from '@/data/programs';
import type { ExperienceTag, ProgramCard, SurveyAnswers } from '@/types';

/**
 * Q8에서 고른 태그(최대 2개)에 해당하는 카드만 인식→실천→확장→안내 순서로 모아 반환한다.
 * 개인화 카드가 0개인 경우(예외 상황) 호출부에서 getAllPrograms()로 대체해서 보여줘야 한다.
 */
export function getPersonalizedPrograms(answers: SurveyAnswers): ProgramCard[] {
  const tags = (answers.experience || []) as ExperienceTag[];
  return branchOrder.filter((t) => tags.includes(t)).flatMap((t) => programsByTag[t]);
}

/** 전체 보기 화면용: 인식→실천→확장→안내 순서로 모든 태그의 카드를 합친 목록(총 5개) */
export function getAllPrograms(): ProgramCard[] {
  return branchOrder.flatMap((t) => programsByTag[t]);
}
