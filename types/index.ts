export type QuestionType = 'text' | 'textarea' | 'single' | 'multi' | 'scale';

export interface QuestionOption {
  label: string;
  value: string;
  /** 선택 시 별도의 텍스트 입력창을 추가로 보여줘야 하는 옵션(예: "기타") */
  other?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  required: boolean;
  title: string;
  /**
   * 제목 안에서 강조 렌더링할 부분 문자열(굵게 + 포인트색).
   * 예: "두 가지" 처럼 title에 포함된 정확한 substring.
   */
  emphasize?: string;
  sub?: string;
  placeholder?: string;
  options?: QuestionOption[];
  /** multi 타입일 때 최대 선택 개수 */
  max?: number;
  /** 분기 질문일 경우, 어떤 태그에 연결된 질문인지 */
  branchTag?: ExperienceTag;
}

export type ExperienceTag = '인식' | '실천' | '확장' | '안내';

export type AnswerValue = string | number | string[] | undefined;

export interface SurveyAnswers {
  name?: string;
  job?: string;
  job_other?: string;
  age?: string;
  body?: number;
  mind?: number;
  meaning?: string[];
  table?: string[];
  experience?: ExperienceTag[];
  branch_인식?: string[];
  branch_실천?: string[];
  branch_확장?: string[];
  branch_안내?: string[];
  audience?: string[];
  audience_other?: string;
  feedback?: string;
  [key: string]: AnswerValue;
}

export interface ProgramCard {
  icon: string;
  /** 실제 대표사진 URL. null이면 자리표시 아이콘을 보여줌 */
  image: string | null;
  title: string;
  desc: string;
  link: string;
}

export type ProgramsByTag = Record<ExperienceTag, ProgramCard[]>;

export interface SubmitPayload {
  name: string;
  job: string;
  job_other: string;
  age: string;
  body: number | string;
  mind: number | string;
  meaning: string[];
  table: string[];
  experience: string[];
  branch_인식: string[];
  branch_실천: string[];
  branch_확장: string[];
  branch_안내: string[];
  audience: string[];
  audience_other: string;
  feedback: string;
}

/** 내부 저장소(KV)에 쌓이는 응답 1건. 제출 데이터 + 서버가 채워준 id/제출시각 */
export interface StoredSubmission extends SubmitPayload {
  id: string;
  submittedAt: string;
}
