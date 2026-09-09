import type { ExperienceTag, Question } from '@/types';

/**
 * Q1~Q7 (Q8 앞까지) 공통 질문.
 * 나중에 문구를 바꿔야 하면 이 파일만 수정하면 됨.
 */
export const baseBefore: Question[] = [
  {
    id: 'name',
    type: 'text',
    required: true,
    title: '닉네임을 적어 주세요.',
    placeholder: '닉네임을 입력해주세요',
  },
  {
    id: 'job',
    type: 'single',
    required: true,
    title: '당신은 어떤 일을 하고 있나요?',
    options: [
      { label: '학생', value: '학생' },
      { label: '교사·강사', value: '교사·강사' },
      { label: '교육 기획·운영자', value: '교육 기획·운영자' },
      { label: '기관·단체 실무자', value: '기관·단체 실무자' },
      { label: '활동가', value: '활동가' },
      { label: '보호자', value: '보호자' },
      { label: '기타', value: '기타', other: true },
    ],
  },
  {
    id: 'age',
    type: 'single',
    required: true,
    title: '나의 연령대는 어떻게 되나요?',
    options: [
      { label: '10대 이하', value: '10대 이하' },
      { label: '20대', value: '20대' },
      { label: '30대', value: '30대' },
      { label: '40대', value: '40대' },
      { label: '50대', value: '50대' },
      { label: '60대 이상', value: '60대 이상' },
    ],
  },
  {
    id: 'body',
    type: 'scale',
    required: true,
    title: '지금 잠시 나를 돌아보아요. 지금 몸의 상태는 어떤가요?',
    sub: '1점(매우 나쁘다) ~ 10점(매우 좋다) 중에 하나를 선택해주세요.',
  },
  {
    id: 'mind',
    type: 'scale',
    required: true,
    title: '이번엔 마음을 돌아보아요. 마음을 1~10으로 표현한다면 어떤가요?',
    sub: '1점(매우 나쁘다) ~ 10점(매우 좋다) 중에 하나를 선택해주세요.',
  },
  {
    id: 'meaning',
    type: 'multi',
    required: true,
    max: 2,
    title: "나에게 '식사'는 어떤 의미인가요?",
    sub: '바로 눈에 들어오는 단어를 두 개 선택해주세요.',
    options: [
      '따뜻함',
      '돌봄',
      '연결',
      '위로',
      '일상',
      '만족(배부름)',
      '귀찮음',
      '부담',
      '긴장',
      '죄책감',
      '통제(다이어트)',
      '해당 없음',
    ].map((v) => ({ label: v, value: v })),
  },
  {
    id: 'table',
    type: 'multi',
    required: true,
    title: '앞으로 어떤 식탁을 만들고 싶나요?',
    sub: '해당하는 것을 모두 선택해주세요.',
    options: [
      '나와 가족이 건강한 식탁',
      '제철과 지역의 먹거리를 즐기는 식탁',
      '지구 환경을 생각하는 식탁',
      '함께 만들고 나누는 즐거운 식탁',
      '배운 것을 다른 사람에게 전하는 식탁',
    ].map((v) => ({ label: v, value: v })),
  },
  {
    id: 'experience',
    type: 'multi',
    required: true,
    max: 2,
    title: '지금 나에게 가장 필요한 식문화 경험 두 가지를 골라주세요',
    emphasize: '두 가지',
    sub: '선택한 항목에 따라 다음 질문이 달라져요.',
    options: [
      { label: '식사 너머의 이야기를 알고 싶어요.', value: '인식' },
      { label: '건강한 식사를 일상에서 실천하고 싶어요.', value: '실천' },
      { label: '음식과 자연·지역의 연결을 경험하고 싶어요.', value: '확장' },
      { label: '좋은 식경험을 교육과 활동으로 나누고 싶어요.', value: '안내' },
    ],
  },
];

