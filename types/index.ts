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

/** "라벨 | 설명" 형태의 불릿 한 줄. subBullets가 있으면 그 아래 한 단계 들여써서 보여줌 */
export interface ProgramBullet {
  label?: string;
  text: string;
  subBullets?: string[];
}

/** "함께한 기관과 활동 내용" 섹션의 사례 하나. 사진/캡션/관련 링크는 선택 */
export interface ProgramFieldVisit {
  /** 기관/활동명 등 굵게 강조할 부분(예: "[서울청년센터] 제철 식사 교육") */
  label?: string;
  text: string;
  image?: string | null;
  caption?: string;
  /** 관련 콘텐츠 버튼(들). 여러 개면 나란히 넉넉한 간격으로 표시됨 */
  links?: { text: string; url: string }[];
}

/** 인식하기 카드에서만 쓰는 5단계 다이어그램(생산→가공→유통→소비→폐기) */
export interface ProgramDiagramCategory {
  label: string;
  items: string[];
}

/**
 * 확장하기 카드에서 쓰는 가치 카드 한 장(생태/미식/관계/커뮤니티/실천 등).
 * desc 안에서 **이렇게** 감싼 부분은 굵게 렌더링됨.
 */
export interface ProgramValueCard {
  icon: string;
  titleKo: string;
  titleEn: string;
  desc: string;
  sdgs: string[];
}

export interface ProgramCard {
  icon: string;
  /** 실제 대표사진 URL. null/undefined면 대표사진 영역 자체를 표시하지 않음 */
  image?: string | null;
  title: string;
  desc: string;
  link: string;
  /**
   * 결과 화면 카드 번호(01/02/03/04)에 쓰이는 값. 4개 교육 모델(인식/실천/확장/안내)
   * 기준으로 매겨야 해서, 확장하기처럼 한 태그에 카드가 여러 개여도 같은 번호를 써야 함.
   * 지정하지 않으면 화면에 보이는 순서(index+1)를 그대로 씀.
   */
  modelNumber?: number;
  /** 아래 필드가 있으면 카드가 제목+불릿+현장 둘러보기 형태의 상세 레이아웃으로 렌더링됨 */
  heading?: string;
  bullets?: ProgramBullet[];
  diagram?: ProgramDiagramCategory[];
  fieldVisits?: ProgramFieldVisit[];
  /** 구글 드라이브 등에서 가져온 임베드 영상 (16:9 iframe으로 표시) */
  video?: { embedUrl: string; caption?: string };
  /** "함께한 기관과 활동 내용" 위에 표시되는 가치 카드 그리드 (현재 확장하기에서만 사용) */
  values?: ProgramValueCard[];
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