/** Q8 응답(태그)에 따라 조건부로 삽입되는 분기 질문들 */
export const branchDefs: Record<ExperienceTag, Question> = {
  인식: {
    id: 'branch_인식',
    type: 'multi',
    required: true,
    branchTag: '인식',
    title: '인식하기 · 식사 너머 어떤 이야기가 궁금한가요?',
    options: [
      '생산: 먹거리를 누가, 어디에서, 어떻게 기르는지(산/들/바다/논)',
      '가공: 식재료가 음식이 되는 과정(발효/가공식품/조미료)',
      '유통과 관계: 먹거리가 식탁까지 오는 길과 그 안의 사람들(로컬푸드/민중교역/시장)',
      '소비: 무엇을 기준으로 먹거리를 선택할지(제철/동물복지/채식)',
      '폐기와 순환: 먹고 남은 것이 어디로 가고 어떻게 순환하는지(업사이클링/토종씨앗/친환경)',
    ].map((v) => ({ label: v, value: v })),
  },
  실천: {
    id: 'branch_실천',
    type: 'multi',
    required: true,
    branchTag: '실천',
    title: '실천하기 · 일상의 식사에서 무엇을 해보고 싶나요?',
    options: [
      '식재료와 조리법을 이해하고 직접 요리해보고 싶어요.',
      '나의 몸과 마음을 관찰하며 일상적인 식사 습관과 태도를 바꿔보고 싶어요.',
    ].map((v) => ({ label: v, value: v })),
  },
  확장: {
    id: 'branch_확장',
    type: 'multi',
    required: true,
    branchTag: '확장',
    title: '확장하기 · 식사를 어디까지 연결해 보고 싶나요?',
    options: [
      { label: '농부를 만나 식재료의 생산 과정과 생산자의 이야기를 알고 싶어요.', value: '농가방문' },
      {
        label: '지역의 자연과 먹거리, 사람을 직접 만나 그곳의 삶을 깊이 경험하고 싶어요.',
        value: '생태미식캠프',
      },
      {
        label: '지역의 먹거리 문제를 발견하고, 더 나은 식문화를 직접 기획하고 만들어 보고 싶어요.',
        value: '식문화PBL',
      },
    ],
  },
  안내: {
    id: 'branch_안내',
    type: 'multi',
    required: true,
    branchTag: '안내',
    title: '안내하기 · 좋은 식경험을 다른 사람의 배움으로 연결하고 싶나요?',
    options: [
      { label: '식문화 교육과 활동을 직접 기획하고 진행하는 방법을 배우고 싶어요.', value: '퍼실리테이터' },
    ],
  },
};

/** 분기 질문이 삽입될 때 사용할 순서 */
export const branchOrder: ExperienceTag[] = ['인식', '실천', '확장', '안내'];

/** Q9, Q10(마지막 질문) */
export const baseAfter: Question[] = [
  {
    id: 'audience',
    type: 'multi',
    required: true,
    title: '누구와 경험을 나누고 싶나요?',
    sub: '해당하는 것을 모두 선택해주세요.',
    options: [
      { label: '어린이·청소년', value: '어린이·청소년' },
      { label: '느린학습자', value: '느린학습자' },
      { label: '가족', value: '가족' },
      { label: '성인', value: '성인' },
      { label: '동료·이웃·지역주민', value: '동료·이웃·지역주민' },
      { label: '교사·활동가·교육 기획자', value: '교사·활동가·교육 기획자' },
      { label: '기관·단체 구성원', value: '기관·단체 구성원' },
      { label: '기타', value: '기타', other: true },
    ],
  },
  {
    id: 'contact',
    type: 'text',
    required: false,
    inputType: 'tel',
    title: '연락처를 알려주세요 (선택)',
    sub: '남겨주신 연락처는 교육 안내 및 상담 목적으로만 활용되며, 입력하신 경우 개인정보 수집·이용에 동의하신 것으로 간주합니다. (선택 응답)',
    placeholder: '연락처를 입력해주세요',
  },
  {
    id: 'newsletter_email',
    type: 'text',
    required: false,
    inputType: 'email',
    title: '벗밭의 교육 소식을 받고 싶다면 이메일을 적어주세요 (선택)',
    sub: '남겨주신 이메일은 벗밭의 교육 소식을 전해드리는 용도로만 활용되며, 입력하신 경우 개인정보 수집·이용에 동의하신 것으로 간주합니다. (선택 응답)',
    placeholder: '이메일을 입력해주세요',
  },
  {
    id: 'feedback',
    type: 'textarea',
    required: false,
    title: '추가적으로 벗밭에게 남기고 싶은 말씀이 있으시다면 남겨주세요.',
    sub: '모든 의견은 저희에게 큰 힘이 됩니다. (선택 응답)',
    placeholder: '자유롭게 남겨주세요',
  },
];
